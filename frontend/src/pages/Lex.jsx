import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

// Import the AWS SDK and set up AWS configuration with your credentials
import AWS from 'aws-sdk';
import { LexRuntimeV2 } from 'aws-sdk';
import { useNavigate } from 'react-router-dom';

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: 'ASIAVKRJSILQKALJRTHS',
  secretAccessKey: 'mEUxQGMkW7JokjLw7AgcJhtqCxt1GAt4glUDG9QJ',
  sessionToken: 'FwoGZXIvYXdzELL//////////wEaDM556kn7r67hUNpHoSLAAQSIYaBueNi2QCAgWDrfz0xbtUCQdlraGN8vTq1eotj+uermzRgimhOu/f9th/tZkl0diOIluB6zY8eAbp+VlcvQ56p3Lf20DB1pHGcri2+B92uiu1pf9dotFmivbgocod8Hzgy99y1ikRU+4AgIAhOahi8YWdh81nmRLGOIACi5NMdt1+BHxXUi21yts2kPaouD9u+basyGg9OPiOeRpP1BBLdwMnECzEmYAp7prSnDp40PKIeo6bLCgmyzwGMGmCiB1oGmBjItaIR28QkNniznLdChmxaWTKrIA79bufV+Jn7MQTVyvA+h46VY19i330fheMxO'
});

// Function to interact with Amazon Lex V2 bot
async function sendTextToLex(userInput) {
  const lexRuntime = new LexRuntimeV2();

  const params = {
    botId: 'FFRZZJUKRK', // Replace with your Lex V2 bot ID
    botAliasId: 'YIIEJ9TURB', // Replace with your Lex V2 bot alias ID
    localeId: 'en_US', // Replace with your Lex V2 bot locale ID
    sessionId: '123', // Provide a unique identifier for the session
    text: userInput,
  };

  try {
    const data = await lexRuntime.recognizeText(params).promise();
    return data;
  } catch (error) {
    console.error('Error interacting with Amazon Lex:', error);
    return null;
  }
}

function Lex() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  async function handleUserInput() {
    // Clear the input field
    setInputText('');

    const response = await sendTextToLex(inputText);
    console.log(response.messages[0].content)
    // result = 
    if (response) {
      // Process the response from Amazon Lex and update the messages state
      setMessages((prevMessages) => [...prevMessages, response.messages[0].content]);
      alert(response.messages[0].content)
      if(response.messages[0].content === 'Sure!! Redirecting you to Login Page'){
        navigate('/login')
      }
      else if (response.messages[0].content === 'Sure!! Redirecting you to Registration page'){
        navigate('/register')
      }
    }
  }

  return (
    <div>
      <Grid container direction="column" spacing={2}>
        <Grid item xs={12}>
          {/* Chat window */}
          <div>
            {messages.map((message, index) => (
              <Typography key={index} variant="body1">
                {message}
              </Typography>
            ))}
          </div>
        </Grid>
        <Grid item xs={12}>
          {/* User input field */}
          <TextField
            label="Type your message"
            variant="outlined"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleUserInput}>
            Send
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default Lex;