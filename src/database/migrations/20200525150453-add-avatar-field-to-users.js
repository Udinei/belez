'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',       // nome da tabela que vai receber a chave estrangeira
      'avatar_id',{  // nome do campo na tabela users que contera a chave estrangeira
        type: Sequelize.INTEGER,  // tipo do campo
        references: { model: 'files', key: 'id'}, // tabela origem, e campo estrangeiro
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      });
    },

  // se fizer rollback esse queryinterface sera executado
  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
