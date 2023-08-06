import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid'; 

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  try {

    const body = JSON.parse(event.body);

    const { category, Name, score } = body;
    const currentDate = new Date().toLocaleDateString('en-GB');
    const individual_id = uuidv4();

    const params = {
      TableName: 'team_scores',
      Item: {
        team_name: uuidv4(),
        category: category,
        Date: currentDate,
        Max_Score: '100',
        Name: Name,
        Score: score,
      },
    };

    const params2 = {
      TableName: 'individual_score',
      Item: {
        individual_id,
        category: category,
        Date: currentDate,
        'Max Score': 100,
        Name: Name,
        Score: score,
      },
    };

    await Promise.all([
      dynamoDB.put(params).promise(),
      dynamoDB.put(params2).promise(),
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
        },
        message: 'Score saved successfully.' }),
    };
  } catch (error) {
    console.error('Error saving score:', error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({ message: 'Error saving score.' }),
    };
  }
};
