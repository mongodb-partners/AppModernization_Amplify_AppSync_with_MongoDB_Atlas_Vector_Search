
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
1. Clone the Repository
   ```
   git clone <repository-url>
   ```

2. Install Dependencies for Amplify UI
   ```
   cd amplify-ui
   npm install
   ```

3. AWS Configuration
   - Configure AWS services like S3, Lambda, Textract, and AppSync following AWS documentation.

4. Environment Variables Setup
   - Set up necessary environment variables in `.env` files for each application.

5. Create Lambda functions 
   - Create lambda functions using the code in the repo.   
   
6. Create AppSync API
   - Create Appsync API using the schema defined in the repo.
   - Use the lambda functions as the data source   

7. Launching the Applications
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

## Contributing
We welcome contributions to improve these applications. Please refer to our contributing guidelines for more information.

## License
Both applications in this repository are licensed under the MIT License - see the LICENSE file in each application's directory for details.
