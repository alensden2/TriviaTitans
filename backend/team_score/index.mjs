import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1', 
});

const table_name = 'team_scores';

export const handler = async (event) => {

  const body = JSON.parse(event.body);
  const query = {};

  if (body.category) {
    query.category = body.category;
  }

  const params = {
    TableName: table_name,
    FilterExpression: query.category ? 'category = :category' : null,
    ExpressionAttributeValues: query.category ? { ':category': query.category } : null,
  };

  return new Promise((resolve, reject) => {
    dynamoDB.scan(params, (err, data) => {
      if (err) {
        console.error('Error fetching data:', err);
        reject({ statusCode: 500, 
          headers: {
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
          },
          body: JSON.stringify({ error: 'Error fetching data' }) });
      } else {
        resolve({ statusCode: 200, 
          headers: {
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
          },
          body: JSON.stringify(data.Items),  });
      }
    });
  });
  
};