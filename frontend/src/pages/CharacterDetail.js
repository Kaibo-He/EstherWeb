import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import config from '../config';
import TextDetail from './components/TextDetail';
import ImageDetail from './components/ImageDetail';
import VideoDetail from './components/VideoDetail';
import LinkDetail from './components/LinkDetail';
import '../style.css';


const CharacterDetail = ({ isEnglish }) => {
    const { work_id, character_id } = useParams();
    const [workTitle, setWorkTitle] = useState('');
    const [workTitleEn, setWorkTitleEn] = useState('');
    const [chaTitle, setChaTitle] = useState('');
    const [chaTitleEn, setChaTitleEn] = useState('');
    const [detailList, setDetailList] = useState([]);
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(() => {
          // 尝试从 localStorage 获取当前页，如果没有则默认是 0
          const savedPage = localStorage.getItem(`character_${character_id}_page`);
          return savedPage ? Number(savedPage) : 0;
    });

    useEffect(() => {
        const fetchWorkDetails = async () => {
          try {
            const response = await fetch(`${config.backendUrl}/api/works/${work_id}`);
            const data = await response.json();
            setWorkTitle(data.title);
            setWorkTitleEn(data.title_en);
          } catch (error) {
            console.error('Failed to fetch work details:', error);
          }
        };
    
        fetchWorkDetails();
      }, []);

      useEffect(() => {
        const fetchChaDetails = async () => {
          try {
            const response = await fetch(`${config.backendUrl}/api/characters/one/${character_id}`);
            const data = await response.json();
            setChaTitle(data.name);
            setChaTitleEn(data.name_en.toUpperCase());
            setPages(data.page || [detailList.length])
            console.log(data)
          } catch (error) {
            console.error('Failed to fetch work details:', error);
          }
        };
    
        fetchChaDetails();
      }, []);

      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`${config.backendUrl}/api/characters/details/${character_id}`);
            const data = await response.json();
            console.log(data);
            setDetailList(data);
          } catch (error) {
            console.error('Failed to fetch data:', error);
          }
        };
    
        fetchData();
      }, []);
    
      const getPageDetails = () => {
        const startIndex = pages.slice(0, currentPage).reduce((acc, val) => acc + val, 0);
        const endIndex = startIndex + pages[currentPage];
        return detailList.slice(startIndex, endIndex);
      };

      useEffect(() => {
              const savedPage = localStorage.getItem(`character_${character_id}_page`);
              if (savedPage) {
                setCurrentPage(Number(savedPage));
               }
      }, [character_id]);

      useEffect(() => {
              localStorage.setItem(`character_${character_id}_page`, currentPage);
      }, [currentPage, character_id]);

      // Render different components based on detail_type
        const renderDetail = (item) => {
            switch (item.detail_type) {
            case 'image':
                return <ImageDetail key={item.id} content={isEnglish ? item.detail_en : item.detail} />;
            case 'video':
                return <VideoDetail key={item.id} content={isEnglish ? item.detail_en : item.detail} />;
            case 'link':
                return <
                    LinkDetail key={item.id} 
                    content={isEnglish ? item.detail_en : item.detail} 
                    text={isEnglish ? 'Start Game' : '跳转游戏'}
                    />;
            case 'text':
                console.log(item)
                return <TextDetail key={item.id} content={isEnglish ? item.detail_en : item.detail} />;
            default:
                return <p>Unsupported detail type</p>;
            }
        };
  
  return (
    <div className='detailList-container'>
      <div className='cha-title'>
      <h1 className='cha-h1'>{isEnglish ? chaTitleEn : chaTitle}/</h1>
      <h2 className='cha-h2'>{isEnglish ? workTitleEn : workTitle}</h2>
      </div>
      <div className="detailList-container">
        {getPageDetails().map((item) => (
          <div key={item.id} className="detail-item">
            {renderDetail(item)}
          </div>
        ))}
      </div>

      {/* 换页按钮 */}
      {pages.length > 1 && (
                <div className="pagination">
                    <div 
                    className={`image-button ${currentPage === 0 ? 'disabled' : ''}`}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      <img src="/assest/image/last.png" alt="Button" />
                    </div>
                    <span>{currentPage + 1} | {pages.length}</span>
                    <div
                    className={`image-button ${currentPage === pages.length - 1 ? 'disabled' : ''}`}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        <img src="/assest/image/next.png" alt="Button" />
                    </div>
                </div>
      )}
    </div>
  );
};

export default CharacterDetail;