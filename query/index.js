const express = require('express');
const parser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(parser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  } else if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    posts[postId].comments.push({ id, content, status });
  } else if (type == 'CommentModerated') {
    const { id, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find(comment => comment.id === id);
    comment.status = status;
  }
};

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening on 4002");
  try {
    // pull all events from bus and catch up with the history
    // if an event has already been handled, handle again as if new
    const res = await axios.get("http://event-bus-srv:4005/events");
    for (let event of res.data) {
      console.log("Processing event:", event.type);
      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});