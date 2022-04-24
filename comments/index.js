const express = require('express');
const parser = require('body-parser');
const cors = require('cors');
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

app.post('/post/:id/comment', (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  if (!comments[id]) {
    comments[id] = []
  }
  const commentId = randomBytes(4).toString('hex');
  comments[id].push({ commentId, comment });
  res.status(201).send(comments[id]);
});

app.listen(4001, () => {
  console.log('Listening on port 4001');
});