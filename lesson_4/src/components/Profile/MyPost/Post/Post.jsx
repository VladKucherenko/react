import React from 'react';
import classes from './Post.module.css';

const Post = (props) => {
  return (

      <div className={classes.item}>
        <span>{props.message}</span>
        <div>
          <span>
            {props.like} Likes
          </span>
        </div>
      </div>
       
  );
}

export default Post;