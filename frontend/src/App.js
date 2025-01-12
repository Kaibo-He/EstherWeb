import {useRoutes} from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import routes from './routes';

const App = function() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const element = useRoutes(routes(isAuthenticated, setIsAuthenticated));

  useEffect(() => {
    // 检查 localStorage 中是否保存了登录状态
    const savedAuthState = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(savedAuthState);
  }, []);

  return (
    <div className="App">
      {element}
    </div>
  );
}

export default App;