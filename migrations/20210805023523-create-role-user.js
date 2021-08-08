'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RoleUsers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
          as: 'UserId'
        }
      },
      RoleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Roles',
          key: 'id',
          as: 'RoleId'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('RoleUsers');
  }
};