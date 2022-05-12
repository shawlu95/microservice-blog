const express = require('express');
const parser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(parser.json());

const handleEvent = async (type, data) => {
  console.log("Received event", type, data);
  if (type === 'CommentCreated') {
    const status = data.comment.includes('fuck') ? 'rejected' : 'approved';
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentModerated',
      data: { ...data, status }
    });
  }
};

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({});
});

app.listen(4003, async () => {
  const res = await axios.get("http://event-bus-srv:4005/events");
  for (let event of res.data) {
    console.log("Processing event:", event.type);
    handleEvent(event.type, event.data);
  }
  console.log('Listening on port 4003');
});