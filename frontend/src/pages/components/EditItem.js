import React from 'react';
import '../../style.css'; // 样式文件

const EditItem = ({ text, editClick, deleteClick}) => {
  return (
    <div className="edit-container">
        <div className='edit-text'>{text}</div>
        <div className='edit-button'><button className="small-button" onClick={editClick}>修改</button>
        <button className="small-button" onClick={deleteClick}>删除</button></div>
    </div>
  );
};

export default EditItem;