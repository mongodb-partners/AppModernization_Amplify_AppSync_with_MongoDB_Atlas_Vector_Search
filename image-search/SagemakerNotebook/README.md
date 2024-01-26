# Sagemaker Notebook

## Prerequisites
- AWS Account with access to Amazon SageMaker, AWS Lambda, Amazon S3
- Follow the steps to onboard to [sagemaker domain](https://docs.aws.amazon.com/sagemaker/latest/dg/onboard-quick-start.html)
- MongoDB account and database setup.
- Update the below variables with actual values in the notebook [job](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/main/image-search/SagemakerNotebook/AWSClip.ipynb)

```
s3_bucket_name = sagemaker.session.Session().default_bucket()
# Replace the following with your MongoDB connection details
mongo_uri = "MDB_URL"
db_name = "vectorsearch"
image_metadata_collection_name = "image_metadata"
embeddings_collection_name = "embeddings"
```

## Steps to run 
- Run the notebook [job](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/main/image-search/SagemakerNotebook/AWSClip.ipynb) in sagemaker studio.


## Step-by-Step Guide
This guide will walk you through the process of ingesting a dataset from Amazon public datasets (amazon-berkeley-objects), creating and deploying a CLIP model in SageMaker, using the CLIP model to create embeddings, ingesting these embeddings into MongoDB, and finally creating a vector search index in MongoDB for testing.

### 1. Ingest Dataset from Amazon Public Datasets
- Use the amazon-berkeley-objects dataset available in Amazon S3.
- The dataset includes images and metadata that can be utilized for machine learning models.

### 2. Create and Deploy CLIP Model in SageMaker
- Set up a SageMaker environment.
- Create a Jupyter notebook in SageMaker.
- Implement the code for loading, training, and deploying the CLIP model.

### 3. Create Embeddings Using the CLIP Model
- Utilize the deployed CLIP model to generate embeddings from the dataset.
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

## Steps to run 
}
```
### 7. Perform a Vector Search Test
- Finally, test the setup by performing a vector search in MongoDB.
- Use the embeddings and the search index to retrieve relevant results based on the query
