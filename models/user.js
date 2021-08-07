'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Role, { through: 'RoleUser' })
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    user_type: DataTypes.STRING,
    successful_transactions: DataTypes.INTEGER,
    email_verified_at: DataTypes.STRING,
    remember_token: DataTypes.STRING,
    shipping_address: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    billing_address: DataTypes.STRING,
    bank_name: DataTypes.STRING,
    account_number: DataTypes.STRING,
    account_verified: DataTypes.BOOLEAN,
    recipient_code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};