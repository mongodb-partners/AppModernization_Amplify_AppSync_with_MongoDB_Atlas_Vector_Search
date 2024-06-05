#!/bin/bash

set -e


IMG_SEARCH_SOURCE="resources/image-search"
DOC_SEARCH_SOURCE="resources/document-search"

# Get the directory of the script
ROOT_SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Compile Lambdas
# PDFextract Ingests
echo "Compiling Doc Search Lambdas"
echo "PDFextract Ingests"
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
pwd
# query_and_ans
echo "query_and_ans"
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


echo "Compiling Image Search Lambdas"
echo  "Vector Search"
cd $IMG_SEARCH_SOURCE/Lambda/vectorsearch
if [ -d "lambdapackage" ]; then
    rm -rf lambdapackage
fi
mkdir lambdapackage
# Copy all files and directories except the lambdapackage directory itself
for item in *; do
    if [ "$item" != "lambdapackage" ]; then
        cp -r "$item" lambdapackage/
    fi
done
cd lambdapackage
npm install
cd $ROOT_SCRIPT_DIR

# echo "ClassifyData Lambda"
# cd $IMG_SEARCH_SOURCE/Lambda/classifydata
# if [ -d "lambdapackage" ]; then
#     rm -rf lambdapackage
# fi
# mkdir lambdapackage
# python3 -m venv myenv
# source myenv/bin/activate
# pip3 install -r requirements.txt
# cp -r myenv/lib/python*/site-packages/* lambdapackage
# cp main.py lambdapackage
# deactivate
# rm -r myenv/
# cd $ROOT_SCRIPT_DIR

./deployImageSearch.sh
./deployDocumentSearch.sh