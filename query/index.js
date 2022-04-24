const express = require('express');
const parser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(parser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  } else if (type === 'CommentCreated') {
    const { id, comment, postId, status } = data;
    posts[postId].comments.push({ id, comment, status });
  }
  res.send({});
});

app.listen(4002, () => {
  console.log("Listening on 4002");
});