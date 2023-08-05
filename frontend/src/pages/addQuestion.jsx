import { Card, CardContent, Divider, FormControl, Stack, TextField, Button } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LexLayout from "./lexLayout";

function AddQuestion(){
    const [question, setQuestion] = useState('')
    const [category, setCategory] = useState('')
    const [difficultylevel, setDifficultyLevel] = useState('')
    const [option1, setOption1] = useState('')
    const [option2, setOption2] = useState('')
    const [option3, setOption3] = useState('')
    const [answer, setAnswer] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate();
    const inputStyles = {
        color: 'white',
        borderColor: 'white'
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (question === ''){
            setError("Invalid Question")
        }
        else if(category === ''){
            setError("Invalid Category")
        }
        else if(difficultylevel === ''){
            setError("Invalid Difficulty Level")
        }
        else if(option1 === ''){
            setError("Invalid Option1 Field")
        }
        else if(option2 === ''){
            setError("Invalid Option2 Field")
        }
        else if(option3 === ''){
            setError("Invalid Option3 Field")
        }
        else if(answer === ''){
            setError("Invalid Answer Field")
        }
        else{
            const body = {
                "Question": question,
                "Category": category,
                "DifficultyLevel": difficultylevel,
                "Option1": option1,
                "Option2": option2,
                "Option3": option3,
                "Answer": answer
            }
            try{
                const response = await axios.post('https://zxjj4jwj50.execute-api.us-east-1.amazonaws.com/dev/add-question', body);
                console.log("Successfully Added!")
                navigate('/listquestions')
            }
            catch{
                console.log("Error while retrieving")
                navigate('/addquestion')
            }
            
        }
        
    }
    return(
        <div className="centered-container" style={{backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150vh', textAlign: 'center'}}>
        <Card style={{ width: '1000px' , height: '630px', border: '1px solid black', backgroundColor: '#1976d2', color: 'white'}}>
            <CardContent>
                <h1>ADD QUESTION</h1>
                <Divider style={{ margin: '16px 0', backgroundColor: 'white'}}/>
                <br />
                <br />
                <FormControl>
                    <Stack spacing={2} direction="row" sx={{marginBottom: 4}}>
                        <TextField id="question" InputLabelProps={{style: inputStyles}} InputProps={{style: inputStyles}} label="Question" variant="outlined" fullWidth required onChange={e => setQuestion(e.target.value)}  />
                        <TextField id="category" InputLabelProps={{style: inputStyles}} InputProps={{style: inputStyles}} label="Category" variant="outlined" fullWidth required onChange={e => setCategory(e.target.value)}  />
                        <TextField id="difficultylevel" InputLabelProps={{style: inputStyles}} InputProps={{style: inputStyles}} label="Difficulty Level" variant="outlined" fullWidth required onChange={e => setDifficultyLevel(e.target.value)}  />
                    </Stack>
                    <Stack spacing={2} direction="row" sx={{marginBottom: 4}}>
                        <TextField id="option1" InputLabelProps={{style: inputStyles}} InputProps={{style: inputStyles}} label="Option 1" variant="outlined" fullWidth required onChange={e => setOption1(e.target.value)}  />
                        <TextField id="option2" InputLabelProps={{style: inputStyles}} InputProps={{style: inputStyles}} label="Option 2" variant="outlined" fullWidth required onChange={e => setOption2(e.target.value)}  />
                        <TextField id="option3" variant="outlined" InputLabelProps={{style: inputStyles}} InputProps={{style: inputStyles}} label="Option 3" fullWidth required onChange={e => setOption3(e.target.value)}  />
                        <TextField id="answer" variant="outlined" InputLabelProps={{style: inputStyles}} InputProps={{style: inputStyles}} label="Answer" fullWidth required onChange={e => setAnswer(e.target.value)}  />
                    </Stack>
                    <br />
                    <Button variant="contained" style={{backgroundColor: 'white', color: 'black', border: '1px solid black'}} fullWidth type="submit" onClick={handleSubmit}>Add Question</Button>
                    <br />
                    {error && <div style={{color: 'red', backgroundColor: 'white'}}>{error}</div>}
                </FormControl>
            </CardContent>
        </Card>
        <LexLayout />
    </div>
    );
}

export default AddQuestion;