// TriviaGameEntry.js
import React from 'react';

const TriviaGameEntry = ({ category, difficulty, timeRemaining, description, date }) => {
  return (
    <div className="game-entry">
      <h3>{category}</h3>
      <p>Difficulty: {difficulty}</p>
      <p>Time Remaining: {timeRemaining}</p>
      <p>Date: {date}</p>
      {/* Add a "Join" button here to join the game */}
    </div>
  );
};

export default TriviaGameEntry;
