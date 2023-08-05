const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const userEmail = event.email;
console.log(userEmail);
  try {
    // Fetch all questions for the given user email
    const params = {
      TableName: 'Authentication_Questions',
      FilterExpression: 'User_ID = :userEmail',
      ExpressionAttributeValues: {
        ':userEmail': userEmail,
      },
    };
    
    console.log(params)

    const response = await dynamoDB.scan(params).promise();
    const questions = response.Items;

    // Select a random question from the list
    const randomIndex = Math.floor(Math.random() * questions.length);
    const randomQuestion = questions[randomIndex].Question;

    return {
      statusCode: 200,
      body: { question: randomQuestion },
    };
  } catch (error) {
    console.error('Error fetching questions:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching questions' }),
    };
  }
};
