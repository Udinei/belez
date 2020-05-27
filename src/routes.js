﻿import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';
import ProviderController from './app/controllers/ProviderController';
import AppoitmentController from './app/controllers/AppoitmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController'

const routes = new Router();
const upload = multer(multerConfig);

  routes.post('/users', UserController.store);
  routes.post('/sessions', SessionController.store);

  // somente as rotas abaixo dessa rota vao usar o middleware (authMiddleware) de forma global (chamado sempre que uma rota for requisitado)
  routes.use(authMiddleware);

  // usuarios do sistema
  routes.put('/users', UserController.update);

  // usuarios prestadores de servico
  routes.get('/providers', ProviderController.index);

  // listgem de agendamentos
  routes.get('/appoitments', AppoitmentController.index);

  // agendamentos
  routes.post('/appoitments', AppoitmentController.store);

  routes.get('/schedule', ScheduleController.index);

  routes.get('/notifications', NotificationController.index);

  // alterar a leitura das notificação
  routes.put('/notifications/:id', NotificationController.update);

  // trata emvio de imagens
  routes.post('/files', upload.single('file'), FileController.store);


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

