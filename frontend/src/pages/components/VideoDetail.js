import React from 'react';
import config from '../../config';
import '../../style.css'; // 样式文件

const VideoDetail = ({ content }) => {
  const conSrc = `${config.backendUrl}${content}`;
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <video controls className='detail-video' onContextMenu={handleContextMenu}>
      <source src={conSrc} type="video/mp4" />
    </video>
  );
  };
  
  export default VideoDetail;