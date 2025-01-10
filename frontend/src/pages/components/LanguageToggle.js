import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../style.css'; // 导入样式

const LanguageToggle = () => {
  const location = useLocation(); // 获取当前路由
  const navigate = useNavigate();
  const [language, setLanguage] = useState('zh'); // 初始化为中文

  // 根据当前路由初始化语言状态
  useEffect(() => {
    if (location.pathname.endsWith('/en')) {
      setLanguage('en');
    } else {
      setLanguage('zh');
    }
  }, [location]);

  const toggleLanguage = () => {
    const currentPath = location.pathname
    const newLanguage = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLanguage);

    // 路由切换
    if (newLanguage === 'en') {
      navigate(currentPath === '/' ? `${currentPath}en` : `${currentPath}/en`);
    } else {
      navigate(currentPath.replace(/\/en$/, '') || '/');
    }
  };

  return (
    <div className="language-toggle" onClick={toggleLanguage}>
      <div className={`toggle-button ${language === 'en' ? 'english' : 'chinese'}`}>
        {language === 'en' ? 'EN' : '中'}
      </div>
    </div>
  );
};

export default LanguageToggle;
