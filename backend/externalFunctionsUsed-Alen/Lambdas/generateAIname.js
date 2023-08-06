const { Configuration, OpenAIApi } = require("openai");
const cors = require('cors');

// Configure the OpenAI API with your API key set as an environment variable in the Lambda function
const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Enable CORS for all origins
const corsMiddleware = cors();

exports.handler = async (event, context, callback) => {
    try {
        // Parse the request body from the event
        const requestBody = JSON.parse(event.body);
        
        // Use the CORS middleware
        await new Promise((resolve, reject) => {
            corsMiddleware(event, context, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        // Extract the generated team name from the OpenAI response
        const teamName = response.data?.choices?.[0]?.message?.content || 'Quirky Team Name';

        // Send the team name as a JSON response with status code 200
        const responseBody = { teamName };
        const responseHeaders = { 'Content-Type': 'application/json' };
        const responseCode = 200;

        const response = {
            statusCode: responseCode,
            headers: responseHeaders,
            body: JSON.stringify(responseBody)
        };

        callback(null, response);
    } catch (error) {
        console.error("Error generating team name:", error);

        // Send error response with status code 500
        const response = {
            statusCode: 500,
            body: JSON.stringify({ error: "An error occurred while generating the team name.", message: error })
        };

        callback(null, response);
    }
};
