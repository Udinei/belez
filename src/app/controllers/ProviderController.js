import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [  //estabelece relacionamento com File que armazena os dados de avatar (name, path, url, etc..) do user
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

   // console.log('provedores.....', providers);
    res.json(providers);
  }



}
export default new ProviderController();
