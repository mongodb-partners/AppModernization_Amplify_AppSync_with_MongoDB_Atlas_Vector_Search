import json
import boto3
import os
import pymongo
from botocore.exceptions import ClientError
from pathlib import Path
import certifi

# Load environment variables from .env file if it exists
env_path = Path('.') / '.env'
if env_path.is_file():
    from dotenv import load_dotenv

    load_dotenv(env_path)
aws_access_key_id = os.environ.get('ACCESS_KEY_ID')
aws_secret_access_key = os.environ.get('SECRET_ACCESS_KEY')
mongodb_uri = os.environ.get('MONGO_DB_URI')
model_id_embed = os.environ.get('MODEL_ID', 'amazon.titan-embed-text-v1')  # Default value if not set
model_id_qa = os.environ.get('MODEL_ID_QA', 'amazon.titan-text-express-v1')

model_id_qa_claude = os.environ.get('MODEL_ID_QA_CLAUDE')
max_tokens = int(os.environ.get('MAX_TOKENS', 200))  # Default value if not set
mongo_db = os.environ.get('MONGO_DB')
mongo_coll = os.environ.get('MONGO_COLL')
# Initialize AWS services
# s3 = boto3.client('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)
# bedrock_runtime_client = boto3.client(service_name="bedrock-runtime", region_name="us-east-1",
#                                       aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)


s3 = boto3.client('s3', region_name='us-east-2')
bedrock_runtime_client = boto3.client(service_name="bedrock-runtime", region_name="us-east-1")


class BedrockRuntimeWrapper:
    """Encapsulates Amazon Bedrock Runtime actions."""

    def __init__(self, bedrock_runtime_client):
        self.bedrock_runtime_client = bedrock_runtime_client

    def invoke_titan(self, text):
        try:
            body = {"inputText": text}
            response = self.bedrock_runtime_client.invoke_model(
                modelId=model_id_embed, body=json.dumps(body))
            response_body = json.loads(response["body"].read())
            return response_body["embedding"]
        except ClientError as e:
            print("Couldn't invoke Amazon Titan Embed Text", e)
            raise

    def invoke_titan_chat(self, prompt):
        """Generate text using Titan (simulated for text generation)."""
        try:
            # Simulating a text generation request (modify as per actual AWS API)
            # body = {
            #     "inputText": prompt,
            #     "textGenerationConfig": {
            #         "maxTokenCount": max_tokens,
            #         "stopSequences": [],
            #         "temperature": 0,
            #         "topP": 1
            #     }
            # }
            enclosed_prompt = "Human: " + prompt + "\n\nAssistant:"
            body = {
                "prompt": enclosed_prompt,
                "max_tokens_to_sample": 200,
                "temperature": 0.5,
                "stop_sequences": ["\n\nHuman:"],
            }

            response = self.bedrock_runtime_client.invoke_model(
                modelId=model_id_qa_claude, body=json.dumps(body))  # Adjust model ID as needed

            response_body = json.loads(response["body"].read())
            return response_body.get('results', [{}])[0].get('outputText', '')
        except ClientError:
            print("Couldn't invoke Amazon Titan Text Express")
            raise


# def lambda_handler(event, context):
#     question = event.get('question')
#     category = event.get('category')
#
#     # Initialize Bedrock Runtime client
#     # bedrock_runtime_client = boto3.client(service_name="bedrock-runtime", region_name="us-east-1")
#     wrapper = BedrockRuntimeWrapper(bedrock_runtime_client)
#
#     # Generate an embedding for the question using Titan
#     question_embedding = wrapper.invoke_titan(question)
#     question_embedding_float = [float(i) for i in question_embedding]
#     all_floats = all(isinstance(item, float) for item in question_embedding_float)
#     print("All elements are float:", all_floats)
#     # Connect to MongoDB and perform a vector search
#     client = pymongo.MongoClient(mongodb_uri, tlsCAFile=certifi.where())
#     # client = pymongo.MongoClient(mongodb_uri)
#     collection = client[mongo_db][mongo_coll]
#
#     # Determine the aggregate query based on category
#     aggregate_query = [{
#         "$vectorSearch": {
#             "queryVector": question_embedding_float,
#             "path": "embedding",
#             "numCandidates": 100,
#             "limit": 4,
#             "index": "documentsearch"
#         }
#     }]
#
#     if category:
#         aggregate_query[0]["$vectorSearch"]["filter"] = {"category": category}
#
#     # Execute the aggregate query
#     relevant_texts = collection.aggregate(aggregate_query)
#     context = ' '.join(doc['text'] for doc in relevant_texts)
#     print("context:", context)
#     print(f"Question: {question}\n\nContext: {context}\n\nAnswer:")
#     # Generate an answer using AWS Titan (replacing OpenAI's GPT)
#     answer = wrapper.invoke_titan_chat(f"Question: {question}\n\nContext: {context}\n\nAnswer:")
#     print("answer:", answer)
#     client.close()
#
#     return {
#         'statusCode': 200,
#         'body': json.dumps(answer)
#     }
def lambda_handler(event, context):
    global client
    try:
        question = event.get('question')
        category = event.get('category')

        if not question:
            raise ValueError("Question is required")

        # Initialize Bedrock Runtime client
        # bedrock_runtime_client = boto3.client(service_name="bedrock-runtime", region_name="us-east-1")
        wrapper = BedrockRuntimeWrapper(bedrock_runtime_client)

        # Generate an embedding for the question using Titan
        question_embedding = wrapper.invoke_titan(question)
        question_embedding_float = [float(i) for i in question_embedding]

        if not all(isinstance(item, float) for item in question_embedding_float):
            raise ValueError("Question embedding conversion to float failed")

        # Connect to MongoDB and perform a vector search
        client = pymongo.MongoClient(mongodb_uri, tlsCAFile=certifi.where())
        collection = client[mongo_db][mongo_coll]

        # Determine the aggregate query based on category
        aggregate_query = [{
            "$vectorSearch": {
                "queryVector": question_embedding_float,
                "path": "embedding",
                "numCandidates": 100,
                "limit": 4,
                "index": "documentsearch"
            }
        }]

        if category:
            aggregate_query[0]["$vectorSearch"]["filter"] = {"category": category}

        # Execute the aggregate query
        relevant_texts = collection.aggregate(aggregate_query)
        context = ' '.join(doc['text'] for doc in relevant_texts)

        # Generate an answer using AWS Titan
        answer = wrapper.invoke_titan_chat(f"Question: {question}\n\nContext: {context}\n\nAnswer:")

        return {
            'statusCode': 200,
            'body': json.dumps(answer)
        }


    except ValueError as val_err:
        return {
            'statusCode': 400,
            'body': json.dumps(f"Value Error: {val_err}")
        }
    except Exception as e:
        # Catch any other exceptions which have not been caught by the above
        return {
            'statusCode': 500,
            'body': json.dumps(f"An unexpected error occurred: {str(e)}")
        }
    finally:
        # Ensure that the MongoDB client is closed in the end
        try:
            client.close()
        except NameError:
            # If 'client' was never defined because of an early error, pass silently
            pass


# For local testing
if __name__ == "__main__":
    test_event = {
        "question": "what value is Gold holdings at April 30 in SDR?",
        "category": "Financial"
    }
    print(lambda_handler(test_event, None))
