const express = require('express');
const parser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(parser.json());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  console.log("Received event", type, data);
  if (type === 'CommentCreated') {
    const status = data.comment.include('fuck') ? 'rejected' : ' approved';
    await axios.post('http://localhost:4005/events', {
      type: 'CommentModerated',
      data: { ...data, status }
    });
  }
  res.send({});
});

app.listen(4003, () => {
  console.log('Listening on port 4003');
});