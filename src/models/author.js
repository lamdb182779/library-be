'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    static associate(models) {
      // Thiết lập quan hệ N-N với bảng Book qua bảng BookAuthor
      this.belongsToMany(models.Book, { through: 'BookAuthors', foreignKey: 'authorId', onDelete: 'CASCADE' });
    }
  }
  Author.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    describe: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Author',
  });
  return Author;
};