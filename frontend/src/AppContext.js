import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [homeTitle, setHomepageTitle] = useState({
    title: '魔法风火轮',
    title_en: 'MAGIC CHARIOT'
  }); // 默认内容

  return (
    <AppContext.Provider value={{ homeTitle, setHomepageTitle }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
