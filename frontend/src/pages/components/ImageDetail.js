import React from 'react';
import config from '../../config';
import '../../style.css'; // 样式文件

const ImageDetail = ({ content }) => {
    const conSrc = `${config.backendUrl}${content}`;

    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img 
          src={conSrc} 
          alt="Protected" 
          draggable={false} 
          className='detail-img' 
          style={{
            display: 'block',
            pointerEvents: 'none', // 禁止交互
            userSelect: 'none'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            background: 'transparent',
            zIndex: 10
          }}
          className='img-protector'
          onContextMenu={(e) => e.preventDefault()} 
          onTouchStart={(e) => e.preventDefault()} 
          onTouchEnd={(e) => e.preventDefault()} 
        />
    </div> 
    );
  };
  
export default ImageDetail;