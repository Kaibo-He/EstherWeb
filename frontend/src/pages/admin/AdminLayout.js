import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { Outlet} from 'react-router-dom';
import './admin.css';

const AdminLayout = ({ setIsAuthenticated }) => {
  return (
    <div className="admin-layout">
      {/* 侧边栏 */}
      <AdminSidebar setIsAuthenticated={setIsAuthenticated}/>

      {/* 主内容区域 */}
      <div className="admin-content">
        <Outlet/>
      </div>
    </div>
  );
};

export default AdminLayout;
