## Pre-Requesties
    1) Sagemaker endpoint with Clip model deployed
    2) Mongodb collection with embedded Image dataset
    3) Vector search index created on the embedding 

## Step to run the image-search-app-with lambda in local:
   * 1. Open terminal and go to the directory 
        ```cd /AWS Appsync/image-search-app/Lambda/vectorsearch```
   * 2. Run the command
        ``` npm install ```
   * 3. Update the .env file with required values
   * 4. Update index.js file to get the ACCESS_KEY and SECRET_ACCESS_KEY to read from .env (this is to run only in local).
   * 5. Run the command 
        ```node test.js```
   * 6. Once test is successfull run the command to create Zip file without .env file of our local
        ```zip -r <any_name_to_zip_file>.zip . -x "*.env"```

## Step to run the image-search-app-with lambda in Aws lambda:
   * 1. Login to the AWS account
   * 2. Search for Lambda and create function by uploading the zip file generated in the local, by following the [steps](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-package.html)
   * 3. Once zip file is uploaded, Add IAM Policy with below steps
        - Identify the IAM Role:
            - Determine the IAM role that your AWS user assumes when interacting with SageMaker. In your case, it seems to be arn:aws:sts::<userId>:assumed-role/<function_name>-role-r7qxdj58/<function_name>.
        - Update IAM Policies:
            - Add the necessary permissions for the sagemaker:InvokeEndpoint action to the IAM policy attached to the IAM role.
            - Open the AWS Management Console.
            - Navigate to the IAM service.
            - Find the IAM role <function_name>-role-r7qxdj58 in the Roles section.
            - Edit the role and update the policy to include the necessary permissions. An example policy allowing sagemaker:InvokeEndpoint might look like this:
                ```{
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                        "Effect": "Allow",
                        "Action": "sagemaker:InvokeEndpoint",
                        "Resource": "arn:aws:sagemaker:us-east-2:816546967292:endpoint/clip-image-model-2023-11-07-19-30-33-770"
                        }
                    ]
                    }```
            - Open the Function created, under **"Configuration Tab"** add the required **"Environmental Variables"**
            - Under **"Test Tab"** update the event json with our local event json data. Then click on **"Test"** Ensure the function executed successfully without error.

