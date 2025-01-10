import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import config from '../config';
import TextDetail from './components/TextDetail';
import ImageDetail from './components/ImageDetail';
import VideoDetail from './components/VideoDetail';
import LinkDetail from './components/LinkDetail';
import '../style.css';


const ChapterDetail = ({ isEnglish }) => {
    const { work_id, chapter_id } = useParams();
    const [workTitle, setWorkTitle] = useState('');
    const [workTitleEn, setWorkTitleEn] = useState('');
    const [chaTitle, setChaTitle] = useState('');
    const [chaTitleEn, setChaTitleEn] = useState('');
    const [detailList, setDetailList] = useState([]);

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
            const response = await fetch(`${config.backendUrl}/api/chapters/one/${chapter_id}`);
            const data = await response.json();
            setChaTitle(data.title);
            setChaTitleEn(data.title_en.toUpperCase());
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
            const response = await fetch(`${config.backendUrl}/api/chapters/details/${chapter_id}`);
            const data = await response.json();
            console.log(data);
            setDetailList(data);
          } catch (error) {
            console.error('Failed to fetch data:', error);
          }
        };
    
        fetchData();
      }, []);
    
      // Render different components based on content_type
        const renderDetail = (item) => {
            switch (item.content_type) {
            case 'image':
                return <ImageDetail key={item.id} content={isEnglish ? item.content_en : item.content} />;
            case 'video':
                return <VideoDetail key={item.id} content={isEnglish ? item.content_en : item.content} />;
            case 'link':
                return <
                    LinkDetail key={item.id} 
                    content={isEnglish ? item.content_en : item.content} 
                    text={isEnglish ? 'Start Game' : '跳转游戏'}
                    />;
            case 'text':
                console.log(item)
                return <TextDetail key={item.id} content={isEnglish ? item.content_en : item.content} />;
            default:
                return <p>Unsupported content type</p>;
            }
        };
  
  return (
    <div className='detailList-container'>
      <div className='cha-title'>
      <h1 className='cha-h1'>{isEnglish ? chaTitleEn : chaTitle}/</h1>
      <h2 className='cha-h2'>{isEnglish ? workTitleEn : workTitle}</h2>
      </div>
      <div className="detailList-container">
        {detailList.map((item) => (
          <div key={item.id} className="detail-item">
            {renderDetail(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterDetail;