/**
+ Agendamentos disponiveis para o prestador de servico
*/
import {
  startOfDay, endOfDay, setHours,
  setMinutes, setSeconds, format, isAfter
} from 'date-fns';
import Appointment from '../models/Appointments';
import { Op } from 'sequelize';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'; // trata timezone
import User from '../models/User';

class AvailableController {

  async index(req, res) {
    // obtem a data desejada de agendamento
    const { date } = req.query; // data enviada no timezone do dispositivo

    // se a data nao foi informada
    if (!date) {
      return res.status(400).json({ error: 'Data inválida' });
    }

    // converte data em numero para usar na pesquisa
    const searchDate = Number(date);

    // retorna todos os agendamentos do provedor, para a data desejada
    // que nao estejam cancelados e esteja entre o inicio e o final do dia de hoje.
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        }
      }
    });

    // as datas serão formatadas em schedule: 2020-06-23 08:30
    const schedule = [
      '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
      '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
      '20:00',
    ];

    // insere value horas, minutos e segundos em avaiable
    const avaiable = schedule.map(time => {

      const [hor, minute] = time.split(':');

      // value = Data no formato 2020-08-13T20:00:00.914Z
      const value = setSeconds(
        setMinutes(setHours(searchDate, hor), minute), // insere, possiveis hora e minutos de agendamento na data desejada
        0
      );

      // retorna uma lista com todos os possiveis horários
      // a disponibilidade dos horarios sera calculada em avaiable no frontend
      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        avaiable: true,
      };
  });

    avaiable.push({'appointments': appointments});

    console.log('Time Zone do servidor......', Intl.DateTimeFormat().resolvedOptions().timeZone);
    return res.json(avaiable);
  }


  async getAppointmentsUser(req, res) {
    // obtem a data desejada de agendamento
    const { date } = req.query; // data enviada no timezone do dispositivo

    // se a data nao foi informada
    if (!date) {
      return res.status(400).json({ error: 'Data inválida' });
    }

    // converte data em numero para usar na pesquisa
    const searchDate = Number(date);

    // retorna todos os agendamentos do provedor, para a data desejada
    // que nao estejam cancelados e esteja entre o inicio e o final do dia de hoje.
    const appointmentsUser = await Appointment.findAll({
      where: {
        user_id: req.params.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        }
      },
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name'],
        }
        ]
    });

    return res.json(appointmentsUser);
  }

}
export default new AvailableController();
