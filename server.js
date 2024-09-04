const express = require('express');
const path = require('path');

const app = express();

// Serve static assets from the build folder
app.use(express.static(path.join(__dirname, 'build')));

// Serve the index.html file for all requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving latest build: ${port}`);
});
