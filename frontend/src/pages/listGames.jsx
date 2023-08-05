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
            const response = await axios.get('https://zxjj4jwj50.execute-api.us-east-1.amazonaws.com/dev/fetch-games');
            setGames(response.data)
        }
        catch{
            console.log("Error while retrieving")
        }
    })();
    }, [])

    return(
        <div className="centered-container" style={{backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', maxHeight: '400vh', display: 'flex', flexDirection: 'column', overflow: 'auto', textAlign: 'center'}}>
        <Card style={{ width: '1000px' , height: '1450px', border: '1px solid black', backgroundColor: '#1976d2', color: 'white'}}>
            <CardContent>
                <h1>GAMES LIST</h1>
                <Divider style={{ margin: '16px 0', backgroundColor: 'white'}}/>
                <div>
                {games.map((obj, index) => (
                    <div key={index}>
                        <p><b>Game Name: {obj.GameName} </b> </p>
                        <Button variant="contained" style={{backgroundColor: 'white', color: 'black', border: '1px solid black'}} fullWidth type="submit" onClick={e => navigate('/updategame', {state: {'id': obj.GameID}})}>Update Games</Button>
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
                                    <hr />
                                    <p><b>Question: </b>{question.Question}</p>
                                    <p><b>Answer: </b>{question.Answer}</p>
                                    <p><b>Option 1: </b>{question.Option1}</p>
                                    <p><b>Option 2: </b>{question.Option2}</p>
                                    <p><b>Option 3: </b>{question.Option3}</p>
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