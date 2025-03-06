import React from 'react';
import config from '../../config';
import '../../style.css'; // 样式文件

const ImageDetail = ({ content }) => {
    const conSrc = `${config.backendUrl}${content}`;
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    return <img src={conSrc} alt="Protected" draggable={false} className='detail-img' onContextMenu={handleContextMenu}/>;
  };
  
export default ImageDetail;