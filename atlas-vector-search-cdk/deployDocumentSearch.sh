#!/bin/bash

set -e


ATLAS_CLUSTER_STACK="avs-atlas-stack"
ATLAS_SEARCH_INDEX_STACK="avs-atlas-searchindex-stack"
DOC_SEARCH_SOURCE="resources/document-search"
DOC_SEARCH_STACK="avs-document-search-stack"
DOC_SEARCH_OUTPUT_FILE="avs-document-search-output.json"
DOC_SEARCH_TEMP_FILE="avs-document-search-output-modified.json"
S3_STACK="avs-s3-stack"

# Read the values from global-args.json
ATLAS_PUBLIC_KEY=$(jq -r '.ATLAS_PUBLIC_KEY' global-args.json)
ATLAS_PRIVATE_KEY=$(jq -r '.ATLAS_PRIVATE_KEY' global-args.json)


# Deploy the CloudFormation stack
aws cloudformation deploy \
  --template-file resources/util/atlas-execution-role.yml \
  --stack-name AtlasExecutionRole \
  --capabilities CAPABILITY_NAMED_IAM



# Deploy the CloudFormation stack
aws cloudformation deploy \
  --template-file resources/util/atlas-secrets.yml \
  --stack-name AtlasSecretsStack \
  --parameter-overrides \
    PublicKey="$ATLAS_PUBLIC_KEY" \
    PrivateKey="$ATLAS_PRIVATE_KEY" \
  --capabilities CAPABILITY_NAMED_IAM


# Get the directory of the script
ROOT_SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"


# Check if the JSON file exists
if [ ! -f "$DOC_SEARCH_OUTPUT_FILE" ]; then
  echo "JSON file not found: $DOC_SEARCH_OUTPUT_FILE"
  INIT_DEPLOY=true
else
  INIT_DEPLOY=false
fi

# Compile Lambdas
# PDFextract Ingests
echo "Compiling Doc Search Lambdas"
cd $DOC_SEARCH_SOURCE/Lambda/pdfextract_ingests
if [ -d "lambdapackage" ]; then
    rm -rf lambdapackage
fi
mkdir lambdapackage
python3 -m venv myenv
source myenv/bin/activate
pip3 install -r requirements.txt
cp -r myenv/lib/python*/site-packages/* lambdapackage
cp main.py lambdapackage
deactivate
rm -r myenv/
cd $ROOT_SCRIPT_DIR

# query_and_ans
cd $DOC_SEARCH_SOURCE/Lambda/query_and_ans
python3 -m venv myenv
if [ -d "lambdapackage" ]; then
    rm -rf lambdapackage
fi
mkdir lambdapackage
source myenv/bin/activate
pip3 install -r requirements.txt
cp -r myenv/lib/python*/site-packages/* lambdapackage
cp main.py lambdapackage
deactivate
rm -r myenv/
cd $ROOT_SCRIPT_DIR

# Deploy Atlas Cluster, S3, Appsync and Lambdas using CDK
cdk deploy $ATLAS_CLUSTER_STACK --require-approval never
cdk deploy $S3_STACK --require-approval never
cdk deploy $DOC_SEARCH_STACK --outputs-file $DOC_SEARCH_OUTPUT_FILE --require-approval never

# Check if input file exists
if [ ! -f "$DOC_SEARCH_OUTPUT_FILE" ]; then
    echo "Error: Input file '$DOC_SEARCH_OUTPUT_FILE' not found."
    exit 1
fi


# Read JSON file and set environment variables using jq
while IFS='=' read -r key value; do
    export "$key"="$value"
done < <(jq -r '.["avs-document-search-stack"] | to_entries | .[] | "\(.key)=\(.value)"' $DOC_SEARCH_OUTPUT_FILE)


# Deploy Amplify
cd $DOC_SEARCH_SOURCE/AmplifyUI/
chmod +x *.sh


#Create Env.ts from S3 details
content_environment_ts="export const environment = {
  production: true,
  s3Bucket: '$DocumentSearchS3Bucket',
  s3Folder: 'pdfextract',
  s3Region: '$DocumentSearchS3Region'
};
"
tmpfile=$(mktemp)
echo "$content_environment_ts" > "$tmpfile"
mv "$tmpfile" src/environments/environment.ts


# if [ "$INIT_DEPLOY" = true ]; then
# echo "Log: Since its an initial deployment we are initializing the amplify UI"
# Should think of how to do npm login
npm install
./init_amplify.sh
./addAuth_amplify.sh
amplify push --yes
./npxAddApi_amplify.sh 
./addHosting_amplify.sh
# fi 

./override_amplify.sh
cp override.txt amplify/backend/awscloudformation/override.ts

amplify push --yes
amplify publish --yes

exit 0