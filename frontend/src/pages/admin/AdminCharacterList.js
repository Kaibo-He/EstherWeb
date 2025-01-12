import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../../config';
import EditItem from '../components/EditItem';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../components/getCroppedImg';
import Dropdown from '../components/DropDown';
import './admin.css';

const AdminCharacterList = () => {
    const [workList, setWorkList] = useState([]);
    const { work_id } = useParams();
    const [characterList, setCharacterList] = useState([]);
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        title_en: '',
        cover: null
    });
    const [cropData, setCropData] = useState({ 
      imageSrc: null,
      crop: { x: 0, y: 0 },
      zoom: 1,
      croppedAreaPixels: null,
    });
    const [showCropModal, setShowCropModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`${config.backendUrl}/api/works`);
            const data = await response.json();
            const updatedData = data.map((item) => ({
              id: item.id,
              title: item.title 
            }));
            setWorkList(updatedData);
          } catch (error) {
            console.error('Failed to fetch data:', error);
          }
        };
        fetchData();
      }, []);

      useEffect(() => {
        if (work_id) {
            const fetchCharacterList = async () => {
                const response = await fetch(`${config.backendUrl}/api/characters/${work_id}`);
                const data = await response.json();
                setCharacterList(data);
            };
            fetchCharacterList();
        }
    }, [work_id]);
    

    const handleAddWork = () => {
      setFormData({ title: '', title_en: '', cover: null, coverChar: null });
      setShowCreate(true);
    }

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    }

    const confirmDelete = () => {
        deleteData();
        deleteFile();
        setShowConfirm(false); // 关闭弹窗
        setDeleteId(null); // 清空待删除 ID
    };

    const cancelDelete = () => {
        setShowConfirm(false); // 关闭弹窗
        setDeleteId(null); // 清空待删除 ID
    };

    const handleFileChange = (e, cropType) => {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = () => setCropData({
              ...cropData,
              imageSrc: reader.result,
              cropType, // 标识裁剪的是封面还是角色封面
          });
          reader.readAsDataURL(file);
          setShowCropModal(true);
      }
    };

    const handleCropConfirm = async () => {
      if (!cropData.croppedAreaPixels) return;
      try {
          const croppedBlob = await getCroppedImg(cropData.imageSrc, cropData.croppedAreaPixels, 1000, 90);
          const croppedFile = new File([croppedBlob], 'cover.png', { type: 'image/png' });
          console.log(croppedFile)
          setFormData((prev) => ({
              ...prev,
              cover: croppedFile, // 将裁剪后的图片保存到相应字段
          }));
          console.log(cropData.cropType)
          console.log('crop', formData)
          setShowCropModal(false);
      } catch (error) {
          console.error('Error cropping image:', error);
      }
    };

    const handleCropCancel = () => {
        setShowCropModal(false);
        setCropData({ imageSrc: null, crop: { x: 0, y: 0 }, zoom: 1, croppedAreaPixels: null, cropType: null });
    };

    const uploadCharacter = async () => {
      const body = {
        work_id: work_id,
        name: formData.title,
        name_en: formData.title_en
      }
      try {
          const response = await fetch(`${config.backendUrl}/api/characters`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json', // 设置为 JSON 格式
              },
              body: JSON.stringify(body),
          });
          if (response.ok) {
              const newWork = await response.json();
              setCharacterList((prevList) => [...prevList, newWork]);
              setShowCreate(false);
              return newWork.id;
          }
          alert('请输入标题')
      } catch (error) {
          console.error('Error creating work:', error);
      }
    };

    const uploadFile = async (id) => {
      if (!formData.cover) {
        return
      }
      const body = new FormData();
      body.append('file', formData.cover); // 文件
      body.append('path', `uploads/works/work${work_id}/characters/character${id}`); // 上传路径
      body.append('name', `${work_id}-${id}-character-cover`); // 文件名（不含扩展名）
  
      try {
          const response = await fetch(`${config.backendUrl}/api/upload`, {
              method: 'POST',
              body,
          });
  
          if (response.ok) {
              const data = await response.json();
              console.log('Upload successful:', data);
              return data.filePath; // 返回上传后的文件路径
          } else {
              const errorData = await response.json();
              console.error('Upload failed:', errorData);
              throw new Error(errorData.error || 'Unknown upload error');
          }
      } catch (error) {
          console.error('Error uploading file:', error.message);
          throw error;
      }   
    }

    const setCover = async (id, path) => {
      const body = {cover: path};

      try {
        const response = await fetch(`${config.backendUrl}/api/characters/${id}/cover`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json', // 设置请求头为 JSON
          },
          body: JSON.stringify(body), // 将对象转换为 JSON 字符串
        });
        console.log(response)
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Upload failed:', errorData);
          throw new Error(errorData.error || 'Unknown upload error');
        }
      } catch (error) {
        console.error('Error setting cover:', error.message);
        throw error;
      }
    }

    const createCharacter = () => {
      uploadCharacter().then((id) => {
        if (formData.cover) {
              uploadFile(id).then((path) => {
              setCover(id, path.replace(/\\/g, '/').replace(/^uploads\//, ''));
            });
        }
      });
    }

    const deleteData = async () => {
        if (!deleteId) return;

        try {
            const response = await fetch(`${config.backendUrl}/api/characters/${deleteId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setCharacterList((prevList) => prevList.filter((item) => item.id !== deleteId));
            }
        } catch (error) {
            console.error('Failed to delete item:', error);
            alert('删除失败');
        }
    }

    const deleteFile = async () => {
        if (!deleteId) return;
        const body = new FormData();
        body.append('path', `uploads/works/work${work_id}/characters/character${deleteId}`);
        try {
            const response = await fetch(`${config.backendUrl}/api/upload`, {
                method: 'DELETE',
                body
            });
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('删除失败');
        }
    }

    const handleSelect = (selectedOption) => {
        console.log('here')
        fetchChaList(selectedOption.id);
        navigate(`/admin/character/${selectedOption.id}`)
    };

    const fetchChaList = async (id) => {
        try {
            const response = await fetch(`${config.backendUrl}/api/characters/${id}`);
            const data = await response.json();
                const updatedData = data.map((item) => ({
                    title: item.name,
                    title_en: item.name_en,
                    cover: item.cover,
                    id: item.id
                }))
            setCharacterList(updatedData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    return (
      <div className='listPage-container'>
        <div className='header-container'>
          <button id='single1' className='small-button' onClick={handleAddWork}>新建角色</button>
          <Dropdown 
            options={workList} 
            onSelect={handleSelect} 
            placeholder="请选择作品"
          />
          <div className='editList-container'>
              {characterList.map((item, index) => (
                  <EditItem
                      key={item.id}
                      text={item.name}
                      editClick={() => navigate(`/admin/character/${work_id}/${item.id}`)}
                      deleteClick={() => handleDelete(item.id)}
                  />
              ))}
          </div>
          </div>

          {/* 新建部分 */}
          {showCreate && (
              <div className='modal-overlay'>
                <div className="create-work">
                  <div className="createWork-content">
                      <h2 className='admin-h2'>新建角色</h2>
                      <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="角色姓名"
                          className="text-input"
                      />
                      <input
                          type="text"
                          name="title_en"
                          value={formData.title_en}
                          onChange={(e) => setFormData((prev) => ({ ...prev, title_en: e.target.value }))}
                          placeholder="英文姓名"
                          className="text-input"
                      />
                      <div className='createWork-upload'>
                        <label>上传封面</label>
                      <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'cover')}
                          className="file-input"
                      />
                      </div>
                      <div className='createWork-upload'>
                      </div>
                      <div className="createWork-buttons">
                          <button className="small-button" onClick={createCharacter}>确认</button>
                          <button className="small-button" onClick={() => setShowCreate(false)}>取消</button>
                      </div>
                  </div>
              </div>
              </div>
          )}

          {/* 裁剪窗口 */}
          {showCropModal && (
              <div className="modal-overlay">
                <div className="crop-modal">
                  <div className="crop-container">
                      <Cropper
                          image={cropData.imageSrc}
                          crop={cropData.crop}
                          zoom={cropData.zoom}
                          maxZoom={10}
                          aspect={1000 / 90} // 固定比例
                          cropSize={{ width: 500, height: 45 }}
                          onCropChange={(crop) => setCropData((prev) => ({ ...prev, crop }))}
                          onZoomChange={(zoom) => setCropData((prev) => ({ ...prev, zoom }))}
                          onCropComplete={(croppedArea, croppedAreaPixels) => setCropData((prev) => ({ ...prev, croppedAreaPixels }))}
                          cropShape="rect" // 矩形裁剪
                          showGrid={true} // 隐藏网格
                      />
                      <div className="crop-buttons">
                          <button onClick={handleCropConfirm} className="small-button">确认</button>
                          <button onClick={handleCropCancel} className="small-button">取消</button>
                      </div>
                  </div>
              </div>
              </div>
          )}

          {/* 删除部分 */}
          {showConfirm && (
            <div className="confirm-modal">
              <div className="modal-content">
                <p>确定要删除这个章节吗？</p>
                <div className="modal-buttons">
                  <button className="confirm-button" onClick={confirmDelete}>确认</button>
                  <button className="cancel-button" onClick={cancelDelete}>取消</button>
                </div>
              </div>
            </div>
          )}
          
          
      </div>
  );
}

export default AdminCharacterList;