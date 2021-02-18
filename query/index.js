const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  // so if the event type is a post created we will get the id and title out of the data
  if (type === 'PostCreated') {
    const { id, title } = data;
    // we will then create the post object in our data structure
    // passing in the id and title we are given, we also set the comments to an empty array
    posts[id] = { id: id, title: title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, status, postId } = data;

    // using the postId for said comment, we can find our post in the data structure
    const post = posts[postId];
    // we will then access the comments array and push the created comment into this array
    post.comments.push({ id: id, content: content, status });
  }

  // if our query service receives this, it will simply override the current comment with the updated version
  // it doesn't need to know what exactly had been changed
  if (type === 'CommentUpdated') {
    const { id, content, status, postId } = data;

    const comments = posts[postId].comments;

    const comment = comments.find((comment) => comment.id === id);

    // comment = data;
    comment.status = status;
    comment.content = content;
  }
};

// example
// all posts will be stored in an object
// for each object, the property will be the id
// within the object there will be the id (the same as the property) and the post title
// then there will be comments which will be an array
// this will contain an object for each comment, with the id and its content

// post = {
//   dfsfssd: {
//     id: 'dfsfssd',
//     title: 'My post',
//     comments: [{ id: 'gfdgdf', content: 'Nice Post!' }],
//   },
//   rtrero: {
//     id: 'rtrero',
//     title: 'Greate Site',
//     comments: [{ id: 'gfdgdf', content: 'Awesome!' }, { id: 'rtrefd', content: 'wooop!' } ],
//   },
// };

// having built the data structure with the posts and all associated comments
// when called, this route will return all this data
app.get('/posts', (req, res) => {
  res.send(posts);
});
// this will receive events from our event bus
// so this will want to get the PostCreated and CommentCreated types
// it will then use the data inside these events to buiild the data structure
app.post('/events', (req, res) => {
  const { type, data } = req.body;

  // here we are simply extracting the event handler code into a reusable function
  handleEvent(type, data);
  res.send({});
});

app.listen(4002, async () => {
  console.log('listening on 4002');

  // so the minute our server comes up and running, we can make a request to our event bus to get ALL the events
  const response = await axios.get('http://event-bus-srv:4005/events');

  // iterate through each event
  for (let event of response.data) {
    console.log('Processing event:', event.type);

    // we can then pass each event into our helper function which will populate the data structure accordingly
    handleEvent(event.type, event.data);
  }
});
