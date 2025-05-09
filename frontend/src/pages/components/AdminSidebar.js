import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../admin/admin.css';

const AdminSidebar = ({setIsAuthenticated}) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    setIsAuthenticated(false); // 清除全局状态
    localStorage.removeItem('isAuthenticated'); // 移除认证标志
    localStorage.removeItem('token'); // 确保移除 `token`
    navigate('/admin'); // 跳转到登录页面
  };

  return (
    <div className="admin-sidebar">
      <h2 className="sidebar-title">后台管理</h2>
      <nav className="sidebar-nav">
        <NavLink
          to="/admin/general"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          通用设置
        </NavLink>
        <NavLink
          to="/admin/work"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          作品管理
        </NavLink>
        <NavLink
          to="/admin/chapter"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          章节管理
        </NavLink>
        <NavLink
          to="/admin/character"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          角色管理
        </NavLink>
        <button onClick={handleLogout}>退出登录</button>
      </nav>
    </div>
  );
};

export default AdminSidebar;
