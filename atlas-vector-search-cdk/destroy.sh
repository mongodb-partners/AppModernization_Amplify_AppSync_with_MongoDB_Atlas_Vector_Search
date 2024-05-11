#!/bin/bash

ATLAS_CLUSTER_STACK="avs-atlas-stack"
ATLAS_SEARCH_INDEX_STACK="avs-atlas-searchindex-stack"
DOC_SEARCH_SOURCE="resources/document-search"
DOC_SEARCH_STACK="avs-document-search-stack"
IMG_SEARCH_SOURCE="resources/image-search"
OUTPUT_FILE="avs-document-search-output.json"
TEMP_FILE="avs-document-search-output-modified.json"

# Delete S3 buckets contents before executing destroy
cdk destroy $DOC_SEARCH_STACK
cdk destroy $ATLAS_CLUSTER_STACK
# cdk destroy $ATLAS_SEARCH_INDEX_STACK

rm $OUTPUT_FILE

# Destroy Amplify
cd $DOC_SEARCH_SOURCE/AmplifyUI/
amplify delete

