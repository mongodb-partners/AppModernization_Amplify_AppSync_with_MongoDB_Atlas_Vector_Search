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

# Environment variables
aws_access_key_id = os.environ.get('ACCESS_KEY_ID')
aws_secret_access_key = os.environ.get('SECRET_ACCESS_KEY')
mongodb_uri = os.environ.get('MONGO_DB_URI')
model_id_embed = os.environ.get('MODEL_ID', 'amazon.titan-embed-text-v1')
model_id_qa_titan = os.environ.get('MODEL_ID_QA', 'amazon.titan-text-express-v1')
model_id_qa_claude = os.environ.get('MODEL_ID_QA_CLAUDE', 'anthropic.claude-v2')
model_choice = os.environ.get('MODEL_CHOICE', 'TITAN')  # New environment variable for model choice
model_body_json = os.environ.get('MODEL_BODY_JSON')  # New environment variable for the model body
max_tokens = int(os.environ.get('MAX_TOKENS', 200))
mongo_db = os.environ.get('MONGO_DB')
mongo_coll = os.environ.get('MONGO_COLL')
model_body_json = os.environ.get('MODEL_BODY_JSON')
mdb_index_name = os.environ.get('MONGO_INDEX_NAME')
#model_body_json_claude = os.environ.get('MODEL_BODY_JSON_CLAUDE')
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
        try:
            # Choose the response path based on the MODEL_CHOICE environment variable
            if model_choice.upper() == 'TITAN':
                response_path = os.environ.get('RESPONSE_PATH', 'results[0].outputText')
                body = json.loads(model_body_json)
                body['inputText'] = f"Question: {prompt}\n\nContext: ... \n\nAnswer:"
                model_id = model_id_qa_titan
            else:  # Default to Claude model
                response_path = os.environ.get('RESPONSE_PATH', 'completion')
                body = json.loads(model_body_json)
                enclosed_prompt = f"Human: {prompt}\n\nAssistant:"
                body['prompt'] = enclosed_prompt
                model_id = model_id_qa_claude

            # Invoke the model
            response = self.bedrock_runtime_client.invoke_model(
                modelId=model_id, body=json.dumps(body))

            response_body = json.loads(response["body"].read())

            # Dynamic response parsing
            answer = self.parse_response(response_body, response_path)
            return answer

        except ClientError as e:
            print(f"Couldn't invoke model {model_id}", e)
            raise

    def parse_response(self, response_body, response_path):
        """Dynamically parse the response based on the response path."""
        keys = response_path.split('.')
        result = response_body
        for key in keys:
            if '[' in key and ']' in key:
                key, index = key[:-1].split('[')
                result = result.get(key, [])[int(index)]
            else:
                result = result.get(key, '')
        return result


def lambda_handler(event, context):
    global client
    try:
        question = event.get('question')
        category = event.get('category')

        if not question:
            raise ValueError("Question is required")

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
                "index": mdb_index_name
            }
        }]

        if category:
            aggregate_query[0]["$vectorSearch"]["filter"] = {"category": category}

        # Execute the aggregate query
        relevant_texts = collection.aggregate(aggregate_query)
        context = ' '.join(doc['text'] for doc in relevant_texts)

        # Generate an answer using AWS Titan or Claude
        answer = wrapper.invoke_titan_chat(f"Question: {question}\n\nContext: {context}\n\nAnswer:")
        answer_cleaned = answer.replace('\n', '')
        return {
            'statusCode': 200,
            'body': json.dumps(answer_cleaned)
        }

    except ValueError as val_err:
        return {
            'statusCode': 400,
            'body': json.dumps(f"Value Error: {val_err}")
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f"An unexpected error occurred: {str(e)}")
        }
    finally:
        try:
            client.close()
        except NameError:
            pass


# For local testing
if __name__ == "__main__":
    test_event = {
        "question": "what value is Gold holdings at April 30 in SDR?",
        "category": "Financial"
    }
    print(lambda_handler(test_event, None))
