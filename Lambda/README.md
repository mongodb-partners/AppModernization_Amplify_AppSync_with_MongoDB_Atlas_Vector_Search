
# AWS Lambda Deployment Guide

## Overview
This guide provides detailed instructions for packaging a Python AWS Lambda function, excluding the `.env` file, and deploying it on AWS. It covers creating a zip file of your Lambda code and uploading it to the AWS Lambda console, followed by setting up environment variables.

## Prerequisites
- Python Lambda code in a local directory.
- Access to the AWS Management Console with necessary permissions.

## Packaging Your Lambda Function

### Step 1: Organizing Your Code
Ensure your Lambda function code is in a directory with all necessary files except the `.env` file, which should not be included in the deployment package.

### Step 2: Creating a Zip File
1. Open a terminal or command prompt.
2. Navigate to the directory containing your Lambda function.
3. Run the following command to create a zip file, replacing `<YourFunctionName>` with your function's name:
   ```bash
   zip -r <YourFunctionName>.zip . -x "*.env"
   ```
   This command creates a zip file named `<YourFunctionName>.zip`, excluding any `.env` files.

## Uploading to AWS Lambda

### Step 1: Access AWS Lambda Console
1. Sign in to the [AWS Management Console](https://aws.amazon.com/console/).
2. Navigate to the Lambda service.

### Step 2: Creating/Updating Lambda Function
1. If creating a new Lambda function:
   - Click on **Create function**.
   - Follow the prompts to create a new function.
2. If updating an existing function:
   - Select your function from the list.
   - Under the **Function code** section, choose **Upload from** > **.zip file**.
   - Upload the `<YourFunctionName>.zip` file.

### Step 3: Setting Environment Variables
1. In the Lambda function dashboard, scroll to the **Environment variables** section.
2. Click **Edit** to add new environment variables.
3. Enter the key-value pairs for your environment variables.
4. Click **Save** to apply the changes.

## Final Steps
After uploading the zip file and setting environment variables, your Lambda function is ready. You can now test it directly from the AWS Lambda console or trigger it as per your use case.

---
