
# Image Search Application 

## Introduction
The Image Search Application is an innovative solution designed to search through a MongoDB vector database using image content. It leverages AWS technologies and the  CLIP model deployed on Sagemaker to offer a seamless and efficient image searching experience.

### Technologies Used
- AWS Amplify
- AWS Sagemaker
- CLIP Model
- MongoDB
- Angular
- AWS Lambda
- AWS S3
- AWS AppSync


## Components Overview
### 1. CLIP Model Creation
- The CLIP model is deployed in AWS Sagemaker using an AWS Amplify Studio notebook. This model forms the backbone of our image processing and embedding generation.

### 2. Data Ingestion
- Images are downloaded from public datasets using an AWS Amplify Studio notebook.
- These images are then processed through the CLIP model to create embeddings.
- The embeddings, along with associated metadata, are ingested into MongoDB, which acts as our vector store.

### 3. Data Search
- The application features an Angular-based Amplify UI.
- It includes a drag-and-drop interface for image upload. Uploaded images are stored in an AWS S3 bucket.
- The UI allows users to select a category for their image, which is stored as metadata in S3.
- Upon image upload, a GraphQL call is made using AWS AppSync, triggering a Lambda function.
- The Lambda function reads the image and metadata from S3, generates an embedding using the CLIP model, and performs a vector search in MongoDB.
- Search results are filtered based on the selected category and displayed in the UI.

## Setup Instructions
### Local Setup
#### Prerequisites
- AWS account
- Amplify CLI installed
- Node.js installed

#### Clone the Repository
```
git clone <repository-url>
cd image-search-app
```

#### Install Dependencies
```
npm install
```

#### AWS Configuration
- Configure AWS services such as Amplify, Sagemaker, S3, Lambda following the AWS documentation.

#### Environment Variables
- Set up the necessary environment variables in a `.env` file.

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


