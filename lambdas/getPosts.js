const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const {unmarshall } = require("@aws-sdk/util-dynamodb");

const dynamo = new DynamoDBClient({});

const getAllPosts = async () => {
    const response = { 
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
     };

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
          };
        const { Items } = await dynamo.send(new ScanCommand(params));

        response.body = JSON.stringify({
            message: "Successfully retrieved all posts.",
            data: Items.map((item) => unmarshall(item)),
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to retrieve posts.",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }

    return response;
};

module.exports = { getAllPosts};