import { Router } from 'express';

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

  routes.post('/users', UserController.store);
  routes.post('/sessions', SessionController.store);

  // somente as rotas abaixo dessa rota vao usar o middleware (authMiddleware) de forma global (chamado sempre que uma rota for requisitado)
  routes.use(authMiddleware);

  routes.put('/users', UserController.update);


//module.exports = routes;
export default routes;

/* codigo de testes
//import User from './app/models/User'; // teste
routes.get('/', async (req, res) => {
try {
  const user = await User.create({
     name: 'Martinha da Silva',
     email: 'martinha14@gmail.com',
     password_hash: '1234',
   });
  return res.json(user);

} catch (err){
  console.log(err.msg);
}
});
*/

