import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import '../../style.css';

const AdminLogin = ({ setIsAuthenticated }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
      if (password === `${config.password}`) {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/admin/general');
      } else {
        setError('权限认证失败');
      }
    }

    return (
      <div className='login-container'>
        <h1 className='login-title'>后台管理系统</h1>
        <input 
        type='text'
        className='text-input' 
        id='password' 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder='请输入密码' 
        required
        />
        <p className="error-message">{error}</p>
        <button type='submit' className='big-button' onClick={handleLogin}>登录</button>
      </div>
    );
  };

export default AdminLogin;