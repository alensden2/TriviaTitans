import { Box, Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import Navbar from '../components/navbar';
import { UserAuth } from '../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import axios from "axios"


function SecurityQuestionPage() {
    const AWS = require('aws-sdk');
    const [question1, setQuestion1] = useState('');
    const [answer1, setAnswer1] = useState('');
    const [question2, setQuestion2] = useState('');
    const [answer2, setAnswer2] = useState('');
    const [question3, setQuestion3] = useState('');
    const [answer3, setAnswer3] = useState('');
    const { user } = UserAuth();
    const navigate = useNavigate();


    const handleQuestion1Change = (event) => {
        setQuestion1(event.target.value);
    };

    const AWS_CONFIG = {
        region: 'us-east-1',
        accessKeyId: "ASIA4R6SGBPEL3GR55WY",
        secretAccessKey: "1PRdfUP7WsYgpSaFiSjXXTLvaQeF6SVHhn60JLZO",
        sessionToken: "FwoGZXIvYXdzELj//////////wEaDD5SPZCWsnwJcIBtRiLAAU6OnolBMJv5Sxzyp4UfWRcME3AAKO34M/6RfGIF+vq8ycF2L3RFkPuTgrM+bp/esnYNdAblBgGMCuijVQMeBB5yVH81ebypiuOUohlpT8u6c54EooD1TqXAEmTyKrN/bnEs7hIFaWMMstAhGDoflSt6gaLW541urIUCx1TpPnfiVJKfjCgug4aZVb1OKtxvneTJwpAgiqnYiK5+GFizDHMgci5OdQHAiLa4bvIh9sRNjxS9tl0oDqNUXdi2p5SVViiBkbumBjItY0cBjqiAORj42yGyG4HdGraCTnEcP3QyFam9GHIkBRqQs655ML7bdnobkxeJ",
    };

    AWS.config.update(AWS_CONFIG);

    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const tableName = 'Authentication_Questions';



    const handleAnswer1Change = (event) => {
        setAnswer1(event.target.value);
    };

    const handleQuestion2Change = (event) => {
        setQuestion2(event.target.value);
    };

    const handleAnswer2Change = (event) => {
        setAnswer2(event.target.value);
    };

    const handleQuestion3Change = (event) => {
        setQuestion3(event.target.value);
    };

    const handleAnswer3Change = (event) => {
        setAnswer3(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log('triigered')

        // console.log('Question 1:', question1);
        // console.log('Answer 1:', answer1);
        // console.log('Question 2:', question2);
        // console.log('Answer 2:', answer2);
        // console.log('Question 3:', question3);
        // console.log('Answer 3:', answer3);
        //

        // extracting the user email (partition keys)
        const user_id = user.email;
        console.log("ssss",user)
                if (user) {
                    const userObject = {
                      uid: user.uid,
                      email: user.email,
                      teamName: ""
                    };
                    await axios.post("https://us-central1-serverlessproject-9d011.cloudfunctions.net/addDetails", userObject);

                }
        // random ids for the questions 
        // the sort key 
        const id1 = uuidv4();
        const id2 = uuidv4();
        const id3 = uuidv4();

        // preping to store into dymnoDB

        const securityQAs = [
            {
                User_ID: user_id,
                Question_User_ID: id1,
                uid: user.uid,
                Question: question1,
                Answer: answer1
            },
            {
                User_ID: user_id,
                Question_User_ID: id2,
                uid: user.uid,
                Question: question2,
                Answer: answer2
            },
            {
                User_ID: user_id,
                Question_User_ID: id3,
                uid: user.uid,
                Question: question3,
                Answer: answer3
            },
        ];

        // Storing the securityQAs in the DB
        try {
            await Promise.all(
                securityQAs.map((item) => 
                    dynamodb.put({TableName: tableName, Item: item}).promise()
                )
            );
            console.log("QAs, Stored Successfully")
            alert("Questions and Answers submitted successfully")
            alert("Login Success!")
            navigate("/profilePage")
        } catch (error) {
            console.error("Error storing the QAs", error);
            alert("Questions and Answers not submitted")
        }

        // Reset form fields
        setQuestion1('');
        setAnswer1('');
        setQuestion2('');
        setAnswer2('');
        setQuestion3('');
        setAnswer3('');
    };

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
                <h3 style={{ marginBottom: '5px', marginTop: '5px' }}>Security Questions</h3>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Question 1"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={question1}
                        onChange={handleQuestion1Change}
                    />
                    <TextField
                        label="Answer 1"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={answer1}
                        onChange={handleAnswer1Change}
                    />
                    <TextField
                        label="Question 2"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={question2}
                        onChange={handleQuestion2Change}
                    />
                    <TextField
                        label="Answer 2"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={answer2}
                        onChange={handleAnswer2Change}
                    />
                    <TextField
                        label="Question 3"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={question3}
                        onChange={handleQuestion3Change}
                    />
                    <TextField
                        label="Answer 3"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={answer3}
                        onChange={handleAnswer3Change}
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
            </Box>
        </Box>
    );
}

export default SecurityQuestionPage;
