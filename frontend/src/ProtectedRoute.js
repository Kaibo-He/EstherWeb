import React from 'react';
import { Navigate } from 'react-router-dom';

// 接收 `isAuthenticated` 和要渲染的子路由
const ProtectedRoute = ({ isAuthenticated, children }) => {
  const authState = isAuthenticated || localStorage.getItem('isAuthenticated') === 'true';

  if (!authState) {
    // 如果用户未登录，则重定向到登录页面
    return <Navigate to="/admin" replace />;
  }

  // 如果已登录，则渲染子路由
  return children;
};

export default ProtectedRoute;
