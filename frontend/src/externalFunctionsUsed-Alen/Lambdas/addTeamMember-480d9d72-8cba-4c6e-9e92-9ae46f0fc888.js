const AWS = require('aws-sdk');

// Initialize DynamoDB DocumentClient
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const teamName = event.teamName;
  const uid = event.uid;

  try {
    // Get the existing team details from DynamoDB
    const params = {
      TableName: 'team_players',
      Key: {
        teamName: teamName,
      },
    };

    const teamData = await dynamoDb.get(params).promise();

    // Check if the team exists
    if (!teamData.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Team not found' }),
      };
    }

    // Append the new uid to the members array
    const newMembers = teamData.Item.members ? teamData.Item.members.concat(uid) : [uid];

    // Update the team with the new members array
    const updateParams = {
      TableName: 'team_players',
      Key: {
        teamName: teamName,
      },
      UpdateExpression: 'SET members = :members',
      ExpressionAttributeValues: {
        ':members': newMembers,
      },
    };

    await dynamoDb.update(updateParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'UID added to the team members array' }),
    };
  } catch (error) {
    console.error('Error adding UID to team members:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error adding UID to team members' }),
    };
  }
};
