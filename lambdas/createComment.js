const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const { uuid } = require('uuidv4');

const dynamo = new DynamoDBClient({});

const createComment = async (event) => {
  const response = { 
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*"
    },
 };

  try {
    const requestJSON = JSON.parse(event.body);
    const data= {
        postId: requestJSON.postId,
        commentId: uuid(),
        userId: requestJSON.userId,
        userName: requestJSON.userName,
        comment: requestJSON.comment,
        date: new Date().getTime(),
    }
    const params = {
      TableName: process.env.DYNAMODB_COMMENT_TABLE,
      Item: marshall(data),
    };
    const createResult = await dynamo.send(new PutItemCommand(params));

    response.body = JSON.stringify({
      message: "Successfully created comment.",
      createResult,
    });
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to create comment.",
      errorMsg: e.message,
      errorStack: e.stack,
    });
  }

  return response;
};

module.exports = { createComment };
