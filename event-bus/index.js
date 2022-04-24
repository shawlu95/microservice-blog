const express = require('express');
const parser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(parser.json());

const events = [];

app.get('/events', (req, res) => {
  res.send(events);
});

app.post('/events', (req, res) => {
  const event = req.body;
  console.log("Received event", event);
  events.push(event);
  axios.post('http://localhost:4000/events', event)
    .catch(err => console.log(err.message));
  axios.post('http://localhost:4001/events', event)
    .catch(err => console.log(err.message));
  axios.post('http://localhost:4002/events', event)
    .catch(err => console.log(err.message));
  axios.post('http://localhost:4003/events', event)
    .catch(err => console.log(err.message));
  res.send({ status: 'OK' });
});

app.listen(4005, () => {
  console.log("Listening on 4005");
});