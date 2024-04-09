import json
import boto3
from pymongo import MongoClient
from botocore.exceptions import ClientError
import time
import os
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
model_id = os.environ.get('MODEL_ID', 'amazon.titan-embed-text-v1')  # Default value if not set
max_tokens = int(os.environ.get('MAX_TOKENS', 200))  # Default value if not set
mongo_db = os.environ.get('MONGO_DB')
mongo_coll = os.environ.get('MONGO_COLL')
region_name = os.environ.get('REGION')

# Initialize AWS services

s3 = boto3.client('s3')
textract = boto3.client('textract')
bedrock_runtime_client = boto3.client(service_name="bedrock-runtime", region_name=region_name)
#
# s3 = boto3.client('s3',aws_access_key_id=aws_access_key_id,aws_secret_access_key=aws_secret_access_key)
# textract = boto3.client('textract',aws_access_key_id=aws_access_key_id,aws_secret_access_key=aws_secret_access_key)
# bedrock_runtime_client = boto3.client(service_name="bedrock-runtime", region_name=region_name,aws_access_key_id=aws_access_key_id,aws_secret_access_key=aws_secret_access_key)


class BedrockRuntimeWrapper:
    """Encapsulates Amazon Bedrock Runtime actions."""

    def __init__(self, bedrock_runtime_client):
        self.bedrock_runtime_client = bedrock_runtime_client

    def invoke_titan(self, text):
        try:
            body = {"inputText": text}
            response = self.bedrock_runtime_client.invoke_model(
                modelId=model_id, body=json.dumps(body))
            response_body = json.loads(response["body"].read())
            return response_body["embedding"]
        except ClientError:
            print("Couldn't invoke Amazon Titan Embed Text")
            raise


def lambda_handler(event, context):
    try:
        bucket_name = event['Records'][0]['s3']['bucket']['name']
        file_key = event['Records'][0]['s3']['object']['key']

        # Get the object from S3
        response = s3.get_object(Bucket=bucket_name, Key=file_key)
        pdf_file = response['Body'].read()
        metadata = response['Metadata']
        category = metadata.get('category', '')
        # Start a Textract job
        start_job_response = textract.start_document_text_detection(
            DocumentLocation={'S3Object': {'Bucket': bucket_name, 'Name': file_key}})
        job_id = start_job_response['JobId']

        # Check the job status
        def check_job_status(job_id):
            job_status_response = textract.get_document_text_detection(JobId=job_id)
            if job_status_response['JobStatus'] == 'IN_PROGRESS':
                # Wait for 5 seconds
                time.sleep(5)
                return check_job_status(job_id)
            return job_status_response

        # Wait for Textract job to complete
        job_status_response = check_job_status(job_id)

        # Process the extracted text chunks
        text_blocks = [block['Text'] for block in job_status_response['Blocks']
                       if block['BlockType'] == 'LINE']
        full_text = ' '.join(text_blocks)
        chunk_size = 1000
        text_chunks = [full_text[i:i + chunk_size] for i in range(0, len(full_text), chunk_size)]

        # Initialize MongoDB client
        client = MongoClient(mongodb_uri, tlsCAFile=certifi.where())
        collection = client[mongo_db][mongo_coll]  # Replace with your database and collection

        # Generate embeddings for the text and store in MongoDB
        wrapper = BedrockRuntimeWrapper(bedrock_runtime_client)
        # embedding = wrapper.invoke_titan(full_text)
        #
        # # Store in MongoDB
        # collection.insert_one({'file_key': file_key, 'text': full_text, 'embedding': embedding,'category':category})
        for chunk_index, text_chunk in enumerate(text_chunks):
            # Generate embeddings for each chunk
            embedding = wrapper.invoke_titan(text_chunk)

            # Store each chunk in MongoDB
            collection.insert_one({
                'file_key': file_key,
                'chunk_index': chunk_index,
                'text': text_chunk,
                'embedding': embedding,
                'category': category
            })
        return {
            'statusCode': 200,
            'body': f'Processed file: {file_key}'
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps('Error processing file')
        }


# For local testing (if needed)
if __name__ == "__main__":
    test_event = {
    "Records": [
      {
        "s3": {
          "bucket": {
            "name": "sampleimages-imagesearch"
          },
          "object": {
            "key": "pdfextracttitan/2022-financial-statements.pdf"
          }
        }
      }
    ]
  }
    lambda_handler(test_event, None)
