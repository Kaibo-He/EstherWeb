'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Chapters', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      work_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Works', // 关联 Works 表
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING,
        defaultValue: '未命名章节'
      },
      title_en: {
        type: Sequelize.STRING,
        defaultValue: 'Untitled Chapter'
      },
      cover: {
        type: Sequelize.STRING,
        defaultValue: 'default.png'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Chapters');
  }
};
