'use strict';
const { Model, DataTypes } = require('sequelize');

class Chapter extends Model {
  static associate(models) {
    // 外键关联：Chapters -> Works
    Chapter.belongsTo(models.Work, {
      foreignKey: 'work_id',
      onDelete: 'CASCADE', // 删除 Work 时删除关联的 Chapters
    });

    // 外键关联：Chapters -> ChapterDetails
    Chapter.hasMany(models.ChapterDetail, {
      foreignKey: 'chapter_id',
      onDelete: 'CASCADE', // 删除 Chapter 时删除关联的 ChapterDetails
    });
  }
}

module.exports = (sequelize) => {
  Chapter.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      work_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        defaultValue: '未命名章节'
      },
      title_en: {
        type: DataTypes.STRING,
        defaultValue: 'Untitled Chapter'
      },
      cover: {
        type: DataTypes.STRING,
        defaultValue: 'uploads/default.png'
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize, // 传入 Sequelize 实例
      modelName: 'Chapter', // 模型名称
      tableName: 'Chapters', // 表名
      timestamps: false, // 禁用 Sequelize 自动管理的时间戳
    }
  );

  return Chapter;
};