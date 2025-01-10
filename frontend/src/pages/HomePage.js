import React from 'react';
import FrontTopBar from './components/FrontTopBar';
import './components/FrontTopBar.css';


const HomePage = ({ isEnglish }) => {

  return (
    <div className='homeContainer'>
      <FrontTopBar showBack={false}/>
      <h1>{isEnglish ? 'Welcome to the Home Page' : '欢迎来到首页'}</h1>
      {/* 其他页面内容 */}
    </div>
  );
};

export default HomePage;