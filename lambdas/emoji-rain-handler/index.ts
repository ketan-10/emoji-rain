import {APIGatewayProxyEvent, Handler, APIGatewayProxyResultV2} from "aws-lambda"
import {ApiGatewayManagementApi,DynamoDB} from "aws-sdk";

// env
const DYNAMODB_NAME = process.env.DYNAMODB_NAME!;
const CALLBACK_URL = process.env.CALLBACK_URL!;
const AUTO_DELETE_SEC: number = Number(process.env.AUTO_DELETE_SEC!);

// services
const client = new ApiGatewayManagementApi({endpoint: CALLBACK_URL});
const ddb = new DynamoDB.DocumentClient(); 

const insertConnection = async (connectionId: string) => {
  const params = {
    TableName: DYNAMODB_NAME,
    Item: { 
      'connection': connectionId,
      'ttl': Math.floor(Date.now() / 1000) + AUTO_DELETE_SEC
    }
  }
  return await ddb.put(params).promise();    
}

const deleteConnection = async (connectionId: string) => {
  const params = {
    TableName: DYNAMODB_NAME,
    Key: { 
        'connection': connectionId,
    }
  }
  return await ddb.delete(params).promise(); 
}
const readAllConnections = async () => {
  const params = {
    TableName: DYNAMODB_NAME,
  }
  const items =  await ddb.scan(params).promise();
  return items.Items?.map(i => i.connection as string) ?? [];
}

const sendOne = async (id: string, myEmoji: string) => {
  try{
    await client.postToConnection({
        'ConnectionId': id,
        'Data': Buffer.from(JSON.stringify({myEmoji}))
    }).promise();
  }catch(e){
    console.log("Unable to send Emoji:",myEmoji, " for connectionID: ",id," Error:", e);
  }
    
};

const sendAll = async (ids: Array<string>, myEmoji: string) => {
  const all = ids.map(id => sendOne(id,myEmoji));
  return Promise.all(all);
  // return await Promise.all(all);  // same as above

};

export const handler : Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2>=> {

  console.log("Event: ", event);
  try{
    const connectionId = event.requestContext.connectionId;
    const routeKey = event.requestContext.routeKey;

    console.log("ConnectionId: ", connectionId);
    console.log("RouteKey: ", routeKey);

    switch (routeKey) {
      case '$connect':
          await insertConnection(connectionId!);
          break;
      case '$disconnect':
          await deleteConnection(connectionId!);
          break;
      case '$default':
          break;
      case 'sendEmoji':
        // Parse body
        const {myEmoji} = JSON.parse(event.body);
        if(!myEmoji || myEmoji.length > 10){
          throw new Error("Invalid Emoji [event] : "+event);
        }
        const allConnections = await readAllConnections();
        await sendAll(allConnections.filter(a => a !== connectionId), myEmoji);
        break;  
      default:
          // code
    }
  }catch(err){
    console.log(err);
    return {
      statusCode: 400,
      body: err.message,
    };
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
}