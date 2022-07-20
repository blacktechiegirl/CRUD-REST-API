const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const db = new DynamoDBClient({});
const {QueryCommand} = require("@aws-sdk/client-dynamodb");
const {unmarshall } = require("@aws-sdk/util-dynamodb");



const getComment = async (event) => {
    const response = { statusCode: 200 };
    const params = {
        TableName: process.env.DYNAMODB_COMMENT_TABLE,
        KeyConditionExpression: "postId = :postId",
            ExpressionAttributeValues: {
                ":postId": event.pathParameters.postId
            }
    };

    try {
        const { Items } = await db.send(new QueryCommand(params));

        response.body = JSON.stringify({
            message: "Successfully retrieved all comments.",
            data: Items.map((item) => unmarshall(item)),
            Items,
        });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to retrieve comments.",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }

    return response;
};

module.exports = { getComment};