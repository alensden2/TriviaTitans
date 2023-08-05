const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const object = JSON.stringify(event);
    const parsedData = JSON.parse(object);
    const email = parsedData.email;

    // Check if the user exists in the DynamoDB table
    const params = {
      TableName: 'user_invite_status',
      Key: { email: email },
    };
    const existingUser = await dynamoDB.get(params).promise();

    if (existingUser.Item) {
      // User exists, fetch the record and delete it
      const deleteParams = {
        TableName: 'user_invite_status',
        Key: { email: email },
        ReturnValues: 'ALL_OLD',
      };
      const deletedUser = await dynamoDB.delete(deleteParams).promise();

      return {
        statusCode: 200,
        body: JSON.stringify({ user: deletedUser }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'User with the specified email not found' }),
      };
    }
  } catch (error) {
    console.error('Error updating user invite status:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error updating user invite status' }),
    };
  }
};
