import React from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import FrontTopBar from './components/FrontTopBar'; // 引入你希望始终显示的组件

const FrontLayout = ({ isEnglish = false }) => {
  const location = useLocation();
  const { work_id, chapter_id, character_id } = useParams();

  const isHome = (location.pathname === '/' || location.pathname === '/en');

  let backUrl = '/';
    
  if (location.pathname.includes('/chapter')) {
    if (chapter_id) {
      backUrl = `/chapter/${work_id}${location.pathname.includes('/en') ? '/en' : ''}`;
    } else {
      backUrl = `/${location.pathname.includes('/en') ? 'en' : ''}`;
    }
  } else if (location.pathname.includes('/character')) {
    if (character_id) {
      backUrl = `/character/${work_id}${location.pathname.includes('/en') ? '/en' : ''}`;
    } else {
      backUrl = `/${location.pathname.includes('/en') ? 'en' : ''}`;
    }
  }
      
  return (
    <div>
      {/* 你希望在所有非 admin 页面中显示的组件 */}
      <FrontTopBar isEnglish={isEnglish} showBack={!isHome} backUrl={backUrl}/>
      {/* 渲染具体的页面内容 */}
      <Outlet />
    </div>
  );
};

export default FrontLayout;
