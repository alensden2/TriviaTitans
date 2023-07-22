import { Card, CardContent, Divider, FormControl, Stack, TextField, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ListQuestsions(){
    const navigate = useNavigate();
    const [questions, setQuestions] = useState({});
    useEffect(() => {
        (async () =>{
        try{
            const response = await axios.get('https://pkeqmi2fj8.execute-api.us-east-1.amazonaws.com/dev/tt-list-questions-api');
            setQuestions(response.data)
        }
        catch{
            console.log("Error while retrieving")
        }
    })();
    }, [])

    const handleClick = async (id) => {
        console.log(id)
        try{
            const body = {
                'id': id
            }
            const response = await axios.post('https://pkeqmi2fj8.execute-api.us-east-1.amazonaws.com/dev/tt-delete-question-api', body);
            console.log("Question Successfullly Deleted!")
        }
        catch{
            console.log("Error while retrieving")
        }
    }
    return(
        <div className="centered-container" style={{backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150vh', textAlign: 'center'}}>
        <Card style={{ width: '1000px' , height: '1200px', border: '1px solid black', backgroundColor: '#1976d2', color: 'white'}}>
            <CardContent>
                <h1>QUESTIONS LIST</h1>
                <Divider style={{ margin: '16px 0', backgroundColor: 'white'}}/>
                <div>
                {Object.keys(questions).map((key) => {
                    const obj = questions[key];
                    return (
                    <div key={key}>
                        <p><b>Question: {obj.Question} </b> </p>
                        <Button variant="contained" style={{backgroundColor: 'white', color: 'black', border: '1px solid black'}} fullWidth type="submit" onClick={e => navigate('/updatequestion', {state: {'id': obj.QuestionID}})}>Update Question</Button>
                        <br />
                        <Button defaultValue={obj.QuestionID} variant="contained" style={{backgroundColor: 'white', color: 'black', border: '1px solid black'}} fullWidth type="submit" onClick={() => handleClick(obj.QuestionID)}>Delete Question</Button>
                        <p>Answer: {obj.Answer}</p>
                        <p>Category: {obj.Category}</p>
                        <p>Difficulty Level: {obj.DifficultyLevel}</p>
                        <p>Option 1: {obj.Option1}</p>
                        <p>Option 2: {obj.Option2}</p>
                        <p>Option 3: {obj.Option3}</p>
                        <Divider style={{ margin: '16px 0', backgroundColor: 'white'}}/>
                    </div>
                    );
                })}
                </div>
            </CardContent>
        </Card>
    </div>
    );
}

export default ListQuestsions;