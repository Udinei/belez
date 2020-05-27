import User from '../models/User';
import Notification from '../schemas/Notification'


class NotificationController {

    async index(req, res) {
    // verifica se existe um provider com o provider_id (paramentro)
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    // se usuario nao for um prestador de servico
    if (!checkIsProvider) {
      return res.status(401)
        .json({ error: 'Você não pode visulizar notificações' });
    }

    // find - retorna varias notificacoes
    const notifications = await Notification.find({
      user: req.userId,
    }).sort( { createdAt: 'desc' }).limit(20); // ordenadas pela data de criação


      return res.json(notifications)
  }

  async update(req, res){
       // consulta com mongosse, encontra e atualiza o registro ao mesmo tempo
       const notification = await Notification.findByIdAndUpdate(
         req.params.id,
         { read: true },
         { new: true } // atualiza e retorna o registro
       );

       return res.json(notification);
  }

}

export default new NotificationController();
