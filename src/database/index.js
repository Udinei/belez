import Sequelize from 'sequelize';

import User from '../app/models/User'; // acessa model User
import File from '../app/models/File';
import Appointments from '../app/models/Appointments';

import databaseConfig from '../config/database'; // carrega configurações de acesso ao BD

const models = [User, File, Appointments]; // array de models da app

// modela configuracao da base de dados
class Database {
  constructor(){
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
    .map(model => model.init(this.connection)) // Realiza para cada Models do Array a conexao com o BD
    .map(model => model.associate && model.associate(this.connection.models)); // salva a referencia de um id de arquvios(avatar) dentro de uma tabela, somente para os models que tem o metodo associate
  }
}

export default new Database();
