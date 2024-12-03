'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      // Thiết lập quan hệ N-1 với bảng Publisher
      this.belongsTo(models.Publisher, { foreignKey: 'publisherId', onDelete: 'SET NULL' });
      // Thiết lập quan hệ N-N với bảng Author qua bảng BookAuthor
      this.belongsToMany(models.Author, { through: 'BookAuthors', foreignKey: 'bookId', onDelete: 'CASCADE' });
      // Thiết lập quan hệ N-N với bảng Tag qua bảng BookTag
      this.belongsToMany(models.Tag, { through: 'BookTags', foreignKey: 'bookId', onDelete: 'CASCADE' });
      // Thiết lập quan hệ N-N với bảng Position qua bảng BookPosition
      this.belongsToMany(models.Position, { through: 'BookPositions', foreignKey: 'bookId', onDelete: 'CASCADE' });
      // Thiết lập quan hệ N-N với bảng User qua bảng BookReader
      this.belongsToMany(models.User, { through: 'BookReaders', foreignKey: 'bookId', onDelete: 'CASCADE' });
    }
  }

  Book.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    publisherId: {
      type: DataTypes.STRING,
      references: {
        model: 'Publishers',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    image: DataTypes.STRING,
    describe: DataTypes.TEXT,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};