'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BookReaders', {
      bookId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Books',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      readerId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      startedDate: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      expiredDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      isExtended: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isReturned: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      returnedDate: {
        type: Sequelize.DATE
      },
    });
    await queryInterface.addConstraint('BookReaders', {
      fields: ['bookId', 'readerId', 'startedDate'],
      type: 'primary key',
      name: 'pk_book_reader'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BookReaders');
  }
};