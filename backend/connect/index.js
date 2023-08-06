const AWS = require('aws-sdk');

const ENDPOINT = 'aczb9osxy0.execute-api.us-east-1.amazonaws.com/production/';
const client = new AWS.ApiGatewayManagementApi({ endpoint: ENDPOINT });
const names = {};

const sendToOne = async (id, body) => {
  try {
    await client.postToConnection({
      'ConnectionId': id,
      'Data': Buffer.from(JSON.stringify(body)),
    }).promise();
  } catch (err) {
    console.error(err);
  }
};

const handler = async (event) => {
  if (event.requestContext) {
    console.log(event);
    console.log(event.requestContext);
    console.log(event.requestContext.routekey);
    const connectionId = event.requestContext.connectionId;
    const routekey = event.requestContext.routeKey;
    let body = {};
    try {
      if (event.body) {
        body = JSON.parse(event.body)
      }
    } catch (err) {
      // Handle JSON parse error
    }
    routekey
    switch (routekey) {
      case '$connect':
        // code for $connect
        break;
      case '$disconnect':
        // code for $disconnect
        break;
      case '$default':
        // code for $default
        break;
      case 'setName':
        // code for 'setName'
        break;
      case 'sendPrivate':
        await sendToOne(connectionId, { privateMessage: 'this is a private message' });
        break;
      default:
        // code for other cases
    }
  }

  // TODO implement
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify('Hello from Lambda!'),
  };
  return { 
    statusCode: 200, 
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify({ msg: event.requestContext.connectionId})
  };

};

module.exports = { handler };
