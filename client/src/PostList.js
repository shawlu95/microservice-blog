import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';

const PostList = () => {
  const [posts, setPosts] = useState({});

  const fetch = async () => {
    const res = await axios.get('http://localhost:4000/post');
    setPosts(res.data);
  };

  useEffect(() => {
    fetch();
  }, []);

  const renderedPosts = Object.values(posts).map(post => {
    return <div
      key={post.id}
      className='card'
      style={{ width: '30%', marginBottom: '20px' }}>
      <div className='card-body'>
        <h3>{post.title}</h3>
        <CommentCreate postId={post.id} />
      </div>
    </div>
  });

  return (
    <div className='d-flex flex-row flex-wrap justify-content-between'>
      {renderedPosts}
    </div>
  );
};

export default PostList;