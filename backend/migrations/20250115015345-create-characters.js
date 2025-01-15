'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Characters', {
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
      name: {
        type: Sequelize.STRING,
        defaultValue: '未命名角色'
      },
      name_en: {
        type: Sequelize.STRING,
        defaultValue: 'Untiteld Character'
      },
      cover: {
        type: Sequelize.STRING,
        defaultValue: 'default.png',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      page: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Characters');
  }
};
