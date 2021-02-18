import React, { useState } from 'react';
import axios from 'axios';

const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    // here we are sending the comment creation with the post id
    // in the params

    // ->> changing the url as we are pointing anything from posts.com to local host
    // await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
    await axios.post(`http://posts.com/posts/${postId}/comments`, {
      content,
    });
    setContent('');
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor='New Comment'></label>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className='form-control'
            type='text'
          />
        </div>
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  );
};

export default CommentCreate;
