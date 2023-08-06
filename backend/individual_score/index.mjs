import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1', 
});

const table_name = 'individual_score';

export const handler = async (event) => {
  const query = {};

  const body = JSON.parse(event.body);

  if (body && body.category) {
      query.category = body.category;
  }

  if (body && body.Date) {
      query.DifficultyLevel = body.Date;
  }

  if (body && body.Name) {
      query.Name = body.Name;
  }

  const params = {
      TableName: table_name,
  };

  if (Object.keys(query).length > 0) {
      params.FilterExpression = Object.keys(query).map(key => `${key} = :${key}`).join(' AND ');
      params.ExpressionAttributeValues = Object.entries(query).reduce((acc, [key, value]) => {
          acc[`:${key}`] = value;
          return acc;
      }, {});
  }

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
          body: JSON.stringify(data.Items) });
      }
    });
  });
};