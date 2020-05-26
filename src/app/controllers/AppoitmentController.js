import * as Yup from 'yup' // importando framewok de validação
import User from '../models/User';
import Appointments from '../models/Appointments';

class AppointmentsController {
  async store(req, res) {
       console.log(req.body);
    //console.log('dd' + provider_id);
    //console.log('ee' + date);

    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });


    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error : 'validation fails'});
    }

    const { provider_id, date } = req.body;

    // verifica se existe um provider com o provider_id (paramentro)
     const checkIsProvider = await User.findOne({
       where: { id: provider_id, provider: true },
     });

    // provider nao encontrado
    if(!checkIsProvider){
      return res.status(401)
      .json({ error: 'You can only create appoiments with providers' });
    }

    const appointments = await Appointments.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    return res.json(appointments);
  }
}

export default new AppointmentsController();
