// WebSocketManager.js
import { useState, useEffect } from 'react';

const WebSocketManager = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket('wss://q7nokrzbta.execute-api.us-east-1.amazonaws.com/production');

    newSocket.onopen = () => {
      console.log('WebSocket connection established.');
      setSocket(newSocket);
    };

    newSocket.onmessage = (event) => {
      console.log('Received message from server:', event.data);
    };

    newSocket.onclose = () => {
      console.log('WebSocket connection closed.');
      // Optional: Implement reconnection logic here if needed.
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const sendMessage = (message) => {
    if (socket) {
      socket.send(message);
    } else {
      console.log('WebSocket connection not yet established. Message not sent.');
    }
  };

  return { sendMessage };
};

export default WebSocketManager;
