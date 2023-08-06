const AWS = require('aws-sdk');
const axios = require('axios');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const googleCloudFunctionURL = 'https://us-east1-automatedquestionstagging.cloudfunctions.net/questionstagger';

exports.triggerGoogleCloudFunction = async (event, context) => {
  try {
    for (const record of event.Records) {
      if (record.eventName === 'INSERT' || record.eventName === 'MODIFY') {
        const newImage = record.dynamodb.NewImage;
        const questionText = newImage.question.S;
        const questionid = newImage.questionid.S;
        // Call the Google Cloud Function to extract tags
        const tags = await callGoogleCloudFunction(questionText);
        console.log(tags)
        // Update the DynamoDB item with the tags
        await updateDynamoDBItem(questionid, tags);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify('Tags extraction and update completed.'),
    };
  } catch (error) {
    console.error('Error in DynamoDB trigger handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify('Error in DynamoDB trigger handler.'),
    };
  }
};

async function callGoogleCloudFunction(questionText) {
  try {
    const payload = { text: questionText };

    const response = await axios.post(googleCloudFunctionURL, payload);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error calling Google Cloud Function:', error);
  }
}

async function updateDynamoDBItem(questionid, tags) {
    try {
        // Extract the specific category from the 'tags' object
        const category = tags.category.split('/').pop(); 
    
        const params = {
          TableName: 'TriviaQuestions',
          Key: { questionid: questionid },
          UpdateExpression: 'SET Category = :category', // Update the 'Category' attribute in DynamoDB
          ExpressionAttributeValues: { ':category': category },
        };
    
        await dynamoDB.update(params).promise();
        console.log('DynamoDB UpdateItem Success:', questionid);
      } catch (error) {
        console.error('Error updating DynamoDB item:', error);
      }
}
