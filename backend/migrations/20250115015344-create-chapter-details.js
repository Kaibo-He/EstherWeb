'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ChapterDetails', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      chapter_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Chapters', // 关联 Chapters 表
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      content_en: {
        type: Sequelize.TEXT,
      },
      content_type: {
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
    await queryInterface.dropTable('ChapterDetails');
  }
};
