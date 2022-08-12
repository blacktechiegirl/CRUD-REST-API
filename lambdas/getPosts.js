const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

const dynamo = new DynamoDBClient({});

function sortByDate(a, b) {
  if (a.date > b.date) {
    return -1;
  } else return 1;
}

const getAllPosts = async () => {
  let data;
  const params = { TableName: process.env.DYNAMODB_TABLE_NAME };
  const { Items } = await dynamo.send(new ScanCommand(params));
  data = Items.map((item) => unmarshall(item));
  data = data.sort(sortByDate);

  return data;
};

module.exports = { getAllPosts };
