import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FrontTopBar from './components/FrontTopBar';
import { useAppContext } from '../AppContext';
import config from '../config';
import WorkItem from './components/WorkItem';
import '../style.css';


const HomePage = ({ isEnglish }) => {
  const { homeTitle } = useAppContext();
  const [workList, setWorkList] = useState([]);
  const navigate = useNavigate(); 
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/api/works`);
        const data = await response.json();
        const updatedData = data.map((item) => ({
          ...item,
          cover: `${config.backendUrl}/uploads/${item.cover}`,
          coverChar: `${config.backendUrl}/uploads/${item.coverChar}`, 
        }));
        console.log(updatedData[0].cover)
        setWorkList(updatedData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
      
    };

    fetchData();
  }, []);

  let endUrl = '';

    if (location.pathname.includes('/en')) {
      endUrl = '/en';
    }

  return (
    <div className='home-container'>
      <h1 className='home-h1'>{isEnglish ? homeTitle.title_en : homeTitle.title}</h1>
      <div className='workList-container'>
        {workList.map((item, index) => (
        <WorkItem
          key={item.id}
          leftImage={item.cover}
          rightImage={item.coverChar}
          leftText={isEnglish ? item.title_en : item.title}
          rightText={isEnglish ? 'Chracters' : '角色'}
          onLeftClick={() => 
            navigate(`/chapter/${item.id}${endUrl}`)
          }
          onRightClick={() => 
            navigate(`/character/${item.id}${endUrl}`)
          }
        />
      ))}
      </div>
    </div>
  );
};

export default HomePage;