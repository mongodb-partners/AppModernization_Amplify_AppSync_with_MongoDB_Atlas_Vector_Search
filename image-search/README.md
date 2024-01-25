
# Atlas Vector Search and AWS AI ML

## Introduction
This repository contain sophisticated image Search application. This applications is designed using AWS technologies and advanced machine learning models. They provide intuitive UIs for user interaction and leverage AWS Amplify, AppSync, and Lambda for backend processing.

### Technologies Used
- AWS Amplify with Angular
- AWS AppSync
- AWS Lambda
- AWS S3
- AWS Textract (Document Search)
- AWS Sagemaker
- MongoDB
- Machine Learning Models (CLIP)

## Repository Structure
- `AmplifyUI/`: Contains all Front end code and resources for the Image Search Application.
- `Lambda/`: AWS Lambda functions used as data sources for AWS AppSync.
- `Appsync/`: AWS Appsync data api which the Amplify UI app uses.



## Setup Instructions
### Prerequisites
- AWS Account with access to Amazon SageMaker, AWS Lambda, Amazon S3
- MongoDB account and database setup.

### Common Setup for Both Applications
1. Clone the Repository
   ```
   git clone <repository-url>
   ```


7. Data Ingestion and Clip models creation
   - Run the [notebook](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/tree/main/SagemakerNotebook) to create a Clip model and ingest dataset for image search




5. Create Lambda functions 
   - Create lambda functions using the code in the repo following the [instructions](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/main/Lambda/README.md).   
   
6. Create AppSync API
   - Create Appsync API using the [schema](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/blob/main/Appsync/documentsearch/README.md) defined in the repo.
   - Use the lambda functions as the data source   

7. Create Front end application
   - Create Front end application following the  [tutorial](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/tree/main/SagemakerNotebook) to create a Clip model and ingest dataset for image search



### Reference Links
- [Getting Started with AWS Amplify for Angular](https://docs.amplify.aws/angular/start/getting-started/introduction/)

## Usage
### Image Search Application
- Navigate to the Image Search UI.
- Upload images and view search results based on image content.




