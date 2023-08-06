const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const userEmail = event.email;
  const userQuestion = event.question;
  const userAnswer = event.answer;

  console.log(userEmail);
  try {
    // Fetch the stored answer for the given question and user email
    const params = {
      TableName: 'Authentication_Questions',
      FilterExpression: 'User_ID = :userEmail and Question = :userQuestion',
      ExpressionAttributeValues: {
        ':userEmail': userEmail,
        ':userQuestion': userQuestion,
      },
    };

    const response = await dynamoDB.scan(params).promise();
    const questions = response.Items;

    if (questions.length === 0) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid question or user email' }),
      };
    }

    const storedAnswer = questions[0].Answer;

    // Check if the provided answer matches the stored answer
    if (userAnswer === storedAnswer) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Authentication successful' }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Authentication failed' }),
      };
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
