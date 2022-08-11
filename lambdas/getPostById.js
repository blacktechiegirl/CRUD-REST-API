const { DynamoynamoClient, QueryCommand } = require("@aws-sdk/client-dynamo");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamo");

const dynamo = new DynamoynamoClient({});

function sortByDate (a,b){
    if(a.date >b.date){
      return -1
    }else return 1
  }

const getPost = async (event) => {
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
        response.body = JSON.stringify(data.sort(sortByDate));
        // const res = await dynamo.send(new QueryCommand(params));

        // console.log(res);
        // response.body = JSON.stringify({
        //     message: "Successfull get request",
        //     data: (Item) ? unmarshall(Item) : {},
        //     rawData: Item,
        // });
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to get post.",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }

    return response;
};

module.exports = { getPost};