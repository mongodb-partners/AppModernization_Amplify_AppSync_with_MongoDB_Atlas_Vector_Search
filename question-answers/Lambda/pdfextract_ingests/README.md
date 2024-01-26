
## Pre-Requesties
    1) Sagemaker endpoint with Clip model deployed
    2) Mongobb collection with embedded Image dataset
    3) Vector search index created on the embedding 
## Step to run the image-search-app-with lambda in Aws lambda:
   To generate the .zip file run the below commands

   
    mkdir <folder_name>
    cp -r venv/lib/python3.11/site-packages/* <folder_name>
    cp main.py <folder_name> 
    cd <folder_name> 
    zip -r ../<zip_file_name>.zip .
    cd .. 
    
    
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
                            "Action": "textract:StartDocumentTextDetection",
                            "Resource": "*"
                        }
                    ]
                }
                {
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Action": "textract:GetDocumentTextDetection",
                            "Resource": "*"
                        }
                    ]
                }
                {
                    "Version": "2012-10-17",
                    "Statement": [
                        {
                            "Effect": "Allow",
                            "Action": "bedrock:InvokeModel",
                            "Resource": "arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v1"
                        }
                    ]
                }
            - Open the Function created, under **"Configuration Tab"** add the required **"Environmental Variables"**
            - Under **"Test Tab"** update the event json with our local event json data. Then click on **"Test"** Ensure the function executed successfully without error.
