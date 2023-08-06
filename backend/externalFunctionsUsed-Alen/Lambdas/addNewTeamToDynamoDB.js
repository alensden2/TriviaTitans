const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const object = JSON.stringify(event);
    const parsedData = JSON.parse(object);
    const uid = parsedData.uid;
    const teamName = parsedData.teamName;
    const members = parsedData.members;

    const params = {
        TableName: 'team_players', 
        Item: {
            uid: uid,
            teamAdmin: uid,
            teamName: teamName,
            members: members
        },
        ConditionExpression: 'attribute_not_exists(uid)', // Add this condition to create the item only if the UID doesn't exist
    };

    try {
        await dynamoDB.put(params).promise();
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Allow requests from any origin
                'Access-Control-Allow-Methods': 'POST', // Allow only POST requests
                'Access-Control-Allow-Headers': 'Content-Type', // Allow requests with Content-Type header
            },
            body: JSON.stringify({ message: 'Item created successfully' })
        };
    } catch (error) {
        // Check if the error is due to the UID already existing in the table
        if (error.code === 'ConditionalCheckFailedException') {
            // If the UID already exists, update the item instead
            const updateParams = {
                TableName: 'team_players', 
                Key: {
                    uid: uid
                },
                UpdateExpression: 'SET teamName = :teamName, members = :members',
                ExpressionAttributeValues: {
                    ':teamName': teamName,
                    ':members': members
                }
            };

            try {
                await dynamoDB.update(updateParams).promise();
                return {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*', // Allow requests from any origin
                        'Access-Control-Allow-Methods': 'POST', // Allow only POST requests
                        'Access-Control-Allow-Headers': 'Content-Type', // Allow requests with Content-Type header
                    },
                    body: JSON.stringify({ message: 'Item updated successfully' })
                };
            } catch (updateError) {
                console.error('Error updating item:', updateError);
                return {
                    statusCode: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*', // Allow requests from any origin
                    },
                    body: JSON.stringify({ message: 'Error updating item' })
                };
            }
        } else {
            console.error('Error creating item:', error);
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Allow requests from any origin
                },
                body: JSON.stringify({ message: 'Error creating item' })
            };
        }
    }
};
