import Sequelize from 'sequelize';

import User from '../app/models/User'; // acessa model User

import databaseConfig from '../config/database'; // carrega configurações de acesso ao BD

const models = [User]; // array de models da app

class Database {
  constructor(){
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection)); // Realiza para cada Models do Array a conexao com o BD
  }
}

export default new Database();
