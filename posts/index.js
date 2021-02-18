const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  // here we are inserting a new object into our posts object
  posts[id] = {
    id,
    title,
  };

  // now that the post has been created, we can dispatch an event to the event bus
  // we'll give it a type, describing the event and then the data of the created post
  await axios.post('http://event-bus-srv:4005/events', {
    // --> kubernetes implementation, we are changing the url to point to our k8 pods
    type: 'PostCreated',
    data: {
      id,
      title,
    },
  });

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log(req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log('v1000');
  console.log('listening on 4000');
});
