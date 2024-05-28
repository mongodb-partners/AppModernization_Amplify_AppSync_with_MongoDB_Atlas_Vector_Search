# Atlas Vector Search and AWS AI ML

## Introduction
This repository contains two sophisticated search applications: Image Search and Document Search. Both applications are designed using AWS technologies and advanced machine learning models. They provide intuitive UIs for user interaction and leverage AWS Amplify, AppSync, and Lambda for backend processing.

### Technologies Used
- AWS CDK
- AWS Amplify with Angular
- AWS AppSync
- AWS Lambda
- AWS S3
- AWS Textract (Document Search)
- MongoDB
- Machine Learning Models (CLIP, Amazon Titan, Anthropic Claude)

## Dependencies

Before running this project, please ensure you have the following dependencies installed:

- **CDK 2.135.0**
- **Amplify CLI 12.11.0**
- **npm 10.5.0**
- **npx 10.5.0**
- **jq 1.7.1**
- **Python 3.12**
- **expect 5.45**

## Expectations

- **AWS Default Profile**: The project uses AWS default profile for authentication.
- **MongoDB Atlas CDK Resource Activation**: Make sure to activate Atlas CDK resources in your AWS account before running the project.
    1. MongoDB::Atlas::SearchIndex
    2. MongoDB::Atlas::Cluster
    3. MongoDB::Atlas::DatabaseUser

## Usage

1. Clone this repository.
2. Install dependencies referring [EC2SETUP.md](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/cdk_enabled_deployment/atlas-vector-search-cdk/EC2SETUP.md) guide.
3. Create an organization, if not available already and save the Organization ID. [Doc](https://www.mongodb.com/docs/atlas/government/tutorial/create-organization/)
4. Create a project, if not available already and save the Project ID. [Doc](https://www.mongodb.com/docs/atlas/government/tutorial/create-project/)
5. Create access key (Public Key and Private Key) with which we can programmatically access MongoDB Atlas Project. [Doc](https://www.mongodb.com/docs/atlas/configure-api-access/#grant-programmatic-access-to-a-project)
6. Follow Steps in [AtlasDataAPI](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/cdk_enabled_deployment/atlas-vector-search-cdk/ATLASDATAAPI.md) enable DataAPI for project level and fetch the URL endpoint and Create API Key to access the Data API.
7. We have global-args.json which takes variables for deployment. Kindly update the variables as required. 
    - "ATLAS_PUBLIC_KEY": // Atlas Public Key that is created in Step 5 
    - "ATLAS_PRIVATE_KEY": // Atlas Private Key that is created in Step 5 
    - "orgId": // Atlas Org ID that is created in Step 3
    - "projectId": // Atlas Project ID that is created in Step 4
    - "clusterName": "atlas-vector-search-cluster" // this is default cluster name. Kindly edit if needed.
    - "region": "US_EAST_1" // this is default cluster region. Kindly edit if needed.
    - "instanceSize": "M10" // this is default cluster size. Kindly edit if needed.
    - "dataAPI": // Base URL from Step 6.
    - "ImageSearchAppSync.MDB_SECRET":// Atlas DataApi's API Key from Step 6.
8. Run deploy.sh
9. Sage Maker Playbook: Run this [playbook](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/cdk_enabled_deployment/atlas-vector-search-cdk/resources/image-search/SagemakerNotebook/README.md) for creating CLIP models and setting up the data in mongodb and AWS S3.
10. Follow Steps in [AtlasDataAPI](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/cdk_enabled_deployment/atlas-vector-search-cdk/ATLASDATAAPI.md) enable "Read and Write" permissions for the cluster with cluster name from Step 7
11. While using the application first time, Once we have the data in the cluster, Create the required search indexes with these [Document Search mapping](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/cdk_enabled_deployment/atlas-vector-search-cdk/resources/document-search/Mongodb/searchindex.json) and  
[Image Search mapping](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/cdk_enabled_deployment/atlas-vector-search-cdk/resources/image-search/Mongodb/searchindex.json)
You can even use the helper Script to create the search index [deployAtlasSearchIndex.sh](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/cdk_enabled_deployment/atlas-vector-search-cdk/deployAtlasSearchIndex.sh)
