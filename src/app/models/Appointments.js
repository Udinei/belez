import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointments extends Model {

  static init(sequelize) { // sequelize - tem a conexão com BD
    console.log('no server new date appointments.....', new Date());

    super.init(
      {
          date: Sequelize.DATE,
          canceled_at: Sequelize.DATE,
          past: { // nao sera gravado em banco, campo calculado com base na data atual(today), sera false se horario ja passou
             type: Sequelize.VIRTUAL,
             get() {
                return isBefore(this.date, new Date()); // se horario ja passou return true ou false
             }
          },
          cancelable: {
            type: Sequelize.VIRTUAL,
            get(){  // retorna true se não passou do horario de cancelar - pode ser cancelado até 30min antes
                return isBefore(new Date(), subHours(this.date, 2));// tira da hora atual, 2 horas, se ainda , se a hora agendada ainda não for menor, return true, ainda da para cancelar
            }
          },

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


