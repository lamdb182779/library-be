'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BookPositions', {
      bookId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Books',
          key: 'id'
        },
        onDelete: 'CASCADE' // Khi xóa sách thì xóa luôn BookPosition
      },
      positionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Positions',
          key: 'id'
        },
        onDelete: 'CASCADE' // Khi xóa vị trí thì xóa luôn BookPosition
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
    await queryInterface.addConstraint('BookPositions', {
      fields: ['bookId', 'positionId'],
      type: 'primary key',
      name: 'pk_book_position'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BookPositions');
  }
};
