const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// our event bus datastore
const events = [];

// we now need to configure this endpoint to listen to incoming events

// whenever a post request comes here, we simply send it to all the services in our app
app.post('/events', (req, res) => {
  // we dont care whats in the event, it could be json, string whatever
  // we just simply take that body event and fling it off
  const event = req.body;

  // whenever we receive an event, we will store it
  events.push(event);

  // send info to posts service
  axios.post('http://posts-clusterip-srv:4000/events', event).catch((err) => {
    console.log(err.message);
  });
  // send info to comments service
  axios.post('http://comments-srv:4001/events', event).catch((err) => {
    console.log(err.message);
  });
  // send info to the query service
  axios.post('http://query-srv:4002/events', event).catch((err) => {
    console.log(err.message);
  });
  // send info to the moderation service
  axios.post('http://moderation-srv:4003/events', event).catch((err) => {
    console.log(err.message);
  });
  res.send({ status: 'OK' });
});

// when we do a get request to the event, it will respond with ALL the events ever created
app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log('Event bus is listening on 4005');
});
