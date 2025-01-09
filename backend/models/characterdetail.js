'use strict';
const { Model, DataTypes } = require('sequelize');

class CharacterDetail extends Model {
  static associate(models) {
    // 外键关联：CharacterDetails -> Characters
    CharacterDetail.belongsTo(models.Character, {
      foreignKey: 'character_id',
      onDelete: 'CASCADE',
    });
  }
}

module.exports = (sequelize) => {
  CharacterDetail.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      character_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      detail: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      detail_en: {
        type: DataTypes.TEXT,
      },
      detail_type: {
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
      modelName: 'CharacterDetail',
      tableName: 'CharacterDetails',
      timestamps: false,
    }
  );

  return CharacterDetail;
};