const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const { uuid } = require("uuidv4");

const dynamo = new DynamoDBClient({});

const createPost = async (event) => {
  const requestJSON = JSON.parse(event.body);
  const data = {
    postId: uuid(),
    userId: requestJSON.userId,
    userName: requestJSON.userName,
    date: new Date().getTime(),
    content: requestJSON.content,
    comments: 0,
  };
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: marshall(data),
  };
  const createResult = await dynamo.send(new PutItemCommand(params));

  const body = {
    message: "Successfully created post.",
    data,
  };
  return event;
};

module.exports = { createPost };
