'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoleUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
    }
  };
  RoleUser.init({
    UserId: DataTypes.UUID,
    RoleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RoleUser',
  });
  return RoleUser;
};