const { DynamoDBClient,DeleteItemCommand} = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const dynamo = new DynamoDBClient({});

const deletePost = async (event) => {
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
      Key: marshall({
        postId: event.pathParameters.postId,
        userId: event.pathParameters.userId,
      }),
    };
    const deleteResult = await dynamo.send(new DeleteItemCommand(params));

    response.body = JSON.stringify({
      message: "Successfully deleted post.",
      deleteResult,
    });
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to delete post.",
      errorMsg: e.message,
      errorStack: e.stack,
    });
  }

  return response;
};

module.exports = { deletePost };
