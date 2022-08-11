const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const {unmarshall } = require("@aws-sdk/util-dynamodb");

const dynamo = new DynamoDBClient({});

function sortByDate (a,b){
    if(a.date >b.date){
      return -1
    }else return 1
  }

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
        const data = Items.map((item) => unmarshall(item))

        response.body = JSON.stringify(
            data.sort(sortByDate)
        );
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to retrieve posts.",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }

    return data;
};

module.exports = { getAllPosts};