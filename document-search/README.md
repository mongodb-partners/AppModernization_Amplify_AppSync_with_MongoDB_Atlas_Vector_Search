

# Atlas Vector Search and AWS AI ML

## Introduction
This repository contain sophisticated document search application. This applications is designed using AWS technologies and advanced machine learning models. They provide intuitive UIs for user interaction and leverage AWS Amplify, AppSync, and Lambda for backend processing.

### Technologies Used
- AWS Amplify with Angular
- AWS AppSync
- AWS Lambda
- AWS S3
- AWS Textract (Document Search)
- AWS Sagemaker
- MongoDB
- Bedrock Models (Titan, Claude)

## Repository Structure

- [Lambda](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/main/question-answers/Lambda/pdfextract_ingests/README.md): AWS Lambda functions used as data sources for AWS AppSync.
- [Appsync](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/main/question-answers/AppSync/questionanswersapp/README.md): AWS Appsync data api which the Amplify UI app uses.
- [AmplifyUI](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/main/question-answers/AmplifyUI/README.md): Contains all Front end code and resources for the Image Search Application.




## Setup Instructions
### Prerequisites
- AWS Account with access to Amazon SageMaker, AWS Lambda, Amazon S3
- MongoDB account and database setup.
- Access to Bedrock Models

### Application Setup 

1. Create Lambda functions 
   - Create lambda functions using the code in the repo following the [instructions](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/main/question-answers/Lambda/pdfextract_ingests/README.md).   
   
2. Create AppSync API
   - Create Appsync API using the [schema](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/main/question-answers/AppSync/questionanswersapp/README.md) defined in the repo.
   - Use the lambda functions as the data source   

3. Create Front end application
   - Create Front end application following the  [document](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/main/question-answers/AmplifyUI/README.md) 



### Reference Links
- [Getting Started with AWS Amplify for Angular](https://docs.amplify.aws/angular/start/getting-started/introduction/)





