import React from 'react';
import config from '../../config';
import '../../style.css'; // 样式文件

const VideoDetail = ({ content }) => {
  const conSrc = `${config.backendUrl}${content}`;
  return (
    <video controls className='detail-video'>
      <source src={conSrc} type="video/mp4" />
    </video>
  );
  };
  
  export default VideoDetail;