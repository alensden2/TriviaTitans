import { Box, Button, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function LoginSecurityQuestions() {
  const { user } = UserAuth();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };
  const location = useLocation();
  const email = location.state?.email;
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Check if the user's answer matches the correct answer
    if (!answer) {
      alert('Please enter your answer.');
      return;
    }
  
    try {
      const res = await axios.post('https://kt1v6etemi.execute-api.us-east-1.amazonaws.com/Test/random-question-answer', {
        email: email,
        question: question,
        answer: answer,
      });
  
      if (res.status === 200) {
        console.log('Authentication successful');
        // Perform the action to navigate to the profile page or handle success
        navigate('/profilePage');
      } else {
        console.log('Authentication failed');
        // Show an alert or message to the user that the authentication failed
        alert('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      // Show an alert or message to the user that there was an error
      alert('Error checking authentication. Please try again later.');
    }
  }; 

  useEffect(() => {
    const getSecurityQuestion = async () => {
      try {
        const response = await fetch('https://kt1v6etemi.execute-api.us-east-1.amazonaws.com/Test/randon-question-selector', {
          method: 'POST',
          body: JSON.stringify({ email: user.email }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Error retrieving security question');
          return;
        }

        const data = await response.json();
        const object = JSON.stringify(data);
    const parsedData = JSON.parse(object);
        console.log(parsedData.body.question);
        setQuestion(parsedData.body.question);
        console.log(question)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching security question:', error);
      }
    };

    getSecurityQuestion();
  }, [user.email]);

  return (
    <Box>
      <Navbar />
      <Box
        sx={{
          width: '300px',
          margin: 'auto',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          textAlign: 'center',
          fontWeight: 'bold',
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h3 style={{ marginBottom: '5px', marginTop: '5px' }}>Security Question</h3>
        {loading ? (
          <p>Loading question...</p>
        ) : (
          <div>
            <p>{question}</p>
            <TextField
              label="Answer"
              variant="outlined"
              fullWidth
              margin="normal"
              value={answer}
              onChange={handleAnswerChange} // Capture user's answer in the state
            />
            <Button
              style={{ marginTop: '17px', marginBottom: '7px' }}
              variant="contained"
              color="secondary"
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        )}
      </Box>
    </Box>
  );
}

export default LoginSecurityQuestions;
