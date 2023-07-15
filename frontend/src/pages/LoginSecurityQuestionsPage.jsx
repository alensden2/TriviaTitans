import { Box, Button, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginSecurityQuestions() {
    const AWS = require('aws-sdk');
    const { user } = UserAuth();
    const navigate = useNavigate();
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(true);

    const handleAnswerChange = (event) => {
        setAnswer(event.target.value);
    };

    const AWS_CONFIG = {
        region: 'us-east-1',
        accessKeyId: "ASIAT3VCK2DAAVLANP7M",
        secretAccessKey: "F7pTJ61YLSPNjW15lM9BvtWsLw4JcfIXj+ByCxQk",
        sessionToken: "FwoGZXIvYXdzEKv//////////wEaDPqZLaK8hFfk1H/kHyLAAa0t7VCJ3OpgBhmg5nL7iIxTbsdWJd9hVs9VV8YqV8Sn/2FrpzPUxdXA2/DnEU0xyHUcuHNBn0NJjO7GgOv/dD3vzlQgtgZC/jASHfYmYunr1gpjptA/lgLFFywbWRIsq0Nqrs4MgVL4ySS36HjErvgAP0VKALoZM0MTsMOeeQeZyKiA6on8BBCq8QCWfm9EWxJYUmajipyu5Wiquwc9wHGD6aMRz+Iax0NOKSDkUZ1k02ebkxQHRYjTP5YiHTtSECij98elBjItPru1Hs77dJ8JpNuV5lNgf9i/uYrNQQkzSL2H+tNQJL+u5FW6qSwcd0c1Umz8",
    };

    AWS.config.update(AWS_CONFIG);
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (answer === 'correct answer') {
            console.log('Answer is correct');
            navigate('/profilePage');
        } else {
            console.log('Answer is incorrect');
            alert('Incorrect answer. Please try again.');
        }

        setAnswer('');
    };

    useEffect(() => {
        const getSecurityQuestion = () => {
            const lambda = new AWS.Lambda({ region: 'us-east-1' });
            const params = {
                FunctionName: 'arn:aws:lambda:us-east-1:265554677952:function:randomQuestionSelector',
                Payload: JSON.stringify({ email: user.email }),
            };


            lambda.invoke(params, (err, data) => {
                if (err) {
                    console.error('Error retrieving security question', err);
                } else {
                    const response = JSON.parse(data.Payload);
                    console.log(response)
                    const fetchedQuestion = response.question;
                    setQuestion(fetchedQuestion);
                    setLoading(false);
                }
            });
        };

        getSecurityQuestion();
    }, [AWS, user.email]);

    return (
        <Box>
            <Box>
                <Navbar />
            </Box>
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
                    <form onSubmit={handleSubmit}>
                        <p>{question}</p>
                        <TextField
                            label="Answer"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={answer}
                            onChange={handleAnswerChange}
                        />
                        <Button
                            style={{ marginTop: '17px', marginBottom: '7px' }}
                            variant="contained"
                            color="secondary"
                            type="submit"
                        >
                            Submit
                        </Button>
                    </form>
                )}
            </Box>
        </Box>
    );
}

export default LoginSecurityQuestions;
