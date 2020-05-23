'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('users', {
         id: {
           type: Sequelize.INTEGER,
           allowNull:false,
           autoIncrement:true,
           primarykey:true,
         },
         name: {
          type: Sequelize.STRING,
          allowNull:false,
         },
         email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: { args: true, msg: "Email already exists" },
         },
         password_hash: {
          type: Sequelize.STRING,
          allowNull: false,
         },
         provider: {    // false - usario, true - usuario é cliente
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
         },
         created_at: {
          type: Sequelize.DATE,
          allowNull:false,
         },
         updated_at: {
          type: Sequelize.DATE,
          allowNull:false,
         },
         });
  },

  down: queryInterface => {
    return queryInterface.dropTable('users');
  }
};
