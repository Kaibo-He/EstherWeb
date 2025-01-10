import React from 'react';import '../../style.css'; // 样式文件

const LinkDetail = ({ content, text }) => {
  return (
    <a href={content} target="_blank" rel="noopener noreferrer" className="detail-link">
      {text}
    </a>
  );
  };
  
  export default LinkDetail;