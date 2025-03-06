import React from 'react';
import config from '../../config';
import '../../style.css'; // 样式文件

const ImageDetail = ({ content }) => {
    const conSrc = `${config.backendUrl}${content}`;

    return <img 
      src={conSrc} 
      alt="Protected" 
      draggable={false} 
      className='detail-img' 
      onContextMenu={(e) => e.preventDefault()} 
      onTouchStart={(e) => e.preventDefault()}
      onTouchEnd={(e) => e.preventDefault()}
    />;
  };
  
export default ImageDetail;