const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const dynamo = new DynamoDBClient({});
const {QueryCommand} = require("@aws-sdk/client-dynamodb");
const {unmarshall, marshall } = require("@aws-sdk/util-dynamodb");

function sortByDate (a,b){
    if(a.date >b.date){
      return -1
    }else return 1
  }

const getPost = async (event) => {
    
    try {
        const params = {
            TableName: process.env.DYNAMOynamo_TABLE_NAME,
            IndexName: "userId-postId-index",
            ConsistentRead: false,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: marshall({
                ":userId": event.pathParameters.userId
            })
        };

        const { Items } = await dynamo.send(new QueryCommand(params));
        const data = Items.map((item) => unmarshall(item));
        const body = data.sort(sortByDate);
        // const res = await dynamo.send(new QueryCommand(params));

        // console.log(res);
        // response.body = JSON.stringify({
        //     message: "Successfull get request",
        //     data: (Item) ? unmarshall(Item) : {},
        //     rawData: Item,
        // });
        return event;
    } catch (e) {
        const response = {};
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to get post.",
            errorMsg: e.message,
            errorStack: e.stack,
        });
        return event;
    }

    
};

module.exports = { getPost};