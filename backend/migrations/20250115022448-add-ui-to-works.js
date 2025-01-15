'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Works', 'ui', {
      type: Sequelize.STRING, // 假设是字符串类型
      defaultValue: null,     // 设置默认值为 null
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Works', 'ui');
  }
};
