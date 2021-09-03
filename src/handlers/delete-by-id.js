// Create clients and set shared const values outside of the handler

// Create a DocumentClient that represents the query to delete an item
const dynamodb = require('aws-sdk/clients/dynamodb');

const docClient = new dynamodb.DocumentClient();

// Get the DynamoDB table name from environment variables
const tableName = process.env.SAMPLE_TABLE;

/**
 * A simple example includes a HTTP delete method to delete one item by id from a DynamoDB table.
 */
exports.deleteByIdHandler = async (event) => {
    const { httpMethod, path, pathParameters } = event;
    if (httpMethod !== 'DELETE') {
        throw new Error(`deleteMethod only accept DELETE method, you tried: ${httpMethod}`);
    }
    // All log statements are written to CloudWatch by default. For more information, see
    // https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-logging.html
    console.log('received:', JSON.stringify(event));

    // Delete id from pathParameters from APIGateway because of `/{id}` at template.yml
    const { id } = pathParameters;

    // Delete the item from the table
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#delete-property
    const params = {
        TableName: tableName,
        Key: { id },
    };
    const { Item } = await docClient.delete(params).promise();

    const response = {
        statusCode: 200,
        body: JSON.stringify(Item),
    };

    console.log(`response from: ${path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
