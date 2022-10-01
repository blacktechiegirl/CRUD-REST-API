const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const db = new DynamoDBClient({});
const { UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall,marshall } = require("@aws-sdk/util-dynamodb");

const updatePost = async (event) => {
  const response = { 
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*"
    },
 };
  const requestJSON = JSON.parse(event.body);

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({
        postId: event.pathParameters.postId,
        userId: event.pathParameters.userId,
      }),
      ConditionExpression: 'attribute_exists(postId)',
      UpdateExpression: "SET #attrName = :attrValue",
      ExpressionAttributeNames: {
        "#attrName":  "content"
      },
      ExpressionAttributeValues: 
        marshall({":attrValue":  requestJSON.content}),
      ReturnValues: "ALL_NEW",
    };

    const updateResult = await db.send(new UpdateItemCommand(params));
    const data = unmarshall(updateResult.Attributes)

    response.body = JSON.stringify({
      message: "Successfully updated post.",
      data,
    });
    console.log(params)
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to update post.",
      errorMsg: e.message,
      errorStack: e.stack,
    });
  }

  return response;
};

module.exports = { updatePost };