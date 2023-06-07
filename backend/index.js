// Import required modules
const http = require('http');

// Create a server
const server = http.createServer((req, res) => {
  // Set the response header
  res.setHeader('Content-Type', 'text/plain');

  // Write the response body
  res.write('Hello, World!');
  
  // End the response
  res.end();
});

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
