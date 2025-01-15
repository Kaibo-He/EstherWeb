import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../../config';
import EditItem from '../components/EditItem';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../components/getCroppedImg';
import Dropdown from '../components/DropDown';
import './admin.css';

const AdminCharacterEdit = () => {
    const { work_id, character_id} = useParams();
    const [detailList, setDetailList] = useState([]);
    const [selectedValue, setSelectedValue] = useState("");
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showEditDetail, setShowEditDetail] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [currentId, setCurrentId] = useState(null);
    const [currentDetail, setCurrentDetail] = useState({});
    const [currentCharacter, setCurrentCharacter] = useState({});
    const [formData, setFormData] = useState({});
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
            const response = await fetch(`${config.backendUrl}/api/characters/details/${character_id}`);
            const data = await response.json();
            setDetailList(data);
          } catch (error) {
            console.error('Failed to fetch data:', error);
          }
        };
        fetchData();
      }, []);

    const handleAddDetail = () => {
      setFormData({ content: '', content_en: '', content_type: '' });
      setShowCreate(true);
    }

    useEffect(() => {
      fetchCurrentCharacter();
    }, []);

    const fetchCurrentCharacter = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/api/characters/one/${character_id}`);
        const data = await response.json();
        setCurrentCharacter(data);
        setFormData({
          ...formData,
          title: data.name,
          title_en: data.name_en,
          page: (data.page || []).join(', ')
        });
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
    }

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    }

    const confirmDelete = () => {
        deleteData();
        deleteFile('');
        deleteFile('-en');
        setPage(character_id, 'delete');
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

    const handleUploadChange = (e, type, isEn) => {
        console.log('typenow',type)
        let input = null
        if (type.includes('image') || type.includes('video')) {
            input = e.target.files[0];
        } else {
            input = e.target.value;
        }
        
        if (input) {
            (isEn) ? setFormData({...formData, content_en: input, content_type: type}) : setFormData({...formData, content: input, content_type: type})
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

    const uploadDetail = async (detail, detail_en, type) => {
      const body = {
        character_id: character_id,
        detail: detail,
        detail_en: detail_en,
        detail_type: type
      }
      try {
          const response = await fetch(`${config.backendUrl}/api/characters/details`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json', // 设置为 JSON 格式
              },
              body: JSON.stringify(body),
          });
          if (response.ok) {
              const newWork = await response.json();
              setDetailList((prevList) => [...prevList, newWork]);
              setShowCreate(false);
              return newWork.id;
          }
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

    const uploadDetailFile = async (id, file, isEn) => {
        if (!file) {
          return
        }
        const body = new FormData();
        body.append('file', file); // 文件
        body.append('path', `uploads/works/work${work_id}/characters/character${character_id}`); // 上传路径
        isEn ? body.append('name', `${work_id}-${character_id}-${id}-en`) : body.append('name', `${work_id}-${character_id}-${id}`); // 文件名（不含扩展名）
    
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

    const setDetail = async (id, path1, path2) => {
        const body = {
            detail: path1,
            detail_en: path2,
            detail_type: formData.content_type,
        }
        try {
            const response = await fetch(`${config.backendUrl}/api/characters/details/${id}`, {
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
            } else {
                setShowCreate(false);
                setShowEditDetail(false);
            }
          } catch (error) {
            console.error('Error setting cover:', error.message);
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
        setCurrentCharacter({...currentCharacter, cover: path});
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

    const setName = async (id) => {
        const body = {
          name: formData.title,
          name_en: formData.title_en
        }
        console.log(body)
        try {
          const response = await fetch(`${config.backendUrl}/api/characters/${id}/name`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json', // 设置请求头为 JSON
            },
            body: JSON.stringify(body), // 将对象转换为 JSON 字符串
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Upload name failed:', errorData);
            throw new Error(errorData.error || 'Unknown upload error');
          }
        } catch (error) {
          console.error('Error setting name:', error.message);
          throw error;
        }
      }

    const handleEditDetail = (id) => {
        fetchCurrentDetail(id);
        setShowEditDetail(true);
        setCurrentId(id);
    }

    const createDetail = () => {
        if (!formData.content_type || !formData.content) {
            alert('中文内容不能为空！')
            return}; 
        if (formData.content_type === 'image' || formData.content_type === 'video') {
            const file = formData.content;
            const file_en = formData.content_en;
            let path_ch = '';
            let path_en = '';
            uploadDetail('default', '', formData.content_type).then((id) => {
                uploadDetailFile(id, file, false).then((path) => {
                    path_ch = path.replace(/\\/g, '/').replace(/^uploads\//, '');
                    setDetail(id, path_ch, path_en)
                })

                if (file_en) {
                    uploadDetailFile(id, file_en, true).then((path) => {
                        path_en = path.replace(/\\/g, '/').replace(/^uploads\//, '')
                        setDetail(id, path_ch, path_en)
                    })
                }
                setPage(character_id, 'new');
            })
        } else {
          uploadDetail(formData.content, formData.content_en, formData.content_type).then(() => {
            setPage(character_id,'new');
          });
        }
    }

    const deleteData = async () => {
        if (!deleteId) return;

        try {
            const response = await fetch(`${config.backendUrl}/api/characters/details/${deleteId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setDetailList((prevList) => prevList.filter((item) => item.id !== deleteId));
            }
        } catch (error) {
            console.error('Failed to delete item:', error);
            alert('删除失败');
        }
    }

    const deleteFile = async (ex) => {
        if (!deleteId) return;
        const body = new FormData();
        body.append('path', `uploads/works/work${work_id}/characters/character${character_id}`);
        body.append('name', `${work_id}-${character_id}-${deleteId}${ex}`)
        try {
            const response = await fetch(`${config.backendUrl}/api/upload/one`, {
                method: 'DELETE',
                body
            });
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('删除失败');
        }
    }

    const editCharacter = async () => {
        console.log(formData)
        if (formData.title) {
          setName(character_id);
          if (formData.cover) {
            uploadFile(character_id, 'cover').then((path) => {
              setCover(character_id, path.replace(/\\/g, '/').replace(/^uploads\//, ''));
            });
          }
          if (formData.page) {
            setPage(character_id, 'edit');
          }
          await fetchCurrentCharacter();
          setShowEdit(false);
        } else {
            alert('请输入名字！')
            return
        }
      }

      const setPage = async (id, type) => {
        if (!currentCharacter.page && type === 'new') {
          return
        }

        let pageArray = [];
        if (type === 'new') {
          const pageNow = currentCharacter.page;
          pageNow[pageNow.length - 1] += 1;
          pageArray = pageNow;
        } else if (type === 'delete') {
          const pageNow = currentCharacter.page;
          if (pageNow[pageNow.length - 1] === 1) {
            pageNow.pop();
          } else {
            pageNow[pageNow.length - 1] -= 1;
          }
          pageArray = pageNow;
        } else {
          pageArray = formData.page.split(/[\s,]+/).map(Number).filter((num) => !isNaN(num));
          if (pageArray.reduce((sum, num) => sum + num, 0) !== detailList.length) {
            alert('分页数据不正确，请确保所有数字之和等于内容总数！');
            return;
          }
        }
    
        try {
          await fetch(`${config.backendUrl}/api/characters/${id}/page`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page: pageArray }),
          });
          setCurrentCharacter({...currentCharacter, page: pageArray})
        } catch (error) {
          console.error('Failed to update page:', error);
        }
      };    

      const clearPage = async () => {
        try {
          await fetch(`${config.backendUrl}/api/characters/${character_id}/page`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page: [] }),
          });
          alert('分页已清空！');
          setFormData({...formData, page: ''});
        } catch (error) {
          console.error('Failed to clear page:', error);
        }
      };

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
        setFormData({
            ...formData,
            content_type: event.target.value
        })
    };
      
    const renderPageContent = () => {
        switch (selectedValue) {
          case "text":
            return (
                <div>
                    <textarea
                        onChange={(e) => handleUploadChange(e, 'text', false)}
                        className="file-input"
                        placeholder='请输入中文'
                    />
                    <textarea
                        onChange={(e) => handleUploadChange(e, 'text', true)}
                        className="file-input"
                        placeholder='请输入英文'
                    />
                </div>
            );
          case "image":
            return (
                <div className='image-content'>
                <label>请选择中文内容</label>
                <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUploadChange(e, 'image', false)}
                className="file-input"
                />
                <label>请选择英文内容</label>
                <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUploadChange(e, 'image', true)}
                className="file-input"
                />
                </div>
            );
          case "video":
            return (
                <div className='image-content'>
                <label>请选择中文内容</label>
                <input
                type="file"
                accept="video/*"
                onChange={(e) => handleUploadChange(e, 'video', false)}
                className="file-input"
                />
                <label>请选择英文内容</label>
                <input
                type="file"
                accept="video/*"
                onChange={(e) => handleUploadChange(e, 'video', true)}
                className="file-input"
                />
                </div>
            );
          case "link":
            return (
                <div className='image-content'>
                <label>请选择中文内容</label>
                <input
                type="text"
                onChange={(e) => handleUploadChange(e, 'link', false)}
                className="file-input"
                placeholder='请输入游戏链接'
                />
                <label>请选择英文内容</label>
                <input
                type="text"
                onChange={(e) => handleUploadChange(e, 'link', true)}
                className="file-input"
                placeholder='请输入游戏链接'
                />
                </div>
            );
          default:
            return <p>请在下拉菜单选择内容类型</p>;
        }
      };

    const fetchCurrentDetail = async (id) => {
        try {
            const response = await fetch(`${config.backendUrl}/api/characters/details/one/${id}`);
            const data = await response.json();
            setCurrentDetail(data);
          } catch (error) {
            console.error('Failed to fetch work details:', error);
          }
    }

    const editDetail = () => {
        let path_ch = '';
        let path_en = '';
        let finaldetail = formData.content;
        let finaldetail_en = formData.content_en;
        console.log(currentDetail)
        console.log(formData)

        if (formData.content_type === currentDetail.content_type) {
            
            if (!formData.content) {
                finaldetail = currentDetail.content;
            }
            if (!formData.content_en) {
                finaldetail_en = currentDetail.content_en;
            }
        } else {
            if (!formData.content) {
                alert('内容类型发生改变，中文内容不能为空！')
                return
            }
        }

        if (formData.content_type === 'image' || formData.content_type === 'video') {
            if (formData.content) {
                uploadDetailFile(currentId, finaldetail, false).then((path) => {
                    path_ch = path.replace(/\\/g, '/').replace(/^uploads\//, '');
                    setDetail(currentId, path_ch, path_en)
                })
            }

            if (formData.content_en) {
                uploadDetailFile(currentId, finaldetail_en, true).then((path) => {
                    path_en = path.replace(/\\/g, '/').replace(/^uploads\//, '')
                    setDetail(currentId, path_ch || finaldetail, path_en)
                })
            } 
        } else {
            setDetail(currentId, finaldetail, finaldetail_en);
        }
    }

    const handleEditCharacter = () => {
        fetchCurrentCharacter();
        console.log(currentCharacter.name)
        console.log(formData)
        if (currentCharacter) {
            setFormData({
                title: currentCharacter.name,
                title_en: currentCharacter.name_en,
                cover: null,
                page: currentCharacter.page.join(',')
            })
            setShowEdit(true)
        }
    }

    return (
      <div className='listPage-container'>
        <div className='header-container'>
            
          <button id='single1' className='small-button' onClick={handleAddDetail}>新建内容</button>
          <button id='single2' className='small-button' onClick={handleEditCharacter}>修改角色</button>
          <button id='single2' className='small-button' onClick={() => navigate(`/admin/character/${work_id}`)}>返回上页</button>
          <div className='editList-container'>
              {detailList.map((item, index) => (
                  <EditItem
                      key={item.id}
                      text={`${item.detail_type}${index+1}`}
                      editClick={() => handleEditDetail(item.id)}
                      deleteClick={() => handleDelete(item.id)}
                  />
              ))}
          </div>
          </div>

          {/* 修改内容部分 */}
          {showEditDetail && (
              <div className='modal-overlay'>
                <div className="create-work">
                  <div className="createWork-content">
                      <h2 className='admin-h2'>修改内容</h2>
                      <div>
                        <label>请在右侧下拉菜单中选择内容类型</label>
                        <select id="dropdown" name="options" onChange={handleChange}>
                            <option value="text">文本</option>
                            <option value="image">图片</option>
                            <option value="video">视频</option>
                            <option value="link">游戏</option>
                            </select>    
                        </div>
                        {/* 页面内容 */}
                        <div className='detail-upload'>{renderPageContent()}</div>
                      <div className="createWork-buttons">
                          <button className="small-button" onClick={() => editDetail()}>确认</button>
                          <button className="small-button" onClick={() => setShowEditDetail(false)}>取消</button>
                      </div>
                  </div>
              </div>
              </div>
          )}

          {/* 新建部分 */}
          {showCreate && (
              <div className='modal-overlay'>
                <div className="create-work">
                  <div className="createWork-content">
                      <h2 className='admin-h2'>新建内容</h2>
                      <div>
                        <label>请在右侧下拉菜单中选择内容类型</label>
                        <select id="dropdown" name="options" onChange={handleChange}>
                            <option value="text">文本</option>
                            <option value="image">图片</option>
                            <option value="video">视频</option>
                            <option value="link">游戏</option>
                            </select>    
                        </div>
                        {/* 页面内容 */}
                        <div className='detail-upload'>{renderPageContent()}</div>
                      <div className="createWork-buttons">
                          <button className="small-button" onClick={createDetail}>确认</button>
                          <button className="small-button" onClick={() => setShowCreate(false)}>取消</button>
                      </div>
                  </div>
              </div>
              </div>
          )}

          {/* 修改角色部分 一会去替换character的修改 */}
          {showEdit && (
              <div className='modal-overlay'>
                <div className="create-work">
                  <div className="createWork-content">
                      <h2 className='admin-h2'>修改角色信息</h2>
                      <input
                          type="text"
                          name="name"
                          value={formData.title}
                          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="角色姓名"
                          className="text-input"
                      />
                      <input
                          type="text"
                          name="name_en"
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
                        <label>编辑分页</label>
                      <input
                          type="text"
                          name="page"
                          value={formData.page}
                          onChange={(e) => setFormData((prev) => ({ ...prev, page: e.target.value }))}
                          placeholder="请输入分页信息，用逗号或空格分隔"
                          className="text-input"
                      />
                      </div>
                      <button className="small-button" onClick={clearPage}>清空分页</button>
                      <div className="createWork-buttons">
                          <button className="small-button" onClick={editCharacter}>确认</button>
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
                <p>确定要删除此内容吗？</p>
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

export default AdminCharacterEdit;