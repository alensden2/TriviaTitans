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
  accessKeyId: 'ASIAVKRJSILQG7BFYRFE',
  secretAccessKey: 'LX/m6VSXLjbUUg5iXZKZLI5BRDGNdsIkz0A6MIMb',
  sessionToken: 'FwoGZXIvYXdzENz//////////wEaDGRJhwdXB1iX6EaRuiLAAYgFsAa4YLYc2XTK3a54dB4kyTGRC4JULstMY7SLciVJEQBtJ6X/f6rYJlcVp+ZiY6X7LC8RvK0/Ji8rEO46EmxfyUBBm72DIGAfIZ+/57V4DTVzyGzmo7f6tp9dYGc+MudCRxP05YGVcAevURuwpsf5veufDEmQwcIOEs15u1MRQfI2YXTmpYsA40FWVzTBV6DH5NWmgnRjDTA+6icFor+aL+aXUusAZOztbLNmAZ7doh/p/8yrcUjv7N5Nd2hq8CiC+IqmBjItmiI/SmyM9PGkNmdw0A1dSVdip6AOorDUqwPB903fgOlK+lfkcMoB4wyS4RzV'
});

// Function to interact with Amazon Lex V2 bot
async function sendTextToLex(userInput) {
  const lexRuntime = new LexRuntimeV2();

  const params = {
    botId: 'FFRZZJUKRK', // Replace with your Lex V2 bot ID
    botAliasId: 'YIIEJ9TURB', // Replace with your Lex V2 bot alias ID
    localeId: 'en_US', // Replace with your Lex V2 bot locale ID
    sessionId: '134', // Provide a unique identifier for the session
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
    // result = 
    if (response) {
      // Process the response from Amazon Lex and update the messages state
      setMessages((prevMessages) => [...prevMessages, response.messages[0].content]);
      if(response.messages[0].content === "To login, please visit our website."){
        alert("To login, please visit our website. Redirecting to Login Page")
        navigate('/login')
      }
      else if (response.messages[0].content === "To sign up, please visit our website and complete the registration form."){
        alert("To sign up, please visit our website and complete the registration form. Redirecting to Registration Page")
        navigate('/register')
      }
      else if (response.messages[0].content === "To play a game, go to the Games section on our website and choose a game to play."){
        alert("To play a game, go to the Games section on our website and choose a game to play.")
        // navigate to game play page
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