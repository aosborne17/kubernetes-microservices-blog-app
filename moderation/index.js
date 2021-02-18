const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// when this receives the commentCreaed event
// it will then moderate the comment and emit the CommentModerated event

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  // when a comment has been created, this service will moderate it
  if (type === 'CommentCreated') {
    // so we are checking if the comments content contains the bad word 'orange in it
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    await axios.post('http://event-bus-srv:4005/events', {
      // we then pass a comment moderated event to the event bus
      type: 'CommentModerated',
      data: {
        // all the other comment data has not changed so we simply pass those in
        id: data.id,
        postId: data.postId,
        content: data.content,
        status: status, // pass in the new status of our comment, whether approved or rejected
      },
    });
  }

  res.send({});
});

app.listen(4003, () => {
  console.log('Listening on 4003');
});
