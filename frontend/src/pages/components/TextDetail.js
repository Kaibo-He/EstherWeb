import React from 'react';
import '../../style.css'; // 样式文件

const TextDetail = ({ content }) => {
    return <pre className='detail-text'>{content}</pre>;
};
  
export default TextDetail;