'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Works', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        defaultValue: '未命名作品'
      },
      title_en: {
        type: Sequelize.STRING,
        defaultValue: 'Untitled Work'
      },
      cover: {
        type: Sequelize.STRING,
        defaultValue: 'default.png',
      },
      coverChar: {
        type: Sequelize.STRING,
        defaultValue: 'default.png',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Works');
  }
};
