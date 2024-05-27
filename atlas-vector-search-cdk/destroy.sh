#!/bin/bash

ATLAS_CLUSTER_STACK="avs-atlas-stack"
ATLAS_SEARCH_INDEX_STACK="avs-atlas-searchindex-stack"
DOC_SEARCH_SOURCE="resources/document-search"
DOC_SEARCH_STACK="avs-document-search-stack"
IMG_SEARCH_SOURCE="resources/image-search"
DOC_SEARCH_OUTPUT_FILE="avs-document-search-output.json"
DOC_SEARCH_TEMP_FILE="avs-document-search-output-modified.json"
IMG_SEARCH_OUTPUT_FILE="avs-image-search-output.json"
IMG_SEARCH_TEMP_FILE="avs-image-search-output-modified.json"

# Get the directory of the script
ROOT_SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"


# Destroy Amplify Doc Search
cd $DOC_SEARCH_SOURCE/AmplifyUI/
amplify delete

cd $ROOT_SCRIPT_DIR

# Destroy Amplify Image Search
cd $IMG_SEARCH_SOURCE/AmplifyUI/
amplify delete

cd $ROOT_SCRIPT_DIR

# Delete S3 buckets contents before executing destroy
cdk destroy --all

rm $DOC_SEARCH_OUTPUT_FILE
rm $IMG_SEARCH_OUTPUT_FILE


