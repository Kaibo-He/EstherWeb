import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTitle } from '../../store';
import config from '../../config';
import './admin.css';

const AdminGeneral = () => {
  const [newMusicFile, setNewMusicFile] = useState(null); // 上传的新音乐文件
  const [audioUrl, setAudioUrl] = useState(''); // 当前背景音乐的 URL

  const [currentTitle, setCurrentTitle] = useState({}); // 当前标题
  const homeTitle = useSelector((state) => state.homeTitle);
  const dispatch = useDispatch();

  const [newTitle, setNewTitle] = useState(homeTitle.title); // 新标题
  const [newTitleEn, setNewTitleEn] = useState(homeTitle.title_en); // 新英文标题
  const [isEditingTitle, setIsEditingTitle] = useState(false); // 标题编辑状态
  
  const audioRef = useRef(null);

  useEffect(() => {
    setAudioUrl(`${config.backendUrl}/uploads/music.mp3?t=${Date.now()}`);
    setCurrentTitle();
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
        body: formData,
      });
      setAudioUrl(`${config.backendUrl}/uploads/music.mp3`);
      if (audioRef.current) {
        audioRef.current.load();
      }
      alert('音乐上传成功');
    } catch (error) {
      console.error('Failed to upload music:', error);
      alert('音乐上传失败');
    }
  };

  const handleTitleSave = async () => {
    if (!newTitle || !newTitleEn) {
        alert('标题不能为空');
        return;
    }
    // 更新 Redux 全局状态
    dispatch(updateTitle({ title: newTitle, title_en: newTitleEn }));
    setIsEditingTitle(false); // 退出编辑模式
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
