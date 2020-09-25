import * as Yup from 'yup' // importando framewok de validação
import Contato from '../schemas/Contato';
//const mongoose = require('mongoose');
//const Contato = mongoose.model('Contato',ContatoSchema);

class ContatoController {

  async store(req, res){
    const {contatos, user_id, recordID } = req.body;

    const contactos = await Contato.create({
      contacts: contatos,
      user: user_id,
      recordID: recordID,
    });

    console.log('contatos.......', contactos);
    return res.json(contactos);
  }


  async index(req, res){
   const { user_id } = req.query;

   const filter ={ user: user_id}
   const  response = await Contato.find(filter);

   console.log(response.data);

   return res.json(response);
  }

}

export default new ContatoController();
