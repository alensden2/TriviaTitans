import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1', 
});

const table_name = 'TT-Questions';

export const handler = async (event) => {
  try {
  const query = {};

  const body = JSON.parse(event.body);

  if (body.Category) {
    query.Category = body.Category;
  }

  if (body.DifficultyLevel) {
    query.DifficultyLevel = body.DifficultyLevel;
  }

  const params = {
    TableName: table_name,
    FilterExpression: Object.keys(query).map(key => `${key} = :${key}`).join(' AND '),
    ExpressionAttributeValues: Object.entries(query).reduce((acc, [key, value]) => {
      acc[`:${key}`] = value;
      return acc;
    }, {}),
    Limit: 5, // Set the initial limit to 5
  };

  let allItems = [];

  const scanWithPagination = async () => {
    try {
      const data = await dynamoDB.scan(params).promise();
      allItems.push(...data.Items);

      if (data.LastEvaluatedKey) {
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        await scanWithPagination();
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      throw err;
    }
  };

  await scanWithPagination();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify(allItems),
  };
  }catch (error) {
  console.error("Error parsing JSON:", error);
  return {
    statusCode: 400, // Bad request status code
    body: JSON.stringify({ message: "Invalid JSON format in the request body" }),
  };

};
};
