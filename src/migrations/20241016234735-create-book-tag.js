'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BookTags', {
      bookId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Books',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      tagId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Tags',
          key: 'id'
        },
        onDelete: 'CASCADE'
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

    await queryInterface.addConstraint('BookTags', {
      fields: ['bookId', 'tagId'],
      type: 'primary key',
      name: 'pk_book_tag'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BookTags');
  }
};
