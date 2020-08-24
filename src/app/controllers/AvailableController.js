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


class AvailableController {

  async index(req, res) {
    // obtem a data desejada de agendamento
    const { date } = req.query; // data enviada no timezone do dispositivo
    const { timeZoneFront } = req.query; // data enviada no timezone do dispositivo

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

      // retorna uma lista com todos os possiveis horários, os que ja venceram hoje
      // em avaiable retorna false, e os horarios que vão vencer em
      // menos de meia retorna em avaiable true

      const dataTimeZoneFront = utcToZonedTime(new Date(), timeZoneFront);
      const valueTimeZoneFront = utcToZonedTime(value, timeZoneFront);
      const timeTimeZoneFront = format(valueTimeZoneFront, 'HH:mm');
      console.log('value......', value);
      console.log('valueTimeZoneFront......', dataTimeZoneFront);
      //  console.log('dataTimeZoneFront......',dataTimeZoneFront);
      //console.log('Hora ja passou......',isAfter(valueTimeZoneFront, dataTimeZoneFront))
      console.log('time......', time);
      console.log('agora vai......', isAfter(value, dataTimeZoneFront) && !appointments.find(a => format(zonedTimeToUtc(a.date, timeZoneFront), 'HH:mm') === time));
      console.log('agora vai.1111.....', appointments);

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        avaiable: true,
      };

      /*
       return {
         time,
         value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
         avaiable:
           isAfter(value, dataTimeZoneFront) &&  // se a data data agendada ja passou de hoje retorna false
           !appointments.find(a => format(a.date, 'HH:mm') === time),
         // se encontrar um agendamento para o horario(time) retorna false
       };*/




      /*return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        avaiable:
          isAfter(value, new Date()) &&  // se a data data agendada ja passou de hoje retorna false
          !appointments.find(a => format(a.date, 'HH:mm') === time),
        // se encontrar um agendamento para o horario(time) retorna false
      };*/

    });

    avaiable.push({'appointments': appointments});

    console.log('Time Zone do servidor......', Intl.DateTimeFormat().resolvedOptions().timeZone);
    return res.json(avaiable);
  }


  async getAppointments(req, res) {
    // obtem a data desejada de agendamento
    const { date } = req.query; // data enviada no timezone do dispositivo
    const { timeZoneFront } = req.query; // data enviada no timezone do dispositivo

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

    return res.json(appointments);
  }

}
export default new AvailableController();
