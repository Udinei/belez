import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ContatoController from './app/controllers/ContatoController'

import authMiddleware from './app/middlewares/auth';
import ProviderController from './app/controllers/ProviderController';
import AppoitmentController from './app/controllers/AppoitmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController'
import AvailableController from './app/controllers/AvailableController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// rota de testes de action criadas no buddy
routes.get('/', (req, res) => res.send('ok agora vai....'));


// somente as rotas abaixo dessa rota vao usar o middleware (authMiddleware) de forma global (chamado sempre que uma rota for requisitado)
routes.use(authMiddleware);

// usuarios do sistema
routes.put('/users', UserController.update);

routes.post('/contatos', ContatoController.store);

routes.get('/contatos', ContatoController.index);

// usuarios prestadores de servico
routes.get('/providers', ProviderController.index);

// lista todos os horarios disponiveis para o prestador de serviço especifico
routes.get('/providers/:providerId/available', AvailableController.index);

// lista todos os horarios disponiveis para o contato especifico
routes.get('/contacts/:contactId/available', AvailableController.getAppointmentsContact);

// lista todos os horarios disponiveis para o prestador de serviço especifico
routes.get('/users/:userId/available', AvailableController.getAppointmentsUser);


// listgem de agendamentos provider
routes.get('/appoitments', AppoitmentController.index);

// listgem de agendamentos contatos
routes.get('/appoitments/contacts', AppoitmentController.indexContact);

// criar agendamentos
routes.post('/appoitments', AppoitmentController.store);

// cancelar agendamento
routes.delete('/appoitments/:id', AppoitmentController.delete);

// recuperar cronograma da agenda
routes.get('/schedule', ScheduleController.index);

routes.get('/notifications', NotificationController.index);

// alterar a leitura das notificação
routes.put('/notifications/:id', NotificationController.update);

// trata emvio de imagens
//routes.post('/files', upload.single('file'), FileController.store);
routes.post('/files', upload.single("file"), FileController.store);


// multer - middlware que pode carregar um arquivo a ser enviado como parametro da requisicao
// multerConfig -
// .single("file") - permite enviar somente um arquivo a cada requisicao
//routes.post('/files', uploadx.single("file"), FilexController.store);


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

