const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { MongoClient } = require('mongodb');
const { Buffer } = require('buffer');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const s3Client = new S3Client({
    region: process.env.REGION,
    // credentials: {
    //     accessKeyId: process.env.ACCESS_KEY_ID,
    //     secretAccessKey: process.env.SECRET_ACCESS_KEY
    // }
});
const bedrockClient = new BedrockRuntimeClient({
    region: process.env.BEDROCK_REGION,
    // credentials: {
    //     accessKeyId: process.env.ACCESS_KEY_ID,
    //     secretAccessKey: process.env.SECRET_ACCESS_KEY
    // }
});

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
        const imageData = await s3Client.send(new GetObjectCommand(s3Params));
        const metadata = imageData.Metadata;

        let category = metadata.category || '';

        // Convert image to base64
        const base64ImageString = await streamToBase64(imageData.Body);

        const bedrockParams = {
            modelId: process.env.BEDROCK_MODEL_ID,  // e.g., "amazon.titan-embed-image-v1"
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify({
                inputImage: base64ImageString
            })
        };

        const bedrockResponse = await bedrockClient.send(new InvokeModelCommand(bedrockParams));
        const embeddings = JSON.parse(Buffer.from(bedrockResponse.body).toString()).embedding;

        const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        const collection = client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION);

        let aggregateQuery;
        if (category) {
            aggregateQuery = [
                {
                    "$vectorSearch": {
                        "queryVector": embeddings,
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
                        "queryVector": embeddings,
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

// Helper function to convert stream to base64 string
const streamToBase64 = (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
    });
};