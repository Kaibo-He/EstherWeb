import React, { useRef, useState, useEffect } from 'react';
import config from '../../config';
import './admin.css';

const AdminGeneral = () => {
  const token = localStorage.getItem('token');
  const [newMusicFile, setNewMusicFile] = useState(null); // 上传的新音乐文件
  const [audioUrl, setAudioUrl] = useState(''); // 当前背景音乐的 URL
  const audioRef = useRef(null);

  // 获取最新音乐 URL（防止缓存）
  const updateAudioUrl = () => {
    setAudioUrl(`${config.backendUrl}/uploads/music.mp3?t=${Date.now()}`);
  };

  useEffect(() => {
    updateAudioUrl();
    /* setCurrentTitle(); */
  }, []);

  const handleMusicUpload = async () => {
    if (!newMusicFile) {
      alert('请选择要上传的音乐文件');
      return;
    }
    // 创建 FormData 对象
    const formData = new FormData();
    formData.append('file', newMusicFile); // 将文件添加到 FormData
    formData.append('name', 'music'); // 添加额外的参数
    formData.append('path', 'uploads'); // 指定上传路径
    try {
      const response = await fetch(`${config.backendUrl}/api/upload`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '上传失败');
      }

      // 重新加载音频
      updateAudioUrl();

      if (audioRef.current) {
        audioRef.current.load();
      }

      alert('音乐上传成功');
    } catch (error) {
      console.error('Failed to upload music:', error);
      alert('音乐上传失败');
    }
  };
  
  return (
    <div className='general-container'>
      {/* 当前音乐播放器 */}
      <h2 className='admin-h2'>当前音乐</h2>
      <div className='music-section'>      
        <audio className='audio-player' controls src={audioUrl} ref={audioRef} key={audioUrl}>
          您的浏览器不支持音频播放。
        </audio>
        <div className='music-upload'>
          <input
            type='file'
            accept='audio/*'
            onChange={(e) => setNewMusicFile(e.target.files[0])}
            className='file-input'
          />
          <button onClick={handleMusicUpload} className='small-button'>保存</button>
        </div>
      </div>
    </div>
  );
};

export default AdminGeneral;
