
# AWS AppSync API Setup Guide: Image Search and Item Retrieval

## Overview
This guide details the process of setting up an AWS AppSync API for image searching and item retrieval using GraphQL. It involves configuring two APIs: `searchImage` and `getItemById`, with Lambda and MongoDB data sources.

## Prerequisites
- An AWS account with access to AppSync, Lambda, and MongoDB.
- A deployed Lambda function for the `searchImage` API.
- Access to MongoDB Data API for the `getItemById` API.

## Setting Up the AppSync API

### Step 1: Creating the AppSync API
1. Sign in to the AWS Management Console.
2. Navigate to the AppSync service and click **Create API**.
3. Choose **Custom Schema** and name your API.

### Step 2: Defining the Schema
In the AppSync console, under your API, go to the **Schema** section and enter the provided GraphQL schema. This schema includes types for `ImageSearchResult`, `Item`, and `ItemInput`, along with `Query` and `Mutation` types.

### Step 3: Configuring Data Sources
1. For `searchImage`:
   - Add a new data source and select the deployed Lambda function.
2. For `getItemById`:
   - Add a new data source that connects to your MongoDB using the MongoDB Data API.

### Step 4: Setting Up Resolvers
1. **searchImage API**:
   - **Request Mapping Template**:
     ```vtl
     {
       "version" : "2017-02-28",
       "operation": "Invoke",
       "payload": {
             "imagePath": $util.toJson($context.args.imagePath)
         }
     }
     ```
   - **Response Mapping Template**:
     ```vtl
     $util.toJson($context.result)
     ```
2. **getItemById API**:
   - Use the provided resolver logic that integrates with the MongoDB Data API.
   - This includes the `request` and `response` functions for processing the query and returning the result.

### Step 5: Deploying the API
After setting up the schema, data sources, and resolvers, save and deploy your API. Choose a deployment stage in the **Settings** section.

## Testing Your API
Test the API in the AppSync console using the Queries section. Ensure both `searchImage` and `getItemById` return the expected results.

---
