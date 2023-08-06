import { Box, Button } from '@mui/material';
import React from 'react';
import Navbar from "../components/navbar";
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const navigate = useNavigate();
    const handleCreateGame = (event) => {
        navigate("/creategame")
    }
    const handleCreateQuestion = (event) => {
        navigate("/addquestion")
    }
    const handleListQuestions = (event) => {
        navigate("/listquestions")
    }
    const handleListGames = (event) => {
        navigate("/listgames")
    }
    const handleLooker = (event) => {
        navigate("/lookerstudio")
    }
    const handleLobby = (event) => {
        navigate("/lobby")
    }
  return (
    <Box>
        <Box sx={{ marginBottom: "-2rem" }}>
          <Navbar />
        </Box>
        <Box sx={{alignSelf: 'center'}}>
            <Button sx={{border: '1px solid black'}} onClick={handleCreateGame}>Create Game</Button>
            <Button sx={{border: '1px solid black'}}onClick={handleCreateQuestion}>Add Question</Button>
            <Button sx={{border: '1px solid black'}} onClick={handleListQuestions}>List Questions</Button>
            <Button sx={{border: '1px solid black'}}onClick={handleListGames}>List Games</Button>
            <Button sx={{border: '1px solid black'}}onClick={handleLooker}>Looker Studio</Button>
            <Button sx={{border: '1px solid black'}}onClick={handleLobby}>Lobby</Button>
        </Box>
    </Box>
  );
};

export default Admin;