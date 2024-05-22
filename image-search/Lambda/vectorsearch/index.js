const AWS = require('aws-sdk');
const MongoClient = require('mongodb').MongoClient;

// Load environment variables
require('dotenv').config();

// AWS.config.update({ region: process.env.REGION });


AWS.config.update({ region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY  });

const s3 = new AWS.S3();
const sagemakerRuntime = new AWS.SageMakerRuntime({ apiVersion: '2017-05-13' });

exports.handler = async (event) => {
    const imagePath = event.imagePath;

    const s3Params = {
        Bucket: process.env.S3_BUCKET,
        Key: imagePath
    };

     // Construct MongoDB URL
     const safeUser = encodeURIComponent(process.env.DB_USER);
     const safePwd = encodeURIComponent(process.env.DB_PWD);
     const mongoUrl = `mongodb+srv://${safeUser}:${safePwd}@${process.env.CLUSTER_CONN_STRING.split('//')[1]}`;
 

    try {
        const imageData = await s3.getObject(s3Params).promise();
        const metadata = imageData.Metadata;

        let category = metadata.category || '';

        const sagemakerParams = {
            EndpointName: process.env.SAGEMAKER_ENDPOINT_NAME,
            Body: imageData.Body,
            ContentType: 'application/x-image',
            Accept: 'application/json'
        };

        const sagemakerResponse = await sagemakerRuntime.invokeEndpoint(sagemakerParams).promise();
        const embeddings = JSON.parse(Buffer.from(sagemakerResponse.Body).toString());

        const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        const collection = client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION);

        let aggregateQuery;
        if (category) {
            aggregateQuery = [
                {
                    "$vectorSearch": {
                        "queryVector": embeddings[0],
                        "path": "embedding",
                        "numCandidates": parseInt(process.env.VECTOR_SEARCH_NUM_CANDIDATES),
                        "limit": parseInt(process.env.VECTOR_SEARCH_LIMIT),
                        "index": process.env.VECTOR_SEARCH_INDEX,
                        "filter": { "category": { "$eq": category } }
                    }
                }
            ];
        } else {
            aggregateQuery = [
                {
                    "$vectorSearch": {
                        "queryVector": embeddings[0],
                        "path": "embedding",
                        "numCandidates": parseInt(process.env.VECTOR_SEARCH_NUM_CANDIDATES),
                        "limit": parseInt(process.env.VECTOR_SEARCH_LIMIT),
                        "index": process.env.VECTOR_SEARCH_INDEX
                    }
                }
            ];
        }

        const searchResults = await collection.aggregate(aggregateQuery).toArray();
        const itemIds = searchResults.map(doc => doc.item_id);

        await client.close();

        return { item_ids: itemIds };
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Error processing request');
    }
};
