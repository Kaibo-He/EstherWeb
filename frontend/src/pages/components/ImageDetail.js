import React from 'react';
import config from '../../config';
import '../../style.css'; // 样式文件

const ImageDetail = ({ content }) => {
    const conSrc = `${config.backendUrl}${content}`;
    return <img src={conSrc} alt="Content" className='detail-img'/>;
  };
  
export default ImageDetail;