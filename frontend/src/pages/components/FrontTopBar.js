import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from './LanguageToggle';
import './FrontTopBar.css';

const FrontTopBar = ({ isEnglish, showBack, backUrl }) => {
    const navigate = useNavigate();
    const handleMusic = () => {
        
    }
    const handleNavigate = (url) => {
        navigate(url);
    }

  return (
    <div className='front-topBar'>
        <div className="image-button" onClick={() => navigate('/')}>
          <img src="/assest/image/home.png" alt="Button" />
        </div>
        {showBack && <div className="image-button" onClick={handleMusic}>
          <img src="/assest/image/back.png" alt="Button" />
        </div>}
        <div className="image-button" onClick={handleMusic}>
          <img src="/assest/image/music.png" alt="Button" />
        </div>
        <LanguageToggle isEnglish={isEnglish} />
      </div>
  );
};

export default FrontTopBar;
