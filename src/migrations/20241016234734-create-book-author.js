'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BookAuthors', {
      bookId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Books',
          key: 'id'
        },
        onDelete: 'CASCADE' // Khi xóa sách thì xóa luôn BookAuthor
      },
      authorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Authors',
          key: 'id'
        },
        onDelete: 'CASCADE' // Khi xóa tác giả thì xóa luôn BookAuthor
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
    await queryInterface.addConstraint('BookAuthors', {
      fields: ['bookId', 'authorId'],
      type: 'primary key',
      name: 'pk_book_author' // Tên của constraint
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BookAuthors');
  }
};
