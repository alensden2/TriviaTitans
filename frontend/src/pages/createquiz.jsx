import { Box, Button } from "@mui/material";
import React, { useState, useEffect } from 'react';
import { Flex, VStack, Heading, CircularProgress, Input } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";


// ChatBox component
function ChatBox() {
    const [messages, setMessages] = useState([]);
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    
    // For Websocket messages
    const [socket, setSocket] = useState(null);
  
    useEffect(() => {
      // Connect to the WebSocket API when the component mounts
      const ws = new WebSocket('wss://qfygyqqu50.execute-api.us-east-1.amazonaws.com/production');
  
      ws.onopen = () => {
        console.log('WebSocket connection established.');
        setSocket(ws);
      };
  
      ws.onmessage = (event) => {
        // Handle received messages
        console.log(event);
        const message = JSON.parse(event.data);
        setReceivedMessages((prevMessages) => [...prevMessages, message]);
      };
  
      ws.onclose = () => {
        console.log('WebSocket connection closed.');
        setSocket(null);
      };
  
      return () => {
        // Clean up the WebSocket connection when the component unmounts
        if (ws) {
          ws.close();
        }
      };
    }, []);
  
    const handleSend = () => {
        if (inputValue.trim() !== '') {
            const newMessage = {
              id: messages.length + 1,
              text: inputValue.trim(),
              sender: 'You', // Replace 'You' with the sender's name or ID
              timestamp: new Date().toLocaleString(),
            };
      
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setInputValue('');
          }
      // Send a message to the server
      if (socket && inputValue.trim() !== '') {
        const team = 'team1'; // Replace with the selected team information
        socket.send(JSON.stringify({
          "action": "sendPrivate", 
          "message": inputValue
        }));
        setInputValue('');
      }
    };
  
    return (
        <VStack
        spacing="4"
        direction="column"
        align="start"
        color="black"
        mt="24px"
        p="20px"
        backgroundColor="white"
        w="100%"
        maxW="600px"
        borderRadius="8px"
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
      >
        {/* Chat messages */}
        {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.sender}:</strong> {message.text} ({message.timestamp})
        </div>
        ))}
  
        {/* Input area */}
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          variant="filled"
          size="md"
          maxW="100%"
        />
        <button onClick={handleSend}>Send</button>

      </VStack>
    );
  }

function Createquiz() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeoutId, setTimeoutId] = useState(null);
    const [teammessage, setInputValue] = useState('');
    const [score, setScore] = useState(0);
    const [remainingTime, setRemainingTime] = useState(30);
    const [timer, setTimer] = useState(null);

    useEffect(() => {
      fetchQuestions();
    }, []);

    useEffect(() => {
      if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
        resetTimeout();
      }
    }, [currentQuestionIndex, questions]);

    const resetTimeout = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
          }
      
          if (timer) {
            clearInterval(timer);
          }
      
          setRemainingTime(30);
      
          const newTimer = setInterval(() => {
            setRemainingTime((prevTime) => prevTime - 1);
          }, 1000);
      
          setTimeoutId(setTimeout(handleTimeout, 30000)); 
          setTimer(newTimer); 
    };

    const handleTimeout = () => {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        navigate("/leaderboard");
      }
    };

    const fetchQuestions = () => {
      const requestBody = {
        Category: "Science",
        DifficultyLevel: "Easy", 
        Team: "team1", 
        gameid: '1'
      };
  
      fetch('https://rh6tue7agh.execute-api.us-east-1.amazonaws.com/production/answerquestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setQuestions(data);
        })
        .catch((error) => console.error('Error fetching data:', error));
    };

    const handleGetStarted = async (selectedOption) => {
      
      if(selectedOption === currentQuestion.Answer){
        setScore((prevScore) => prevScore + 1);
      }

      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        console.log(score);
        try {
            const requestBody = {
              category: "mathematics", 
              Name: "team1",
              score,
              team: "team1", // Replace with the selected team information
            };
      
            // Replace 'YourLambdaFunctionName' with the actual name of your Lambda function
            //await API.post('https://rh6tue7agh.execute-api.us-east-1.amazonaws.com/production/savescore', '/path', {
              //body: requestBody,
        //});
        navigate("/leaderboard");
        } catch (error) {
        console.error('Error saving score:', error);
        // Handle any error while saving the score to DynamoDB
      }
      }
      resetTimeout();
    };


    const currentQuestion = questions[currentQuestionIndex];
    
    return (
        <Flex justifyContent="start" minH="90vh" backgroundColor="#000C66" w="100%" flexDirection="column" alignItems="center">
        {/* ... */}
        <VStack spacing="4" direction="column" align="start" color="white" mt="64px" mb="32px">
        <Heading mb="64px">{currentQuestion && currentQuestion.Question}</Heading>
        <Button
          onClick={() => handleGetStarted(currentQuestion && currentQuestion.Option1)}
          size="md"
          width="60%"
          maxW="480px"
          textAlign="center"
          alignSelf="center"
          style={{ background: "white", color: "black" }}
        >
          {currentQuestion && currentQuestion.Option1}
        </Button>
        <Button
          onClick={() => handleGetStarted(currentQuestion && currentQuestion.Option2)}
          size="md"
          width="60%"
          maxW="480px"
          textAlign="center"
          alignSelf="center"
          style={{ background: "white", color: "black" }}
        >
          {currentQuestion && currentQuestion.Option2}
        </Button>
        <Button
          onClick={() => handleGetStarted(currentQuestion && currentQuestion.Option3)}
          size="md"
          width="60%"
          maxW="480px"
          textAlign="center"
          alignSelf="center"
          style={{ background: "white", color: "black" }}
        >
          {currentQuestion && currentQuestion.Option3}
        </Button>
        <Button
          onClick={() => handleGetStarted(currentQuestion && currentQuestion.Answer)}
          size="md"
          width="60%"
          maxW="480px"
          textAlign="center"
          alignSelf="center"
          style={{ background: "white", color: "black" }}
        >
          {currentQuestion && currentQuestion.Answer}
        </Button>
      </VStack>
      <Box mt={8}>
        <Box fontSize="20px" color="white">
          Score: {score}
        </Box>
        <CircularProgress
          value={(remainingTime / 300) * 100} // Calculate the percentage of the timer
          color="blue.500"
          size={120}
          thickness={10}
        >
          <Box as="span" fontSize="20px" color="white">
            {remainingTime}s
          </Box>
        </CircularProgress>
      </Box>
      <ChatBox />
        {/* ... */}
      </Flex>
    );  
};

export default Createquiz;
