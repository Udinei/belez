'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('files', 'url', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('files', 'key', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('files', 'size', {
        type: Sequelize.INTEGER,
        allowNull: true,
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('files', 'url'),
      queryInterface.removeColumn('files', 'key'),
      queryInterface.removeColumn('files', 'size')
    ];
  }
};
