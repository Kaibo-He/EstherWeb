import { Outlet, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import FrontLayout from './pages/FrontLayout';
import HomePage from './pages/HomePage';
import ChapterList from './pages/ChapterList';
import ChapterDetail from './pages/ChapterDetail';
import CharacterList from './pages/CharacterList';
import CharacterDetail from './pages/CharacterDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminGeneral from './pages/admin/AdminGeneral';
import AdminWorkList from './pages/admin/AdminWorkList';
import AdminChapterList from './pages/admin/AdminChapterList';
import AdminChapterEdit from './pages/admin/AdminChapterEdit';
import AdminCharacterList from './pages/admin/AdminCharacterList';
import AdminCharacterEdit from './pages/admin/AdminCharacterEdit';

const routes = (isAuthenticated, setIsAuthenticated) => [
  // 前台页面
  {
    path: '/',
    element: <FrontLayout />, // 使用 FrontLayout 包裹
    children: [
      { path: '', element: <HomePage /> },
      { path: 'chapter/:work_id', element: <ChapterList /> },
      { path: 'chapter/:work_id/:chapter_id', element: <ChapterDetail /> },
      { path: 'character/:work_id', element: <CharacterList /> },
      { path: 'character/:work_id/:character_id', element: <CharacterDetail /> },
      { path: 'en', element: <HomePage isEnglish={true} /> },
      { path: 'chapter/:work_id/en', element: <ChapterList isEnglish={true} /> },
      { path: 'chapter/:work_id/:chapter_id/en', element: <ChapterDetail isEnglish={true} /> },
      { path: 'character/:work_id/en', element: <CharacterList isEnglish={true} /> },
      { path: 'character/:work_id/:character_id/en', element: <CharacterDetail isEnglish={true} /> },
    ],
  },

  // 后台管理页面
  {
    path: '/admin',
    children: [
      // 登录页面（单独路由，不包裹在 AdminLayout 中）
      { path: '', element: <AdminLogin setIsAuthenticated={setIsAuthenticated} /> },
  
      // 受保护的路由，包裹在 AdminLayout 中
      {
        path: '',
        element: (
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AdminLayout setIsAuthenticated={setIsAuthenticated} />
          </ProtectedRoute>
        ),
        children: [
          { path: 'general', element: <AdminGeneral /> },
          { path: 'work', element: <AdminWorkList /> },
          { path: 'chapter', element: <AdminChapterList /> },
          { path: 'chapter/:work_id', element: <AdminChapterList /> },
          { path: 'chapter/:work_id/:chapter_id', element: <AdminChapterEdit /> },
          { path: 'character', element: <AdminCharacterList /> },
          { path: 'character/:work_id', element: <AdminCharacterList /> },
          { path: 'character/:work_id/:character_id', element: <AdminCharacterEdit /> },
        ],
      },
    ],
  },

  // 404 页面
  {
    path: '*',
    element: <Navigate to="/" replace />, // 所有未知路径重定向到首页
  },
];

export default routes;
