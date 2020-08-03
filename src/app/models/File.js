import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) { // sequelize - tem a conexão com BD
    super.init({
      name: Sequelize.STRING,
      path: Sequelize.STRING,
      size: Sequelize.NUMBER,
      key: Sequelize.STRING,
      url: Sequelize.STRING,
    },
      {
        sequelize,
      }
    );

    // esse metodo é executando antes do metodo init
    this.addHook('beforeSave', async file => {
      // url vazia indica que o sistema esta operando localmente,
      if (!file.url) {
        // então preenche url com o endereco local
        file.url = `${process.env.APP_URL}/files/${file.key}`;
      }

    });

    return this;
  }
}

export default File;
