import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

// Import the AWS SDK and set up AWS configuration with your credentials
import AWS from 'aws-sdk';
import { LexRuntimeV2 } from 'aws-sdk';
import { useNavigate } from 'react-router-dom';

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: 'ASIAVKRJSILQGSAQEMUO',
  secretAccessKey: '/IVp35r4BxxRqbJ8qnuSJY8ht9nva1mLdKMGd701',
  sessionToken: 'FwoGZXIvYXdzEKH//////////wEaDK+giAs7GRM6b5crLSLAAc9FuQczDKIlDmT4gDnPrtvj+J5dBc5noWDqUQ+JnjfLtxvEleQ/wCY2SMZGd3MT4TRl2VFfjRFsNu/K8inSftuDTINIZUDGsrYozioispj1YfMK1AujnthP7VOlVqRRJUzZWOfJoO7xXMn8gejS0UF8n4ZfYpS8SITUM30BNI+5xmV4kPK/6tx1BjHcR98Sw2cBkBYDwhz9hTZpK/gh1d1axpBUTH7D/gYlo9DlIjWBfLO2YbMrQBEjNW1rR6Mx1yiWnLamBjItldojjP1sOI1YmFcQmUHZ2g4/aaD0IuIQiuVQHBXci0SfEC+R4yIvSgYBXutP'
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

const useStyles = makeStyles((theme) => ({
  chatbotContainer: {
    width: 300,
    position: 'relative',
    position: 'fixed',
    bottom: 20,
    right: 20,
    maxWidth: 400,
    border: '1px solid #ccc',
    borderRadius: 5,
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'height 0.3s ease-in-out',
    backgroundColor: 'white'
  },
  chatbotHeader: {
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    background: '#f0f0f0',
  },
  chatbotMessages: {
    height: 300,
    padding: 10,
    overflowY: 'auto',
  },
  message: {
    padding: 8,
    marginBottom: 8,
    borderRadius: 5,
  },
  userMessage: {
    backgroundColor: '#d6e4ff',
  },
  chatbotMessage: {
    backgroundColor: '#f0f0f0',
  },
  chatbotInput: {
    display: 'flex',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flexGrow: 1,
    marginRight: 8,
  },
}));

function Lex() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isChatbotOpen, setChatbotOpen] = useState(true);
  const classes = useStyles();

  const toggleChatbot = () => {
    setChatbotOpen((prev) => !prev);
  };

  async function handleUserInput() {
    // Clear the input field
    setInputText('');
    setMessages([...messages, { text: inputText, user: true }]);

    const response = await sendTextToLex(inputText);
    // result = 
    if (response) {
      // Process the response from Amazon Lex and update the messages state
      setMessages((prevMessages) => [...prevMessages, { text: response.messages[0].content, user: false }]);
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
    <div className={classes.chatbotContainer} style={{ height: isChatbotOpen ? '440px' :'50px' }}>
      <div className={classes.chatbotHeader} onClick={toggleChatbot}>
        Chatbot
        {isChatbotOpen ? ' -' : ' +'}
      </div>
      {isChatbotOpen && (
        <>
          <div className={classes.chatbotMessages}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${classes.message} ${
                  message.user ? classes.userMessage : classes.chatbotMessage
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className={classes.chatbotInput}>
            <TextField
              className={classes.input}
              variant="outlined"
              label="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleUserInput}>
              Send
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Lex;