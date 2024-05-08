#!/bin/bash

set -e


ATLAS_CLUSTER_STACK="avs-atlas-stack"
ATLAS_SEARCH_INDEX_STACK="avs-atlas-searchindex-stack"
DOC_SEARCH_SOURCE="resources/document-search"
DOC_SEARCH_STACK="avs-document-search-stack"
IMG_SEARCH_SOURCE="resources/image-search"
OUTPUT_FILE="avs-document-search-output.json"
TEMP_FILE="avs-document-search-output-modified.json"
pdfextracts=""

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



# aws s3 cp .pdf /pdfe

# cdk deploy $ATLAS_SEARCH_INDEX_STACK --require-approval never

# exit 0


# Get the directory of the script
ROOT_SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"


# Check if the JSON file exists
if [ ! -f "$OUTPUT_FILE" ]; then
  echo "JSON file not found: $OUTPUT_FILE"
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



# Deploy Atlas Cluster, Appsync and Lambdas using CDK
cdk deploy $ATLAS_CLUSTER_STACK --require-approval never
cdk deploy $DOC_SEARCH_STACK --outputs-file $OUTPUT_FILE --require-approval never

# Check if input file exists
if [ ! -f "$OUTPUT_FILE" ]; then
    echo "Error: Input file '$OUTPUT_FILE' not found."
    exit 1
fi


# Read JSON file and set environment variables using jq
while IFS='=' read -r key value; do
    export "$key"="$value"
done < <(jq -r '.["avs-document-search-stack"] | to_entries | .[] | "\(.key)=\(.value)"' $OUTPUT_FILE)


# Deploy Amplify
cd $DOC_SEARCH_SOURCE/AmplifyUI/
chmod +x *.sh


#Create Env.ts from S3 details
content_environment_ts="export const environment = {
  production: true,
  s3Bucket: '$s3Bucket',
  s3Folder: 'pdfextract',
  s3Region: '$s3Region'
};
"
tmpfile=$(mktemp)
echo "$content_environment_ts" > "$tmpfile"
mv "$tmpfile" src/environments/environment.ts


if [ "$INIT_DEPLOY" = true ]; then
echo "Log: Since its an initial deployment we are initializing the amplify UI"
# Should think of how to do npm login
npm install
./init_amplify.sh
./addAuth_amplify.sh
amplify push --yes
./npxAddApi_amplify.sh 
./addHosting_amplify.sh
fi 

./override_amplify.sh
cp override.txt amplify/backend/awscloudformation/override.ts

amplify push --yes
amplify publish --yes

# Published few more steps that is manual now
# echo "1. Update Auth Role with the following policy"
# echo "1. Overriding the auth role created by amplify"

# Convert keys with underscores and prefix with '$' using jq and save to a new file
# jq -c '{
#     aws_appsync_apiId: .["avs-document-search-stack"].awsappsyncapiId,
#     aws_appsync_graphqlEndpoint: .["avs-document-search-stack"].awsappsyncgraphqlEndpoint,
#     aws_project_region: .["avs-document-search-stack"].awsprojectregion,
#     aws_appsync_region: .["avs-document-search-stack"].awsappsyncregion,
#     aws_appsync_authenticationType: .["avs-document-search-stack"].awsappsyncauthenticationType,
#     aws_appsync_apiKey: .["avs-document-search-stack"].awsappsyncapiKey
# }' "$OUTPUT_FILE" > "$TEMP_FILE"

# echo "Keys converted and saved to $TEMP_FILE"

# cp "$DOC_SEARCH_SOURCE/AmplifyUI/src/amplifyconfiguration.json" "$DOC_SEARCH_SOURCE/AmplifyUI/src/amplifyconfigurationBckup.json"
# cat "$DOC_SEARCH_SOURCE/AmplifyUI/src/amplifyconfiguration.json" "$TEMP_FILE"  | jq -s '.[0] + .[1]' > "$DOC_SEARCH_SOURCE/AmplifyUI/src/amplifyconfiguration_temp.json"
# cp "$DOC_SEARCH_SOURCE/AmplifyUI/src/amplifyconfiguration_temp.json" "$DOC_SEARCH_SOURCE/AmplifyUI/src/amplifyconfiguration.json"

# rm "$DOC_SEARCH_SOURCE/AmplifyUI/src/amplifyconfiguration_temp.json"
# rm "$TEMP_FILE"




#jq -s '.[0] + .[1]' $TEMP_FILE $DOC_SEARCH_SOURCE/AmplifyUI/src/amplifyconfiguration.json $TEMP_FILE > $DOC_SEARCH_SOURCE/AmplifyUI/src/amplifyconfiguration_updated.json

# jq -n --argfile resources/document-search/AmplifyUI/src/amplifyconfiguration.json --argfile json2 avs-document-search-output.json '$json2 + $json1' > resources/document-search/AmplifyUI/src/amplifyconfiguration_updated.json

