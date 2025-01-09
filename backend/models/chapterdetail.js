'use strict';
const { Model, DataTypes } = require('sequelize');

class ChapterDetail extends Model {
  static associate(models) {
    // 外键关联：ChapterDetails -> Chapters
    ChapterDetail.belongsTo(models.Chapter, {
      foreignKey: 'chapter_id',
      onDelete: 'CASCADE',
    });
  }
}

module.exports = (sequelize) => {
  ChapterDetail.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      chapter_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      content_en: {
        type: DataTypes.TEXT,
      },
      content_type: {
        type: DataTypes.ENUM('image', 'video', 'link', 'text'),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ChapterDetail',
      tableName: 'ChapterDetails',
      timestamps: false,
    }
  );

  return ChapterDetail;
};