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
        accessKeyId: "ASIA4R6SGBPEO5QLSO3W",
        secretAccessKey: "mAgC8nq0dUSWYd+g4Zck+XFfUVJ/O4VseYCAPOUb",
        sessionToken: "FwoGZXIvYXdzEJf//////////wEaDBM0Mn4lt0TL8bMf4CLAAb+XHmtEp8E3SQPfOuYF6D1wk6eJjCci4npRCu+n6Q8DKsLry/QC13oM5Ybv149dOg7QndII1MwGMfjc8fycRSAhwULWSairMydFQYjOlr/hLpVHHbZ06CMJwskclSAciq47Zyv+sAG05VwMSBN/9R9MEPKTO1InoihLXLG+R6g6noGn23Bg2NhowAREaOuUjZtIb/6IDNpKM5qg9NTG9c7bOaguuKFGc4Vq9KTtX86Yb+HX55MYwW3cEmEiulaaKyip/rOmBjItnEcB6oIFnm2IO4xvrzPfBcdoSyeqtd5Kdkzpo6q3TG9Pbs1vcqCEq43B8rIp",
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
