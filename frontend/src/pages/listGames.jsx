import { Card, CardContent, Divider, FormControl, Stack, TextField, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LexLayout from "./lexLayout";

function ListGames(){
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    useEffect(() => {
        (async () =>{
        try{
            const response = await axios.get('https://pkeqmi2fj8.execute-api.us-east-1.amazonaws.com/dev/tt-list-games-api');
            setGames(response.data)
        }
        catch{
            console.log("Error while retrieving")
        }
    })();
    }, [])

    return(
        <div className="centered-container" style={{backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200vh', textAlign: 'center'}}>
        <Card style={{ width: '1000px' , height: '1450px', border: '1px solid black', backgroundColor: '#1976d2', color: 'white'}}>
            <CardContent>
                <h1>QUESTIONS LIST</h1>
                <Divider style={{ margin: '16px 0', backgroundColor: 'white'}}/>
                <div>
                {games.map((obj, index) => (
                    <div key={index}>
                        <p><b>Game Name: {obj.GameName} </b> </p>
                        <Button variant="contained" style={{backgroundColor: 'white', color: 'black', border: '1px solid black'}} fullWidth type="submit" onClick={e => navigate('/updategame', {state: {'id': obj.GameID}})}>Update Question</Button>
                        <p>Date: {obj.Answer}</p>
                        <p>Category: {obj.Category}</p>
                        <p>Difficulty Level: {obj.DifficultyLevel}</p>
                        <p>Total Time: {obj.TotalTime}</p>
                        <p>Time Per Question: {obj.TimePerQuestion}</p>
                        {Object.keys(obj.Questions).length > 0 && (
                            <div>
                            <h3>Questions:</h3>
                            {Object.keys(obj.Questions).map((questionID) => {
                                const question = obj.Questions[questionID];
                                return (
                                <div key={questionID}>
                                    <h4>Question ID: {questionID}</h4>
                                    <p>Question: {question.Question}</p>
                                    <p>Answer: {question.Answer}</p>
                                    <p>Option 1: {question.Option1}</p>
                                    <p>Option 2: {question.Option2}</p>
                                    <p>Option 3: {question.Option3}</p>
                                </div>
                                );
                            })}
                            </div>
                        )}
                        <Divider style={{ margin: '16px 0', backgroundColor: 'white'}}/>
                    </div>
                ))}
                </div>
            </CardContent>
        </Card>
        <LexLayout />
    </div>
    );
}

export default ListGames;