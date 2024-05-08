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

cdk deploy $ATLAS_SEARCH_INDEX_STACK --require-approval never

# exit 0

