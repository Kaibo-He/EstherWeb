'use strict';
const { Model, DataTypes } = require('sequelize');

class Character extends Model {
  static associate(models) {
    // 外键关联：Characters -> Works
    Character.belongsTo(models.Work, {
      foreignKey: 'work_id',
      onDelete: 'CASCADE',
    });

    // 外键关联：Characters -> CharacterDetails
    Character.hasMany(models.CharacterDetail, {
      foreignKey: 'character_id',
      onDelete: 'CASCADE',
    });
  }
}

module.exports = (sequelize) => {
  Character.init(
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
      name: {
        type: DataTypes.STRING,
        defaultValue: '未命名角色'
      },
      name_en: {
        type: DataTypes.STRING,
        defaultValue: 'Untiteld Character'
      },
      cover: {
        type: DataTypes.STRING,
        defaultValue: 'uploads/defaultCha.png',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Character',
      tableName: 'Characters',
      timestamps: false,
    }
  );

  return Character;
};