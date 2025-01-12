const { Work } = require('../models');

const createWork = async (req, res) => {
    try {
      const { title, title_en, cover = "default.png", coverChar = "default.png" } = req.body;
      if (!title) {
        return res.status(400).send({ error: "Missing required fields: title" });
      }
      const finalTitleEn = title_en || title;
  
      // 使用 Sequelize 创建记录
      const newWork = await Work.create({ title, title_en: finalTitleEn, cover, coverChar });
  
      res.status(201).send(newWork);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };

const getAllWorks = async (req, res) => {
    try {
      const works = await Work.findAll({
        attributes: ['id', 'title', 'title_en', 'cover', 'coverChar'], // 选择需要的字段
        order: [['id', 'ASC']], // 按时间降序排列
      });
      res.send(works);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };

const getWork = async (req, res) => {
  try {
    const { id } = req.params;
    const work = await Work.findOne({
      where: { id },
      attributes: ['id', 'title', 'title_en', 'cover', 'coverChar']
    })

    if (!work) {
      return res.status(404).send({ error: 'Work not found' }); 
    }

    res.send(work); 
  } catch (error) {
    res.status(500).send({ error: error.message }); 
  }
};

const deleteWork = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedCount = await Work.destroy({
        where: { id }, // 根据条件删除
      });
  
      if (deletedCount === 0) {
        return res.status(404).send({ error: `Work with ID ${id} not found` });
      }
  
      res.send({ message: `Work with ID ${id} deleted successfully.` });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };

const updateWorkTitle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, title_en } = req.body;
        const finalTitleEn = title_en || title;

        if (!title) {
            return res.status(400).send({ error: "Missing required fields: title" });
        }

        // 使用 Sequelize 的 update 方法
        const [updatedCount] = await Work.update(
            { title, title_en: finalTitleEn },
            { where: { id } }
        );

        const exist = await Work.findOne({ where: { id } });
        if (!exist) {
            return res.status(404).send({ error: `Work with ID ${id} not found.` });
        }

        res.send({ message: "Work title updated successfully.", title, title_en: finalTitleEn });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const updateWorkCover = async (req, res) => {
    try {
        const { id } = req.params;
        const { cover } = req.body;

        // 使用 Sequelize 的 update 方法
        const [updatedCount] = await Work.update(
            { cover },
            { where: { id } }
        );

        const exist = await Work.findOne({ where: { id } });
        if (!exist) {
            return res.status(404).send({ error: `Work with ID ${id} not found.` });
        }

        res.send({ message: "Work cover updated successfully.", cover });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const updateWorkCoverChar = async (req, res) => {
    try {
        const { id } = req.params;
        const { coverChar } = req.body;

        // 使用 Sequelize 的 update 方法
        const [updatedCount] = await Work.update(
            { coverChar },
            { where: { id } }
        );

        const exist = await Work.findOne({ where: { id } });
        if (!exist) {
            return res.status(404).send({ error: `Work with ID ${id} not found.` });
        }

        res.send({ message: "Work cover character updated successfully.", coverChar });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = { createWork, getAllWorks, getWork, deleteWork, updateWorkTitle, updateWorkCover, updateWorkCoverChar };
