const express = require('express');
const parser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { randomBytes } = require('crypto');

const app = express();
app.use(parser.json());
app.use(cors());

// store data in memory
const comments = {};

app.get('/post/:id/comment', (req, res) => {
  const { id } = req.params;
  res.send(comments[id] || []);
});

app.post('/post/:id/comment', async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  if (!comments[id]) {
    comments[id] = []
  }
  const commentId = randomBytes(4).toString('hex');
  comments[id].push({ id: commentId, comment, status: 'pending' });
  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: { id: commentId, comment, postId: id, status: 'pending' }
  });
  res.status(201).send(comments[id]);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  console.log("Received event", type, data)
});

app.listen(4001, () => {
  console.log('Listening on port 4001');
});