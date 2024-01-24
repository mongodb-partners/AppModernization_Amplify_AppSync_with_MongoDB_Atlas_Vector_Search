
# Atlas Vector Search and AWS AI ML

## Introduction
This repository contains two sophisticated search applications: Image Search and Document Search. Both applications are designed using AWS technologies and advanced machine learning models. They provide intuitive UIs for user interaction and leverage AWS Amplify, AppSync, and Lambda for backend processing.

### Technologies Used
- AWS Amplify with Angular
- AWS AppSync
- AWS Lambda
- AWS S3
- AWS Textract (Document Search)
- MongoDB
- Machine Learning Models (CLIP, Amazon Titan, Anthropic Claude)

## Repository Structure
- `image-search-app/`: Contains all code and resources for the Image Search Application.
- `document-search-app/`: Contains all code and resources for the Document Search Application.
- `lambda-functions/`: AWS Lambda functions used as data sources for AWS AppSync.
- `Appsync/`: AWS Appsync data api which the Amplify UI app uses.

## Image Search Application Overview
- Upload and process images to search through a MongoDB vector database.
- Uses the  CLIP model for image processing.
- Angular-based Amplify UI for image upload and search results display.

## Document Search Application Overview
- Upload documents and perform question-answering based on content.
- Utilizes AWS Textract for document processing and Amazon Titan, Anthropic Claude models for question-answering.
- Amplify UI features a ChatGPT-like interface for user queries.

## Setup Instructions
### Prerequisites
- AWS account
- Amplify CLI installed
- Node.js installed

### Common Setup for Both Applications
1. Data setup in MongoDB
   - Run the [notebook](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/tree/main/SagemakerNotebook) to create a Clip model    
 and ingest dataset for image search
   
2. Clone the Repository
   ```
   gh repo clone mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search
   ```

4. Install Dependencies for Amplify UI
   follow the instructions for installing dependencies
   - [image search app](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/main/image-search-app/README.md).
   - [question answers app](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/main/question-answers-app/README.md).
     
6. AWS Configuration
   - Configure AWS services like S3, Lambda, Textract, and AppSync following AWS documentation.

7. Environment Variables Setup
   - Set up necessary environment variables in `.env` files for each application.

8. Create Lambda functions 
   - Create lambda functions using the code in the repo following the [instructions](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/main/Lambda/README.md).   
   
9. Create AppSync API
   - Create Appsync API using the [schema](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/main/Appsync/documentsearch/README.md) defined in the repo.
   - Use the lambda functions as the data source   

10. Create Clip models and ingest Dataset
   - Run the [notebook](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/tree/main/SagemakerNotebook) to create a Clip model and ingest dataset for image search

11. Launching the Applications
   ```
   amplify init
   amplify publish
   ng serve
   ```

### Reference Links
- [Getting Started with AWS Amplify for Angular](https://docs.amplify.aws/angular/start/getting-started/introduction/)

## Usage
### Image Search Application
- Navigate to the Image Search UI.
- Upload images and view search results based on image content.

### Document Search Application
- Navigate to the Document Search UI.
- Upload documents, ask questions, and receive answers based on the document content.


