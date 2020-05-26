import Sequelize, { Model } from 'sequelize';

class Appointments extends Model {
  static init(sequelize) { // sequelize - tem a conexão com BD
    super.init(
      {
          date: Sequelize.DATE,
          canceled_at: Sequelize.DATE
      },
      {
        sequelize,
      }
    );
    return this;
  }
    // essa funcao implementa todos os metodos de relacionamentes da classe
    static associate(models){
      this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
    }
}
export default Appointments;


