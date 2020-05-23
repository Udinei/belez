import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth'

class SessionController {
  async store(req, res){

    // criando schema para validando dos campos do user
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required()
   });

   // valida o schema com os dados informados no bdy
   if(!(await schema.isValid(req.body))){
     return res.status(400).json({ error: 'Validation fails' });
   }

    const { email, password } = req.body;

    // obtem usuario com o email passado do bd
    const user = await User.findOne({ where: { email }});

    // valida se o usuario existe
    if(!user){
      return res.status(401).json({ error: 'User not found'});
    }

    // valida se a senha foi passada corretamente
    if(!(await user.checkPassword(password))){
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user; // obtem id e nome do user

    // retorna os dados do usuario mais o token
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      }),
    });
  }
}

export default new SessionController();
