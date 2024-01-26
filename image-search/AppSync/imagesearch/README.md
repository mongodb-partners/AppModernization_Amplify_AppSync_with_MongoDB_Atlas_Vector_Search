
# AWS AppSync API Setup Guide: Image Search and Item Retrieval

## Overview
This guide details the process of setting up an AWS AppSync API for image searching and item retrieval using GraphQL. It involves configuring two APIs: `searchImage` and `getItemById`, with Lambda and MongoDB data sources.

## Prerequisites
- An AWS account with access to AppSync, Lambda, and MongoDB.
- A deployed Lambda function for the `searchImage` API.
- Mongodb dataset with loaded image dataset and data API enabled
- Access to MongoDB Data API for the `getItemById` API.
- A path of the image uploaded in S3 for search

## Setting Up the AppSync API

### Step 1: Creating the AppSync API
1. Sign in to the AWS Management Console.
2. Navigate to the AppSync service and click **Create API**.
3. Choose GraphQL APIs
4. Choose Data source as Design from scratch
5. Name the API
6. In Create a GraphQL type click on "Create GraphQL resources later"
7. Create API 
8. Use the schema and save it

### Step 2: Defining the Schema
In the AppSync console, under your API, go to the **Schema** section and enter the provided GraphQL schema. This schema includes types for `ImageSearchResult`, `Item`, and `ItemInput`, along with `Query` and `Mutation` types.

### Step 3: Configuring Data Sources for Query
1.  `searchImage`:
   - Add a new data source and select the deployed [Lambda](https://github.com/mongodb-partners/AppModernization_Amplify_AppSync_with_MongoDB_Atlas_Vector_Search/tree/main/Lambda/image-search/vectorsearch) function.
   - Attach the added data source to the query 'searchImage'
   - Select the 'Unit resolver'
   - Use "Velocity Template Language(VTL) as the runtime
   - Configure the request and response mappping template
   - Test the Query
   - A sample Query is
   ```
   query MyQuery {
  searchImage(imagePath: "uploaded-images/075e5d67.jpeg") {
    item_ids
  }
   }
   ```

2.  `getItemById`:
   - Add a new data source that connects to your MongoDB using the MongoDB Data API.
   - Choose HTTP Endpoint and give your mongodb data api endpoint
   - Select the Pipeline resolver
   - Select AppSync Javascript(APPSYNC_JS) 
   - Add a resolver function defined in "resolver.js"
   - Create a new function using the code from "getItemById_func.js"
   - Choose the datasource as the mongodb we created earlier
   - Add a resolver function defined in "resolver.js"
   - Attach the newly created function
   - Save and test the query
   - A sample query is

   ```
   query MyQuery {
  
  getItemById(item_id: "B0896LJNLH") {
    item_name_in_en_us
    main_image_id
    image_id
    height
    width
    path
  }
}
   ```


## Testing Your API
Test the API in the AppSync console using the Queries section. Ensure both `searchImage` and `getItemById` return the expected results.

---
