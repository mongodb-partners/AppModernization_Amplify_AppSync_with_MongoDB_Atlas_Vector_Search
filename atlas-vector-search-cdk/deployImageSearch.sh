#!/bin/bash

set -e


ATLAS_CLUSTER_STACK="avs-atlas-stack"
ATLAS_IMAGE_SEARCH_INDEX_STACK="avs-atlas-imagesearchindex-stack"
IMG_SEARCH_SOURCE="resources/image-search"
IMG_SEARCH_STACK="avs-image-search-stack"
S3_STACK="avs-s3-stack"
IMG_SEARCH_OUTPUT_FILE="avs-image-search-output.json"
IMG_SEARCH_TEMP_FILE="avs-image-search-output-modified.json"


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

# Deploy Atlas Cluster
cdk deploy $ATLAS_CLUSTER_STACK --require-approval never
cdk deploy $S3_STACK --require-approval never
cdk deploy $IMG_SEARCH_STACK --outputs-file $IMG_SEARCH_OUTPUT_FILE --require-approval never

# Check if input file exists
if [ ! -f "$IMG_SEARCH_OUTPUT_FILE" ]; then
    echo "Error: Input file '$IMG_SEARCH_OUTPUT_FILE' not found."
    exit 1
fi


# Read JSON file and set environment variables using jq
while IFS='=' read -r key value; do
    export "$key"="$value"
done < <(jq -r '.["avs-image-search-stack"] | to_entries | .[] | "\(.key)=\(.value)"' $IMG_SEARCH_OUTPUT_FILE)

printenv | grep "ImageSearch"


# Deploy Amplify
cd $IMG_SEARCH_SOURCE/AmplifyUI/
chmod +x *.sh


#Create Env.ts from S3 details
content_environment_ts="export const environment = {
  production: true,
  s3Bucket: '$ImageSearchS3Bucket',
  s3Folder: 'uploaded-images',
  s3Region: '$ImageSearchS3Region',
  staticImagePath:'$ImageSearchS3Bucket/sample-images',
  s3Prefix:'sample-images'
};
"
tmpfile=$(mktemp)
echo "$content_environment_ts" > "$tmpfile"
mv "$tmpfile" src/environments/environment.ts



# if [ "$INIT_DEPLOY" = true ]; then
# echo "Log: Since its an initial deployment we are initializing the amplify UI"
# Should think of how to do npm login
npm install # Taking too long
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

echo $ImageSearchS3Bucket
aws s3 sync s3://sagemakersamplebucket2 s3://$ImageSearchS3Bucket --quiet



