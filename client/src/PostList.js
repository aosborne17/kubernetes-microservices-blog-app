import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

const PostList = () => {
  const [posts, setPosts] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    // const response = await axios.get('http://localhost:4000/posts');

    const response = await axios.get('http://posts.com/posts');
    console.log(response.data);
    setPosts(response.data);
  };

  const arrayPosts = Object.values(posts);
  console.log(arrayPosts);

  // object.values gets the values in an object and puts it in an array
  // so we will have an array of objects, these objects will contain the id and title property
  const renderedPosts = Object.values(posts).map((post) => (
    <div
      key={post.id}
      className='card'
      style={{ width: '30%', marginBottom: '20px' }}
    >
      <div className='card-body'>
        <h3>{post.title}</h3>
        <CommentList comments={post.comments} />
        {/* for each created post we pass in the id to the comments create form
        so when a user sends a comment under this post we can tell our server to attach the comment to said post */}
        <CommentCreate postId={post.id} />
      </div>
    </div>
  ));

  // console.log(posts);
  return (
    <div className='d-flex flex-row flex-wrap justify-content-between'>
      {renderedPosts}
    </div>
  );
};

export default PostList;
