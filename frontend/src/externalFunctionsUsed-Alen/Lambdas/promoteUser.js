const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const object = JSON.stringify(event);
    const parsedData = JSON.parse(object);
    
    const uid =  parsedData.uid;
    const teamName = parsedData.teamName;
    
    const getParams = {
        TableName: 'team_players', 
        Key: { teamName: teamName }
    };

    try {
        const teamRecord = await dynamoDB.get(getParams).promise();
        const teamData = teamRecord.Item;

        if (!teamData) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Team not found' })
            };
        }

        // Check if the user with the provided UID is already a member of the team
        if (!teamData.members || !teamData.members.includes(uid)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'User is not a member of the team' })
            };
        }

        // Update the teamAdmin UID to the provided UID
        const updateParams = {
            TableName: 'team_players', 
            Key: { teamName: teamName },
            UpdateExpression: 'SET teamAdmin = :teamAdmin',
            ExpressionAttributeValues: {
                ':teamAdmin': uid
            }
        };

        await dynamoDB.update(updateParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'TeamAdmin updated successfully' })
        };
    } catch (error) {
        console.error('Error updating teamAdmin:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};
