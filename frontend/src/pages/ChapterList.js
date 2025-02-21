import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import config from '../config';
import ChaItem from './components/ChaItem';
import '../style.css';


const ChapterList = ({ isEnglish }) => {
  const [chapterList, setchapterList] = useState([]);
  const { work_id } = useParams();
  const [workTitle, setWorkTitle] = useState('');
  const [workTitleEn, setWorkTitleEn] = useState('');
  const location = useLocation();
  const navigate = useNavigate(); 

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
  }, [work_id]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/api/chapters/${work_id}`);
        const data = await response.json();
        const updatedData = data.map((item) => ({
            ...item,
            cover: `${config.backendUrl}/uploads/${item.cover}`
          }));
        setchapterList(updatedData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [work_id]);

  let endUrl = '';

  if (location.pathname.includes('/en')) {
    endUrl = '/en';
  }

  return (
    <div className='chaList-container'>
      <div className='cha-title'>
        <h1 className='cha-h1'>{isEnglish ? 'CHAPTERS/' : '章节列表/'}</h1>
        <h2 className='cha-h2'>{isEnglish ? workTitleEn : workTitle}</h2>
      </div>
      <div className='chaDetailList-container'>
        {chapterList.map((item, index) => (
          <ChaItem
            key={item.id}
            Image={item.cover}
            Text={isEnglish ? item.title_en : item.title}
            onClick={() => 
              navigate(`/chapter/${work_id}/${item.id}${endUrl}`)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ChapterList;