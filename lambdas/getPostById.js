const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const dynamo = new DynamoDBClient({});
const { QueryCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall, marshall } = require("@aws-sdk/util-dynamodb");

function sortByDate(a, b) {
  if (a.date > b.date) {
    return -1;
  } else return 1;
}

const getPost = async (event, context) => {
  const response = {};
  try {
    let data;
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      IndexName: "userId-posId-index",
      ConsistentRead: false,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: marshall({
        ":userId": event.path.userId,
      }),
    };

    // const { Items } = await dynamo.send(new QueryCommand(params));
    // data = Items.map((item) => unmarshall(item));
    // data = data.sort(sortByDate);

    // response.statusCode = 200;
    // response.body = JSON.stringify({
    //   message: "success",
    //   result: data.length,
    //   data
    // });
    return params;
    // const res = await dynamo.send(new QueryCommand(params));

    // console.log(res);
    // response.body = JSON.stringify({
    //     message: "Successfull get request",
    //     data: (Item) ? unmarshall(Item) : {},
    //     rawData: Item,
    // });
  } catch (e) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to fetch post.",
      errorMsg: e.message,
      errorStack: e.stack,
    });
    return response;

  }
};

module.exports = { getPost };
