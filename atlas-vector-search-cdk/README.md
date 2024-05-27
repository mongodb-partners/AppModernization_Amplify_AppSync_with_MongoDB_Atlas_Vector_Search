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

Commands and Links: 
https://github.com/jqlang/jq/releases
https://www.python.org/downloads/release/python-3122/
https://www.npmjs.com/package/npm/v/10.5.0
npm install -g @aws-amplify/cli@12.11.0
npm install -g aws-cdk@2.135.0
aws configure

- **Example Installing Prerequisites in Amazon EC2 Linux Machine**
Refer [EC2SETUP.md](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/cdk_enabled_deployment/atlas-vector-search-cdk/EC2SETUP.md)

## Usage

1. Clone this repository.
2. Install dependencies referring EC2SETUP.md guide.
3. update global-args.json. 
    - "ATLAS_PUBLIC_KEY": // Atlas Public API Key to access to Atlas services 
    - "ATLAS_PRIVATE_KEY": // Atlas Private API Key to access to Atlas services 
    - "orgId": // Atlas Org ID under the CDK will create the Cluster
    - "projectId": // Atlas Project ID under the CDK will create the Cluster
    - "clusterName": "atlas-vector-search-cluster" // Atlas Default Cluster Name
    - "region": "US_EAST_1" // Atlas Default Cluster Region
    - "instanceSize": "M10" // Atlas Default Cluster Instance Size
    - "dataAPI": // Atlas Data API. Refer [AtlasDataAPI](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/cdk_enabled_deployment/atlas-vector-search-cdk/ATLASDATAAPI.md)
    - "ImageSearchAppSync.MDB_SECRET":// Atlas DataApi's API Key. Refer [AtlasDataAPI](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/cdk_enabled_deployment/atlas-vector-search-cdk/ATLASDATAAPI.md)
4. Run deploy.sh

## Expectations

- **Tool Compatibility**: The project is expected to work with the "expect" tool. (https://man7.org/linux/man-pages/man1/expect.1.html)
- **AWS Default Profile**: The project assumes that the AWS default profile will be used for authentication.
- **Pip Install**: Ensure that python version 3.12 is installed. (pip3 --version should work)
- **MongoDB Atlas CDK Resource Activation**: Make sure to activate Atlas CDK resources in your AWS account before running the project.
- **Atlas Data API**: Make Sure you activate Atlas Data API and create API Key to Access it. For more information follow [AtlasDataAPI](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/cdk_enabled_deployment/atlas-vector-search-cdk/ATLASDATAAPI.md)
- **Sage Maker Playbook**: Run this [playbook](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/cdk_enabled_deployment/atlas-vector-search-cdk/resources/image-search/SagemakerNotebook/README.md) for creating CLIP models and setting up the data in mongodb and AWS S3
- **Creating Search Indexes on Cluster**: Using the application first time, Once we have the data in the cluster we have to create search index. With these [Document Search mapping](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/cdk_enabled_deployment/atlas-vector-search-cdk/resources/document-search/Mongodb/searchindex.json). 
[Image Search mapping](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/cdk_enabled_deployment/atlas-vector-search-cdk/resources/image-search/Mongodb/searchindex.json)
You can even use the helper Script to create the search index [deployAtlasSearchIndex.sh](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/cdk_enabled_deployment/atlas-vector-search-cdk/deployAtlasSearchIndex.sh)
- 
