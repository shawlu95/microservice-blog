import React from "react";

const CommentList = ({ comments }) => {
  const renderedComments = comments.map(comment => {
    var content;
    switch (comment.status) {
      case 'approved':
        content = comment.comment;
        break;
      case 'rejected':
        content = 'Removed by moderation';
        break;
      case 'pending':
        content = 'Awaiting moderation';
        break;
    }
    return <li key={comment.id}>{content}</li>
  })

  return <ul>{renderedComments}</ul>
};

export default CommentList;