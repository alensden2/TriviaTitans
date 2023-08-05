const AWS = require('aws-sdk');

// Initialize DynamoDB DocumentClient
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const teamName = event.teamName;

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
    const members = teamData.Item.members ? teamData.Item.members : [];
    const teamAdmin = teamData.Item.teamAdmin ? teamData.Item.teamAdmin : null;

    return {
      statusCode: 200,
      body: JSON.stringify({ members: members, teamAdmin: teamAdmin }),
    };
  } catch (error) {
    console.error('Error fetching team members:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching team members' }),
    };
  }
};
