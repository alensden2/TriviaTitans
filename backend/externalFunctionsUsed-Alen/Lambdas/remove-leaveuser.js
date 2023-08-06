const AWS = require('aws-sdk');

// Initialize DynamoDB DocumentClient
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const teamName = event.teamName;
  const uid = event.uid; // UID of the user to be removed

  try {
    // Get the team details from DynamoDB
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

    // Extract the members and teamAdmin from the team data
    let members = teamData.Item.members ? teamData.Item.members : [];
    const teamAdmin = teamData.Item.teamAdmin ? teamData.Item.teamAdmin : null;

    // Check if the user with the provided UID is a member of the team
    if (!members.includes(uid)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'User is not a member of the team' }),
      };
    }

    // Remove the user from the members array
    members = members.filter((memberUid) => memberUid !== uid);

    // Update the team members in DynamoDB
    const updateParams = {
      TableName: 'team_players',
      Key: {
        teamName: teamName,
      },
      UpdateExpression: 'SET members = :members',
      ExpressionAttributeValues: {
        ':members': members,
      },
    };

    await dynamoDb.update(updateParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User removed from the team successfully' }),
    };
  } catch (error) {
    console.error('Error removing user from team:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error removing user from team' }),
    };
  }
};
