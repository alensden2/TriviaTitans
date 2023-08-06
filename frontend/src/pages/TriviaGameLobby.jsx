// TriviaGameLobby.js
import React, { useState, useEffect } from 'react';
import TriviaGameEntry from '../components/TriviaGameEntry';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TriviaGameLobby = () => {
  const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [timeFrameFilter, setTimeFrameFilter] = useState('');
  const [teamDetails, setTeamDetails] = useState(null);

  
    useEffect(() => {
        // Fetch trivia games from the backend API
        const fetchTriviaGames = async () => {
          try {
            const response = await Axios.get('https://zxjj4jwj50.execute-api.us-east-1.amazonaws.com/dev/fetch-trivia-game');
            setGames(response.data);
          } catch (error) {
            console.error('Error fetching trivia games:', error);
          }
        };
    
        fetchTriviaGames();
      }, []);
  
    
 // Method to handle the "Join Lobby" button click
 const handleJoinLobby = async (game_id) => {
    console.log('Joining Lobby for Game ID:', game_id);

    try {
      // Make the API call to fetch the team name and user details based on the UID
      const uid = '7ao5CmwUj7OvQPA8UEBVkyFk4up1'; // Replace 'your_uid_here' with the actual UID
      const response = await Axios.post('https://kt1v6etemi.execute-api.us-east-1.amazonaws.com/Test/get-item-by-uid', {
        uid: uid,
      });
      // Update the state with the team name and user details
      setTeamDetails(response.data);
      console.log(teamDetails)
      
    } catch (error) {
      console.error('Error fetching team name and user details:', error);
    }
    navigate("/quizes")
  };

  // Method to apply filters and update the list of filtered games
  useEffect(() => {
    let filteredResults = games;
    if (categoryFilter) {
      filteredResults = filteredResults.filter((game) => game.Category === categoryFilter);
    }
    if (difficultyFilter) {
      filteredResults = filteredResults.filter((game) => game.DifficultyLevel === difficultyFilter);
    }
    if (timeFrameFilter) {
      // Implement time frame filtering logic here based on game.TimeRemaining
      filteredResults = filteredResults.filter((game) => game.TotalTime <= timeFrameFilter);
    }

    setFilteredGames(filteredResults);
  }, [games, categoryFilter, difficultyFilter, timeFrameFilter]);

    console.log(games)

  return (
    <div>
      <h2>Available Trivia Game Lobbies: </h2>
      <div>
        <label>Category:</label>
        <input type="text" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} />
      </div>
      <div>
        <label>Difficulty Level:</label>
        <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
          <option value="easy">easy</option>
          <option value="Medium">Medium</option>
        </select>
      </div>
      {filteredGames.map((game) => (
        <div key={game.GameID}>
        <TriviaGameEntry
          key={game.GameID}
          category={game.Category}
          difficulty={game.DifficultyLevel}
          timeRemaining={game.TotalTime}
          description={game.Description}
          date = {game.Date}
        />
        <button onClick={() => handleJoinLobby(game.GameID)}>Join Lobby</button>
        </div>
      ))}
    </div>
  );
};

export default TriviaGameLobby;
