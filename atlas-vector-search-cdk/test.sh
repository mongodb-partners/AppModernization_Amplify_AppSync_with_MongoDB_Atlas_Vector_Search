#!/bin/bash
# Deploy Amplify
DOC_SEARCH_SOURCE="resources/document-search"
cd $DOC_SEARCH_SOURCE/AmplifyUI/
chmod +x *.sh

export s3Bucket="1234"
export s3Region="us-east-1"

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
pwd
mv "$tmpfile" src/environments/environment.ts