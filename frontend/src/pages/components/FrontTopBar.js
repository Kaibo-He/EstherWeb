import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from './LanguageToggle';
import config from '../../config';
import '../../style.css';

const FrontTopBar = ({ isEnglish, showBack, backUrl }) => {
    const navigate = useNavigate();
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5); // 音量初始值 (50%)
    const [showVolumeBar, setShowVolumeBar] = useState(false); // 是否显示音量条
    const [volumeBarPosition, setVolumeBarPosition] = useState({ x: 0, y: 0 }); // 音量条位置
    const musicSrc = `${config.backendUrl}/uploads/music.mp3`

    useEffect(() => {
      const playAudio = () => {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
        document.removeEventListener('click', playAudio); // 播放一次后移除监听器
      };
  
      document.addEventListener('click', playAudio);
  
      return () => {
        document.removeEventListener('click', playAudio);
      };
    }, []);

    const handleMusic = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause(); // 暂停音乐
        } else {
          audioRef.current.play(); // 播放音乐
        }
        setIsPlaying(!isPlaying); // 更新状态
      }
    }
    // 调整音量
    const handleVolumeChange = (event) => {
      if (audioRef.current) {
        const delta = event.deltaY > 0 ? -0.1 : 0.1; // 滚轮向上增加音量，向下减少音量
        let newVolume = Math.min(Math.max(volume + delta, 0), 1); // 限制音量范围在 0 到 1 之间
        audioRef.current.volume = newVolume; // 设置音频音量
        setVolume(newVolume); // 更新音量状态
      }
    };

    const disablePageScroll = useCallback((event) => {
      event.preventDefault(); // 阻止页面滚动
      console.log('Page scroll disabled');
    }, []);

    // 鼠标悬停时显示音量条并设置其位置
    const handleMouseEnter = (event) => {
      setShowVolumeBar(true); // 显示音量条
      setVolumeBarPosition({ x: event.clientX, y: event.clientY }); // 设置音量条位置
      window.addEventListener('wheel', disablePageScroll, { passive: false });
      console.log('Wheel event added');
    };
  
    // 鼠标移动时更新音量条位置
    const handleMouseMove = (event) => {
      if (showVolumeBar) {
        setVolumeBarPosition({ x: event.clientX, y: event.clientY }); // 更新位置
      }
    };
  
    // 鼠标离开时隐藏音量条
    const handleMouseLeave = () => {
      setShowVolumeBar(false); // 隐藏音量条
      window.removeEventListener('wheel', disablePageScroll, { passive: true });
      console.log('Wheel event removed');
    };    

  return (
    <div className='front-topBar'>
        <div className="image-button" onClick={() => {
          navigate('/')
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('chapter_')) { // 移除所有以 'chapter_' 开头的键
                localStorage.removeItem(key);
            }
          }
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('character_')) { // 移除所有以 'chapter_' 开头的键
                localStorage.removeItem(key);
            }
          }
          }}>
          <img src="/assest/image/home.png" alt="Button" />
        </div>
        {showBack && <div className="image-button" onClick={() => {
          navigate(backUrl)
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('chapter_')) { // 移除所有以 'chapter_' 开头的键
                localStorage.removeItem(key);
            }
          }
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('character_')) { // 移除所有以 'chapter_' 开头的键
                localStorage.removeItem(key);
            }
          }
          }}>
          <img src="/assest/image/back.png" alt="Button" />
        </div>}
        <div className="image-button" 
        onClick={handleMusic} 
        onWheel={handleVolumeChange} 
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}>
          <img src={`/assest/image/${isPlaying ? 'music.png' : 'nomusic.png'}`} alt="Button" volume={volume}/>
        </div>
        {showVolumeBar && (
        <div
          className="volume-bar"
          style={{
            position: 'absolute',
            left: `${volumeBarPosition.x}px`,
            top: `${volumeBarPosition.y + 10}px`, // 调整位置，让音量条稍微在鼠标下面
            width: '100px',
            height: '10px',
            border: '3px solid black',
            background: 'white',
            borderRadius: '5px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${volume * 100}%`, // 根据音量状态调整宽度
              height: '100%',
              background: 'black',
            }}
          />
        </div>
        )}        
        <audio ref={audioRef} src={musicSrc} loop />
        <LanguageToggle isEnglish={isEnglish} />
      </div>
  );
};

export default FrontTopBar;
