﻿import Appointment from '../models/Appointments'
import User from '../models/User';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

class ScheduleController {
  async index(req, res){
    // verifica se o usuario existe como um prestador de servico
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });


    // usuario  nao é um prestador de serviço exibe msg
    if(!checkUserProvider){
       return res.status(401).json({ error: 'Usuario não é um prestador de seviço'})
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        }
      ],
      order: ['date'],
    });

    return res.json( { appointments } );

  }
}
export default new ScheduleController();
