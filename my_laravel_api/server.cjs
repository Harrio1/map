const express = require('express');

const app = express();
const port = 3003;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, 'localhost', () => {
  console.log(`Server is running at http://localhost:${port}`);
});

