'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      successful_transactions: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      email_verified_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      remember_token: {
        allowNull: true,
        type: Sequelize.STRING
      },
      shipping_address: {
        allowNull: true,
        type: Sequelize.STRING
      },
      phone_number: {
        allowNull: false,
        type: Sequelize.STRING
      },
      billing_address: {
        allowNull: false,
        type: Sequelize.STRING
      },
      bank_name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      account_number: {
        allowNull: true,
        type: Sequelize.STRING
      },
      account_verified: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      recipient_code: {
        allowNull: true,
        type: Sequelize.STRING
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
    await queryInterface.dropTable('users');
  }
};