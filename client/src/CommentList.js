import React from 'react';

const CommentList = ({ comments }) => {
  // now that we get our comments attached to our posts when we call our query service
  // we no longer need to make an additional api call here, so we can remove the below code

  // const [comments, setComments] = useState([]);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const fetchData = async () => {
  //   const response = await axios.get(
  //     `http://localhost:4001/posts/${postId}/comments`
  //   );
  //   console.log(response, 'response');
  //   setComments(response.data);
  // };

  const renderedComments = comments.map((comment) => {
    let content;

    // if the comment has an approved status, we can just let it be
    if (comment.status === 'approved') {
      content = comment.content;
    }

    // if the status is rejected, then we render a rejected message
    if (comment.status === 'rejected') {
      content = 'Comment has been rejected';
    }

    // while the comment is still under moderation 'pending' we let the user know
    if (comment.status === 'pending') {
      content = 'Comment is awaiting moderation...';
    }

    return <li key={comment.id}>{content}</li>;
  });

  console.log(renderedComments);

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
