const express = require('express');
const parser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { randomBytes } = require('crypto');

const app = express();
app.use(parser.json());
app.use(cors());

// store data in memory
const posts = {};

app.get('/post', (req, res) => {
  res.send(posts);
});

app.post('/post', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;
  posts[id] = { id, title };
  await axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: posts[id]
  });
  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  console.log("Received event", type, data)
});

app.listen(4000, () => {
  console.log('Listening on port 4000');
});