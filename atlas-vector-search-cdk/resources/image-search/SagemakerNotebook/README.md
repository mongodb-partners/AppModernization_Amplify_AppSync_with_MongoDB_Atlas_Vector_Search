# Sagemaker Notebook

## Prerequisites
- AWS Account with access to Amazon SageMaker, AWS Lambda, Amazon S3
- Follow the steps to onboard to [sagemaker domain](https://docs.aws.amazon.com/sagemaker/latest/dg/onboard-quick-start.html)
- MongoDB account and database setup.
- Update the below variables with actual values in the notebook [job](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/cdk_enabled_deployment/atlas-vector-search-cdk/resources/image-search/SagemakerNotebook/AWSClip_data_ingestion_multimodel.ipynb)

```
s3_bucket_name = ""
# Assuming environment variables are set in the Lambda's configuration
aws_access_key_id = ""
aws_secret_access_key = ""
region_name = ""


mongo_db = ""
mongo_coll = ""
model_body_json = "{\"max_tokens_to_sample\": 200, \"temperature\": 0.5, \"stop_sequences\": [\"\\\\n\\\\nHuman:\"]}"

mongo_uri = f""
db_name = ""
image_metadata_collection_name = ""

response_path ="completion"
bucket_name =""
prefix = ""
model_id = "anthropic.claude-v2"  
```

## Steps to run 
- Run the notebook [job](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/cdk_enabled_deployment/atlas-vector-search-cdk/resources/image-search/SagemakerNotebook/AWSClip_data_ingestion_multimodel.ipynb) in sagemaker studio.


## Step-by-Step Guide
This guide will walk you through the process of ingesting a dataset from Amazon public datasets (amazon-berkeley-objects), creating and deploying a CLIP model in SageMaker, using the CLIP model to create embeddings, ingesting these embeddings into MongoDB, and finally creating a vector search index in MongoDB for testing.

### 1. Ingest Dataset from Amazon Public Datasets
- Use the amazon-berkeley-objects dataset available in Amazon S3.
- The dataset includes images and metadata that can be utilized for machine learning models.


### 2. Create Embeddings Using the AWS Bedrock embedding mulitmodal (Titan Multimodal Embeddings G1)
- Utilize the Titan Multimodal Embeddings G1 model to generate embeddings from the dataset.
- Ensure the embeddings are correctly formatted for ingestion into MongoDB.

### 4. Ingest Embeddings into MongoDB
- Set up a MongoDB collection for storing the embeddings.
- Write a script to ingest the generated embeddings into MongoDB.

### 5. Ingest Metadata into a Separate MongoDB Collection
- In addition to embeddings, ingest the associated metadata into a separate collection in MongoDB.

### 6. Create a Vector Search Index in MongoDB
- Use the following JSON schema to create a vector search index in MongoDB:
```json
{
  "mappings": {
    "dynamic": true,
    "fields": {
      "category": {
        "normalizer": "lowercase",
        "type": "token"
      },
      "embedding": {
        "dimensions": 1024,
        "similarity": "cosine",
        "type": "knnVector"
      }
    }
  }
}
```

