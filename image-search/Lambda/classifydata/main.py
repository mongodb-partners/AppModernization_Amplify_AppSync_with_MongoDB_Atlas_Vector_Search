import json
import os
import boto3
import pymongo
from pymongo import MongoClient
from urllib.parse import quote_plus
from botocore.exceptions import ClientError
import certifi
from pathlib import Path

# Load environment variables from .env file if it exists
env_path = Path('.') / '.env'
if env_path.is_file():
    from dotenv import load_dotenv

    load_dotenv(env_path)

# Assuming environment variables are set in the Lambda's configuration
aws_access_key_id = os.environ['ACCESS_KEY_ID']
aws_secret_access_key = os.environ['SECRET_ACCESS_KEY']
region_name = os.environ['REGION']
cluster_conn_string = os.environ.get('CLUSTER_CONN_STRING')
db_user = os.environ.get('DB_USER')
db_pwd = os.environ.get('DB_PWD')
safe_db_user = quote_plus(db_user)
safe_db_pwd = quote_plus(db_pwd)
mongodb_uri = f"mongodb+srv://{safe_db_user}:{safe_db_pwd}@{cluster_conn_string.split('//')[1]}/?retryWrites=true&w=majority"

mongo_db = os.environ['MONGO_DB']
mongo_coll = os.environ['MONGO_COLL']
model_body_json = os.environ.get('MODEL_BODY_JSON')
# bedrock_runtime_client = boto3.client(service_name="bedrock-runtime", region_name=region_name,
#                                       aws_access_key_id=aws_access_key_id,
#                                       aws_secret_access_key=aws_secret_access_key)

s3 = boto3.client('s3', region_name=region_name)
bedrock_runtime_client = boto3.client(service_name="bedrock-runtime", region_name=region_name)

response_path = os.environ.get('RESPONSE_PATH', 'completion')


def parse_response(response_body, response_path):
    """Dynamically parse the response based on the response path."""
    keys = response_path.split('.')
    result = response_body
    for key in keys:
        if '[' in key and ']' in key:
            key, index = key[:-1].split('[')
            result = result.get(key, [])[int(index)]
        else:
            result = result.get(key, '')
    return result.strip()


def invoke_claude(text):
    model_id = os.environ['MODEL_ID_QA_CLAUDE']  # Make sure this is set to Claude's model ID
    body = json.loads(model_body_json)
    enclosed_prompt = f"Human: {text}\n\nAssistant:"
    body['prompt'] = enclosed_prompt
    try:
        response = bedrock_runtime_client.invoke_model(
            modelId=model_id,
            body=json.dumps(body)
        )
        response_body = json.loads(response['body'].read())
        answer = parse_response(response_body, response_path)
        return answer  # Adjust depending on Claude's response structure
    except ClientError as e:
        print("Couldn't invoke Claude model:", e)
        raise


def lambda_handler(event, context):
    # client = MongoClient(mongodb_uri)
    client = pymongo.MongoClient(mongodb_uri, tlsCAFile=certifi.where())
    db = client[mongo_db]
    image_metadata_collection = db['image_metadata']
    embeddings_collection = db['embeddings']

    try:
        for doc in image_metadata_collection.find():
            item_id = doc['item_id']
            description = doc['item_name_in_en_us']  # Assuming description to classify is here
            question = "Can you clasiify the context in terms of any of the one description[ecommerce, furniture,electronics,food]. I want the output strictly as a one word with the category of any of [ecommerce, furniture,electronics,food] without any explanation. Strictly one word output"
            # Call Claude to classify the description
            category = invoke_claude(f"Question: {question}\n\nContext: {description}\n\nAnswer:")

            # Update the corresponding document in the embeddings collection
            embeddings_collection.update_one(
                {"item_id": item_id},
                {"$set": {"category": category}}
            )
        return {
            'statusCode': 200,
            'body': json.dumps('Successfully processed and updated categories')
        }
    except Exception as e:
        print(f"An error occurred: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps('Error processing the request')
        }
    finally:
        client.close()


# For local testing
if __name__ == "__main__":
    test_event = {

    }
    print(lambda_handler(test_event, None))
