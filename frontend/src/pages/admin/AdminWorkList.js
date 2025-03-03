import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import EditItem from '../components/EditItem';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../components/getCroppedImg';
import './admin.css';

const AdminWorkList = () => {
  const token = localStorage.getItem('token');
  const [workList, setWorkList] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    title_en: '',
    cover: null,
    coverChar: null
  });
  const [cropData, setCropData] = useState({ 
    imageSrc: null,
    crop: { x: 0, y: 0 },
    zoom: 1,
    croppedAreaPixels: null,
    cropType: null, // 'cover' or 'coverChar'
  });
  const [showCropModal, setShowCropModal] = useState(false);

  useEffect(() => {
        // 获取作品列表
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/api/works`);
        if (!response.ok) throw new Error("Failed to fetch works");
        const data = await response.json();
        const updatedData = data.map((item) => ({
          ...item,
          cover: `${config.backendUrl}/uploads/${item.cover}`,
          coverChar: `${config.backendUrl}/uploads/${item.coverChar}`, 
        }));
        setWorkList(updatedData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, [formData]);


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
      const croppedBlob = await getCroppedImg(cropData.imageSrc, cropData.croppedAreaPixels, 750, 180);
      const croppedFile = new File([croppedBlob], `${cropData.cropType}.png`, { type: 'image/png' });
      setFormData((prev) => ({
        ...prev,
        [cropData.cropType]: croppedFile, // 将裁剪后的图片保存到相应字段
      }));
      setShowCropModal(false);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setCropData({ imageSrc: null, crop: { x: 0, y: 0 }, zoom: 1, croppedAreaPixels: null, cropType: null });
  };

  const uploadWork = async () => {
    const body = {
      title: formData.title,
      title_en: formData.title_en
    }
    try {
      const response = await fetch(`${config.backendUrl}/api/works`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // 设置为 JSON 格式
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        const newWork = await response.json();
        setWorkList((prevList) => [...prevList, newWork]);
        setShowCreate(false);
        return newWork.id;
      }
      alert('请输入标题')
    } catch (error) {
      console.error('Error creating work:', error);
    }
  };

  const uploadFile = async (id, type) => {
    if (!formData[type]) {
      return
    }
    const body = new FormData();
    body.append('file', formData[type]); // 文件
    body.append('path', `uploads/works/work${id}`); // 上传路径
    body.append('name', `${id}-${type}`); // 文件名（不含扩展名）
  
    try {
      const response = await fetch(`${config.backendUrl}/api/upload`, {
        method: 'POST',
        headers: {'Authorization': `Bearer ${token}`},
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

  const setCover = async (id, type, path) => {
    const body = {[type]: path};

    try {
      const response = await fetch(`${config.backendUrl}/api/works/${id}/${type}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // 设置请求头为 JSON
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body), // 将对象转换为 JSON 字符串
      });
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

  const setTitle = async (id) => {
    const body = {
      title: formData.title,
      title_en: formData.title_en
    }

    try {
      const response = await fetch(`${config.backendUrl}/api/works/${id}/title`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // 设置请求头为 JSON
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body), // 将对象转换为 JSON 字符串
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload title failed:', errorData);
        throw new Error(errorData.error || 'Unknown upload error');
      }
    } catch (error) {
      console.error('Error setting title:', error.message);
      throw error;
    }

  }

  const createWork = () => {
    uploadWork().then((id) => {
      if (formData.cover) {
        uploadFile(id, 'cover').then((path) => {
        setCover(id, 'cover', path.replace(/\\/g, '/').replace(/^uploads\//, ''));
      });
      }

      if (formData.coverChar) {
        uploadFile(id, 'coverChar').then((path) => {
        setCover(id, 'coverChar', path.replace(/\\/g, '/').replace(/^uploads\//, ''));
        });
      }
    });
  }

  const deleteData = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`${config.backendUrl}/api/works/${deleteId}`, {
        method: 'DELETE',
        headers: {'Authorization': `Bearer ${token}`}
      });

      if (response.ok) {
        setWorkList((prevList) => prevList.filter((item) => item.id !== deleteId));
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('删除失败');
    }
  }

  const deleteFile = async () => {
    if (!deleteId) return;
    const body = new FormData();
    body.append('path', `uploads/works/work${deleteId}`);
    try {
      const response = await fetch(`${config.backendUrl}/api/upload/delete/all`, {
        method: 'PUT',
        headers: {'Authorization': `Bearer ${token}`},
        body
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('删除失败');
    }
  }

  const handleEdit = (id) => {
    const currentWork = workList.find((item) => item.id === id);
    if (currentWork) {
      setFormData({
        title: currentWork.title,
        title_en: currentWork.title_en,
        cover: null,
        coverChar: null
      })
      setCurrentId(id);
      setShowEdit(true);
    }
  }

    
  const editWork = () => {
    if (formData.title) {
      setShowEdit(false);
      setTitle(currentId);
      if (formData.cover) {
        uploadFile(currentId, 'cover').then((path) => {
          setCover(currentId, 'cover', path.replace(/\\/g, '/').replace(/^uploads\//, ''));
        });
      }
  
      if (formData.coverChar) {
        uploadFile(currentId, 'coverChar').then((path) => {
          setCover(currentId, 'coverChar', path.replace(/\\/g, '/').replace(/^uploads\//, ''));
        });
      }
    }
  }
    
  return (
    <div className='listPage-container'>
      <button id='single1' className='small-button' onClick={handleAddWork}>新建作品</button>
      <div className='editList-container'>
        {workList.map((item, index) => (
          <EditItem
            key={item.id}
            text={item.title}
            editClick={() => handleEdit(item.id)}
            deleteClick={() => handleDelete(item.id)}
          />
        ))}
      </div>

      {/* 新建部分 */}
      {showCreate && (
        <div className='modal-overlay'>
          <div className="create-work">
            <div className="createWork-content">
              <h2 className='admin-h2'>新建作品</h2>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="作品标题*"
                  className="text-input"
                />
                <input
                  type="text"
                  name="title_en"
                  value={formData.title_en}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title_en: e.target.value }))}
                  placeholder="英文标题"
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
                  <label>上传角色封面</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'coverChar')}
                    className="file-input"
                  />
                </div>
                <div className="createWork-buttons">
                  <button className="small-button" onClick={createWork}>确认</button>
                  <button className="small-button" onClick={() => setShowCreate(false)}>取消</button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* 修改部分 */}
      {showEdit && (
        <div className='modal-overlay'>
          <div className="create-work">
            <div className="createWork-content">
              <h2 className='admin-h2'>修改作品信息</h2>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="作品标题"
                className="text-input"
              />
              <input
                type="text"
                name="title_en"
                value={formData.title_en}
                onChange={(e) => setFormData((prev) => ({ ...prev, title_en: e.target.value }))}
                placeholder="英文标题"
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
                <label>上传角色封面</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'coverChar')}
                  className="file-input"
                />
              </div>
              <div className="createWork-buttons">
                <button className="small-button" onClick={editWork}>确认</button>
                <button className="small-button" onClick={() => setShowEdit(false)}>取消</button>
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
                maxZoom={100}
                aspect={750 / 180} // 固定比例
                cropSize={{ width: 450, height: 108 }}
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
            <p>确定要删除这个作品吗？</p>
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

export default AdminWorkList;