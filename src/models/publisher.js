'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publisher extends Model {
    static associate(models) {
      // Thiết lập quan hệ 1-N với bảng Book
      this.hasMany(models.Book, { foreignKey: 'publisherId', onDelete: 'SET NULL' });
    }
  }
  Publisher.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Publisher',
  });
  return Publisher;
};