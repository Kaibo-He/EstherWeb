import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import '../../style.css';

const AdminLogin = ({ setIsAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '登录失败');
      }

      // 保存 Token
      localStorage.setItem('token', data.token);
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      navigate('/admin/general');
    } catch (err) {
      setError(err.message);
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