'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('CharacterDetails', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      character_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Characters', // 关联 Characters 表
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      detail: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      detail_en: {
        type: Sequelize.TEXT,
      },
      detail_type: {
        type: Sequelize.ENUM('image', 'video', 'link', 'text'),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('CharacterDetails');
  }
};
