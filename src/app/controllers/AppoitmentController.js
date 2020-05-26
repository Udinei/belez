import * as Yup from 'yup' // importando framewok de validação
import { startOfMinute, startOfHour, getMinutes, parseISO, isBefore } from 'date-fns';
import User from '../models/User';
import File from '../models/File';
import Appointments from '../models/Appointments';


class AppointmentsController {

  // listagens dos agendamentos
  async index(req, res){
   const appointments = await Appointments.findAll({
        where:{user_id: req.userId, canceled_at: null },
        order:['date'],
        attributes: ['id','date'],
        include:[
          {
            model: User,
            as: 'provider',
            attributes: ['id', 'name'],
            include: [
                {
                  model: File,
                  as:'avatar',
                  attributes: ['id', 'path', 'url'],
                }
            ]
          }
        ],
   });

   return res.json(appointments);

  }

  async store(req, res) {

    //console.log('dd' + provider_id);
    //console.log('ee' + date);

    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });


    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const { provider_id, date } = req.body;

    // verifica se existe um provider com o provider_id (paramentro)
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    // pega a data somente com o inicio da hora (sem minuto e segundo)
    const hourStart = startOfHour(parseISO(date));
    const minutos = getMinutes(new Date(date))
     console.log('minutos ' + minutos);

     // valida se o agendamento e de meia hora ou hora cheia
     if(minutos !== 30 && minutos !== 0){
       return res.status(400).json({ error: 'Agendamentos são permitidos a cada 30 minutos'})
     }

    // se a data for menor que a data atual
    if (isBefore(hourStart, new Date())) {
          return res.status(400).json({ error: 'Não é permitido datas passadas' })
    }
    console.log('verificando1..' + date);
    console.log('verificando2..' + hourStart);

    // verifica no BD se a data esta disponivel
    const checkAvailability = await Appointments.findOne({
      where: {
        provider_id,
        canceled_at: null,  // somente os que não foram cancelados
        date: date,
      },
    });

    // se
    if (checkAvailability) {
      return res.status(400).json({ error: 'Agendamento para esse dia e horario não esta disponivel' });
    }

    // provider nao encontrado
    if (!checkIsProvider) {
      return res.status(401)
        .json({ error: 'You can only create appoiments with providers' });
    }

    const appointments = await Appointments.create({
      user_id: req.userId,
      provider_id,
      date: date,
    });

    return res.json(appointments);
  }
}

export default new AppointmentsController();
