const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { email } = JSON.parse(event.body);

    const params = {
      TableName: 'Authentication_Questions',
      IndexName: 'User_ID-Question_User_ID-index',
      KeyConditionExpression: 'User_ID = :user',
      ExpressionAttributeValues: {
        ':user': email,
      },
    };

    const result = await dynamodb.query(params).promise();

    const questions = result.Items;
    const randomIndex = Math.floor(Math.random() * questions.length);
    const randomQuestion = questions[randomIndex];

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        question: randomQuestion.Question,
        questionId: randomQuestion.Question_User_ID,
      }),
    };

    return response;
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
