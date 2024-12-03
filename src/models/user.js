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
      // Thiết lập quan hệ N-N với bảng User qua bảng BookReader
      this.belongsToMany(models.Book, { through: 'BookReaders', foreignKey: 'readerId', onDelete: 'CASCADE' });
    }
  }
  User.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    role: DataTypes.INTEGER,
    image: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};