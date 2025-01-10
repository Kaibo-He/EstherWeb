import React from 'react';
import '../../style.css'; // 样式文件

const ChaItem = ({ Image, Text, onClick }) => {
  return (
    <div className="cha-container">
      <button
        className="cha-button"
        style={{
          backgroundImage: `url(${Image})`,
        }}
        data-text = {Text}
        onClick={onClick}
      >
      </button>
    </div>
  );
};

export default ChaItem;
