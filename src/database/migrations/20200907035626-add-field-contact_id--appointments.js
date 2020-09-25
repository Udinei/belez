'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('appointments', 'contact_id', {
        type: Sequelize.INTEGER,  // tipo do campo
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('appointments', 'contact_id'),
    ];
  }
};
