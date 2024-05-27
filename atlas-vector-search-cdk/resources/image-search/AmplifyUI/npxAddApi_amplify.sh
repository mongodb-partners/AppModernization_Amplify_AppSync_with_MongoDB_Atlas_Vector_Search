#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Run the npx @aws-amplify/cli codegen add command with expect
rm "$SCRIPT_DIR/.graphqlconfig.yml"

# Define variables
generatedCodeFile="src/app/API.service.ts"

# Run Amplify CLI command with expect
expect -c "
set timeout 20
spawn npx @aws-amplify/cli codegen add --apiId $ImageSearchapiId --region us-east-1
expect \"Choose the code generation language target\"
send -- \"1\r\"
expect \"Enter the file name pattern of graphql queries, mutations and subscriptions\"
send -- \"\r\"
expect \"Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions\"
send \"Yes\r\"
expect \"Enter maximum statement depth\"
send -- \"\r\"
expect \"Enter the file name for the generated code\"
send \"$generatedCodeFile\r\"
expect \"Do you want to generate code for your newly created GraphQL API\"
send \"Yes\r\"
expect eof
"

