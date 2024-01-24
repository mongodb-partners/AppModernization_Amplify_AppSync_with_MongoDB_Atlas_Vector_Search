
# Question Answers App

## Introduction
The Question Answers Application is an innovative solution designed to chat with documents. It leverages AWS Bedrock Titan/Claude models to offer a seamless and efficient  chat experience.

### Technologies Used
- AWS Amplify
- Bedrock Titan/Claude models
- MongoDB
- Angular
- AWS Lambda
- AWS S3
- AWS AppSync


## Components Overview
### 1. Bedrock models
- The Bedrock models forms the backbone of our document search.

### 2. Data Ingestion
- Amplify UI has an upload screen where the users can upload the documents
- These images are then processed through the AWS Bedrock models to create embeddings.
- The embeddings, along with associated metadata, are ingested into MongoDB, which acts as our vector store.

### 3. Chat with documents
- The application features an Angular-based Amplify UI.
- It includes a chat based web interface to chat with documents
- The user can select a category on which he wants to query
- The chatbot interface will allow the user to query and get response

## Setup Instructions
### Local Setup
#### Prerequisites
- AWS account
- Amplify CLI installed
- Node.js installed

#### Clone the Repository
```
git clone <repository-url>
cd question-answers-app
```

#### Install Dependencies
```
npm install
```

#### AWS Configuration
- Configure AWS services such as Amplify, Sagemaker, S3, Lambda following the AWS documentation.

#### Environment Variables
- Set up the necessary environment variables in a [environment](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/main/question-answers-app/src/environments/environment.prod.ts) file.
- A sample file is
```
export const environment = {
    production: true,
    s3Bucket: 'xxx',
    s3Folder: 'xxx',
    s3Region: 'xxx',
  };
```

#### Launching the Application
```
amplify init
amplify publish
ng serve
```

### Reference Links
- [Getting Started with AWS Amplify for Angular](https://docs.amplify.aws/angular/start/getting-started/introduction/)

## Usage
To use the app:
1. Navigate to the UI.
2. Drag and drop an image into the upload area or select an image from your device.
3. Choose a category for the image.
4. View the search results displayed based on the image content.

