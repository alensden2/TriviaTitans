import { Card, CardContent, Divider, FormControl, Stack, TextField, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import LexLayout from "./lexLayout";

function UpdateGame(){
    const [gamename, setGameName] = useState('')
    const [category, setCategory] = useState('')
    const [difficultylevel, setDifficultyLevel] = useState('')
    const [totaltime, setTotalTime] = useState('')
    const [timeperquestion, setTimePerQuestion] = useState('')
    const [date, setDate] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate();
    const location = useLocation();

    const id = location.state.id;
    const inputStyles = {
        color: 'white',
        borderColor: 'white'
    }

    useEffect(() => {
        (async () =>{
        try{
            console.log(id)
            const response = await axios.post('https://zxjj4jwj50.execute-api.us-east-1.amazonaws.com/dev/get-game', {
                'id': id
            });
            const data = response.data
            setGameName(data.GameName)
            setDifficultyLevel(data.DifficultyLevel)
            setTotalTime(data.TotalTime)
            setTimePerQuestion(data.TimePerQuestion)
            setDate(data.Date)
            setCategory(data.Category)
            // console.log(typeof(response.data))
            // setQuestions(response.data)
        }
        catch{
            console.log("Error while retrieving")
        }
    })();
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (gamename === ''){
            setError("Invalid Game Name")
        }
        else if(category === ''){
            setError("Invalid Category")
        }
        else if(difficultylevel === ''){
            setError("Invalid Difficulty Level")
        }
        else if(totaltime === ''){
            setError("Invalid Total Tim Field")
        }
        else if(timeperquestion === ''){
            setError("Invalid Time per Question Field")
        }
        else if(date === ''){
            setError("Invalid Date")
        }
        else{
            const body = {
                'GameID': id,
                'attributes':{
                    "GameName": gamename,
                    "Category": category,
                    "DifficultyLevel": difficultylevel,
                    "TotalTime": totaltime,
                    "TimePerQuestion": timeperquestion,
                    "Date": date
                }
            }
            try{
                const response = await axios.post('https://zxjj4jwj50.execute-api.us-east-1.amazonaws.com/dev/update-game', body);
                console.log("Game Successfully Updated!")
            }
            catch{
                console.log("Error while retrieving")
            }
            navigate('/listgames')
        }
        
    }
    return(
        <div className="centered-container" style={{backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center'}}>
        <Card style={{ width: '1000px' , height: '630px', border: '1px solid black', backgroundColor: '#1976d2', color: 'white'}}>
            <CardContent>
                <h1>CREATE GAME</h1>
                <Divider style={{ margin: '16px 0', backgroundColor: 'white'}}/>
                <br />
                <br />
                <FormControl>
                    <Stack spacing={2} direction="row" sx={{marginBottom: 4}}>
                        <TextField value={gamename} id="gamename" InputLabelProps={{style: inputStyles}} InputProps={{style: inputStyles}} label="GameName" variant="outlined" fullWidth required onChange={e => setGameName(e.target.value)}  />
                        <TextField value={category} id="category" InputLabelProps={{style: inputStyles}} InputProps={{style: inputStyles}} label="Category" variant="outlined" fullWidth required onChange={e => setCategory(e.target.value)}  />
                        <TextField value={difficultylevel} id="difficultylevel" InputLabelProps={{style: inputStyles}} InputProps={{style: inputStyles}} label="Difficulty Level" variant="outlined" fullWidth required onChange={e => setDifficultyLevel(e.target.value)}  />
                    </Stack>
                    <Stack spacing={2} direction="row" sx={{marginBottom: 4}}>
                        <TextField value={totaltime} id="totaltime" InputLabelProps={{style: inputStyles}} InputProps={{style: inputStyles}} label="Total Time" type="number" variant="outlined" fullWidth required onChange={e => setTotalTime(e.target.value)}  />
                        <TextField value={timeperquestion} id="timeperquestion" InputLabelProps={{style: inputStyles}} InputProps={{style: inputStyles}} label="Time Per Question" type="number" variant="outlined" fullWidth required onChange={e => setTimePerQuestion(e.target.value)}  />
                        <TextField value={date} id="date" type='date' variant="outlined" InputLabelProps={{style: inputStyles}} InputProps={{style: inputStyles}} fullWidth required onChange={e => setDate(e.target.value)}  />
                    </Stack>
                    <br />
                    <Button variant="contained" style={{backgroundColor: 'white', color: 'black', border: '1px solid black'}} fullWidth type="submit" onClick={handleSubmit}>Update Game</Button>
                    <br />
                    {error && <div style={{color: 'red', backgroundColor: 'white'}}>{error}</div>}
                </FormControl>
            </CardContent>
        </Card>
        <LexLayout />
    </div>
    );
}

export default UpdateGame;