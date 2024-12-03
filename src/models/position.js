'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Position extends Model {
    static associate(models) {
      // Thiết lập quan hệ N-N với bảng Book qua bảng BookPosition
      this.belongsToMany(models.Book, { through: 'BookPositions', foreignKey: 'positionId', onDelete: 'CASCADE' });
    }
  }
  Position.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Position',
  });
  return Position;
};