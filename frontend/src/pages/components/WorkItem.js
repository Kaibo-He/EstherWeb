import React from 'react';
import '../../style.css'; // 样式文件

const WorkItem = ({ leftImage, rightImage, leftText, rightText, onLeftClick, onRightClick}) => {
  return (
    <div className="work-container">
      <button
        className="left-trapezoid"
        style={{
          backgroundImage: `url(${leftImage})`,
        }}
        data-text = {leftText}
        onClick={onLeftClick}
      >
        
      </button>
      <button
        className="right-trapezoid"
        style={{
          backgroundImage: `url(${rightImage})`,
        }}
        data-text = {rightText}
        onClick={onRightClick}
      >
      </button>
    </div>
  );
};

export default WorkItem;
