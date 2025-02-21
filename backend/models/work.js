'use strict';
const { Model, DataTypes } = require('sequelize');

class Work extends Model {
  static associate(models) {
    // 外键关联：Works -> Chapters
    Work.hasMany(models.Chapter, {
      foreignKey: 'work_id',
      onDelete: 'CASCADE',
    });

    // 外键关联：Works -> Characters
    Work.hasMany(models.Character, {
      foreignKey: 'work_id',
      onDelete: 'CASCADE',
    });
  }
}

module.exports = (sequelize) => {
  Work.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        defaultValue: '未命名作品'
      },
      title_en: {
        type: DataTypes.STRING,
        defaultValue: 'Untitled Work'
      },
      cover: {
        type: DataTypes.STRING,
        defaultValue: 'uploads/default.png'
      },
      coverChar: {
        type: DataTypes.STRING,
        defaultValue: 'uploads/default.png'
      },
      music: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      ui: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Work',
      tableName: 'Works',
      timestamps: false,
    }
  );

  return Work;
};