// criando uma variavel para ter acesso a todas as funcçoes do yup,
import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

class UserController {

  async store(req, res) {

    // criando schema para validando dos campos do user
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6)
   });

   // valida o schema com os dados informados no bdy
   if(!(await schema.isValid(req.body))){
     return res.status(400).json({ error: 'Validação falhou' });
   }

    try {
      const userExists = await User.findOne({ where: { email: req.body.email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }

      // obtem do body com destruc somente os dados abaixo
      const { id, name, email, provider } = await User.create(req.body);

      // retorna somentes os dados obtidos no destruct acima
      return res.json({
        id,
        name,
        email,
        provider,
      });

      // obtem todos os dados enviados no body
      // const user = await User.create(req.body);
      // return res.json(user);

    } catch (err) {
      console.log(err);
    }
  }

  // altera dados do usuario
  async update(req, res) {
    try {

    // criando schema para validar os campos do user
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
      .min(6)
       // quando a senha antiga for passadao campo password(field)
       // é obrigatorio
      .when('oldPassword', (oldPassword, field) =>
           oldPassword ? field.required() : field
      ),
      // quando a password for preenchida então confirmePassword
      // é obrigatorio e ambos tem que ter o mesmo valor
      confirmPassword: Yup.string()
      .when('password', (password, field) =>
       password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
   });

   // valida o schema com os dados informados no bdy
   if(!(await schema.isValid(req.body))){
     return res.status(400).json({ error: 'Validation fails' });
   }

      // obtem da requisicao
      const { email, oldPassword } = req.body;

      const user = await User.findByPk(req.userId);// userId esta em req, obtem usuario por PrimaryKey

      // verifica se usuario esta mudadando de email
      if (email !== user.email) {
        const userExists = await User.findOne({ where: { email } });

        // verifica se ja existe um usuario com email, para qual se quer alterar
        if (userExists) {
          return res.status(400).json({ error: 'User already exists' });
        }
      }

      // se o usuario informou a senha antiga, verifica se a senha do usuario bate com o que ele tem cadastrado
      if (oldPassword && !(await user.checkPassword(oldPassword))) {
         return res.status(401).json({ error: 'Password does not match' });
      }


      // realiza a alteração e obtem os dados com  destruct
      //const { id, name, provider } = await user.update(req.body);
      await user.update(req.body);

      // busca usario pk + dados avatar
      const { id, name, avatar } = await User.findByPk(req.userId, {
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['id','path', 'url'],
          },
        ],
      });

      // retorna somente os dados obtidos no destruct
      return res.json({
        id,
        name,
        email,
        avatar,
      });


    } catch (err) {
      console.log(err);
    }
  }
}

export default new UserController();
