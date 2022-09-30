const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const { uuid } = require("uuidv4");

const dynamo = new DynamoDBClient({});

const createPost = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
    },
  };
  try {
    const requestJSON = event.body;
    if (!userid || !username || !content){
      throw new Error('Invalid Request Body')
    }
    const data = {
      postId: uuid(),
      userId: requestJSON.userid,
      userName: requestJSON.username,
      date: new Date().getTime(),
      content: requestJSON.content,
      comments: 0,
    };
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(data),
    };
    const createResult = await dynamo.send(new PutItemCommand(params));

    response.body = JSON.stringify({
      status: "success",
      message: "Successfully created post.",
      data,
    });
  } catch (err) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      status: "fail",
      message: err
    });
  }
  return response;
};

module.exports = { createPost };
