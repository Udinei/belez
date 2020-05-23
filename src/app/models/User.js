import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) { // sequelize - tem a conexão com BD
    super.init({
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.VIRTUAL, // esse campo nao sera persistido no bd
      password_hash: Sequelize.STRING,
      provider: Sequelize.BOOLEAN,
    },
    {
      sequelize,
    }
    );

    // esse metodo é executando antes do metodo init
    this.addHook('beforeSave', async user =>{
      if(user.password){
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // metodo de validação de senha criptografada com bcrypt
  // retorna true se senha ok
  checkPassword(password){
    return bcrypt.compare(password, this.password_hash);
  }
}
 export default User;


