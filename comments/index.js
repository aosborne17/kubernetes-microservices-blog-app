const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');
const { stat } = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// this is how our object will be structured

// {
//   gfddrf: [
//     { id: 'fdfssdfds', content: 'Love the post' },
//     { id: '33df4gf', content: 'Wow, so informative!' },
//   ],
//   eregrf4: [
//     { id: 'fjookg', content: 'Love the post' },
//     { id: 'fvyjjy', content: 'Nice!' },
//   ],
// };

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  // console.log(req.params.id);
  console.log(commentsByPostId[req.params.id] || 'No comments for this post');
  // so we attempt to access the property with the id we just pass in to get the comments
  // if its undefined, we have no comments so return an empty array
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');

  const { content } = req.body;

  // first check if we alrady have a comment on this particular post
  // to do this we can try and access the object
  // if we have no comments associated with this post we will get undefined, therefore we give it an empty array
  const comments = commentsByPostId[req.params.id] || [];

  // now we can push in our new comment into this array of comments
  // passing in the id of the comment and its content
  comments.push({ id: commentId, content, status: 'pending' });

  // we can then put the array of comments back into the specific post id where the comment was created
  commentsByPostId[req.params.id] = comments;

  // so whenever we create a comment on our backend we will also send a request to our event bus
  // we will give the type of commentCreated so it is obvious what this data will contain
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      status: 'pending',
      postId: req.params.id,
    },
  });

  res.status(201).send(comments);
});

// this route will listen to any events sent from the event bus
// the data will be inside the req body

// note that even though this is the comments service, it will also receive a req when a post is created e.g.
// this is because the event bus sends a event to all the services, these services can then check the type
// and where necessary, do something with that data
app.post('/events', async (req, res) => {
  console.log(req.body.type);
  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    // we will update the comment in our data structure based on the moderation
    const { id, postId, content, status } = data;

    // we find the comments associated with the postId we passed in
    const comments = commentsByPostId[postId];

    // we then iterate throguh this array of comments to find the comment we have moderated
    const comment = comments.find((comment) => comment.id === id);

    // setting the status property of our comment equal to the new status passed in from the moderation service
    // this will update our data structure with the new details
    comment.status = status;

    // we will then emit a comment updated event so our other services can update their comment status also

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        content,
        postId,
        status,
      },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log('listening on 4001');
});
