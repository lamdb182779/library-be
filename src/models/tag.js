'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      // Thiết lập quan hệ N-N với bảng Book qua bảng BookTag
      this.belongsToMany(models.Book, { through: 'BookTags', foreignKey: 'tagId', onDelete: 'CASCADE' });
    }
  }
  Tag.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    describe: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Tag',
  });
  return Tag;
};