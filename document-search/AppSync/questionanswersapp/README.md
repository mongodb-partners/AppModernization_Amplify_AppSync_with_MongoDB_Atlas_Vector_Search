
# AWS AppSync API Setup Guide

## Overview
This guide provides instructions for setting up an AWS AppSync API with a specific GraphQL schema and mapping templates for Lambda data sources. The API includes two queries: `getAnswer` and `getAnswerBasedOnCategory`, with the latter utilizing a request and response mapping template for a Lambda function.

## Prerequisites
- An AWS account with access to AppSync and Lambda services.
- A deployed Lambda function to be used as a data source.

## Setting Up the AppSync API

### Step 1: Creating the AppSync API
1. Sign in to the AWS Management Console and go to the AppSync service.
2. Click **Create API** and choose the **Custom Schema** option.
3. Name your API and proceed to create it.

### Step 2: Defining the Schema
1. In the AppSync console, under your API, navigate to the **Schema** section.
2. Enter the following GraphQL schema:
   ```graphql
   type Query {
       getAnswer(question: String!): String
       getAnswerBasedOnCategory(question: String!, category: String!): String
   }

   schema {
       query: Query
   }
   ```
3. Save the schema.

### Step 3: Configuring Data Sources
1. Navigate to the **Data Sources** section.
2. Click **New** to add a new data source.
3. Choose the [Lambda](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/tree/main/Lambda/doucument-search/query%26ans) function you've already deployed as the data source.
4. Save the data source.

### Step 4: Setting Up Resolvers
1. Return to the **Schema** section.
2. For each query (`getAnswer` and `getAnswerBasedOnCategory`), click on the **Attach** button next to them to add a new resolver.
3. Select the Lambda data source created in Step 3.

### Step 5: Configuring Request and Response Mapping Templates
For the `getAnswerBasedOnCategory` query:
1. **Request Mapping Template**:
   ```vtl
   #**
   The value of 'payload' after the template has been evaluated
   will be passed as the event to AWS Lambda.
   *#
   {
       "version" : "2017-02-28",
       "operation": "Invoke",
       "payload": {
           "question": $util.toJson($context.args.question),
           "category":$util.toJson($context.args.category)
       }
   }
   ```
2. **Response Mapping Template**:
   ```vtl
   $util.toJson($context.result)
   ```

### Step 6: Deploying the API
Once you've set up the schema, data sources, and resolvers:
1. Click **Save** on each resolver configuration.
2. Deploy the API by navigating to the **Settings** section and selecting a deployment stage.

## Testing Your API
After deployment, you can test your API in the AppSync console using the Queries section. Enter your queries and check the responses to ensure everything is functioning as expected.

---

