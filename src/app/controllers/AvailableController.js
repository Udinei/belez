/**
+ Agendamentos disponiveis para o prestador de servico
*/
import {
  startOfDay, endOfDay, setHours,
  setMinutes, setSeconds, format, isAfter
} from 'date-fns';
import Appointment from '../models/Appointments';
import { Op } from 'sequelize';
import { utcToZonedTime } from 'date-fns-tz'; // trata timezone


class AvailableController {

  async index(req, res) {
    // obtem a data desejada de agendamento
    const { date } = req.query;

    console.log('data do agendamento enviada....', date);

    const timeZone = 'America/Cuiaba';
    const compareDate = utcToZonedTime(new Date(), timeZone);

    // se a data nao foi informada
    if (!date) {
      return res.status(400).json({ error: 'Data inválida' });
    }

    // converte data em numero para usar em pesquisa
    const searchDate = Number(date);

    // retorna todos os agendamentos para para a data informada do provedor informado
    // que nao estejam cancelados e esteja entre as datas(hoje)
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

      // value - Data no formato 2020-08-13T20:00:00.914Z
      const value = setSeconds(
        setMinutes(setHours(searchDate, hor), minute), // formata data
        0
      );

      const dateAgendamento = utcToZonedTime(value, timeZone);

      console.log('value................', value);
      //console.log('utc timezoneNew Date.............', utcToZonedTime(new Date(), timeZone));
      console.log('data  Agendamento......', dateAgendamento);
      console.log('data hoje .............', compareDate);
      console.log('Data agend. ja passou?..', isAfter(dateAgendamento, compareDate));

      // retorna uma lista com os horarios que ja venceram hoje,
      // com avaiable = false, e os horarios que vão vencer em
      // menos de meia com avaiable=true
      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        avaiable:
          isAfter(value, compareDate) &&  // verifica se a data ja passou e
          !appointments.find(a => format(a.date, 'HH:mm') === time),
        // se horario de agendamento disponivel ainda nao passou
        // formata Hora:Minutos 10:30 para comparar a hora
      };

    });

    console.log(avaiable);

    //1590683489159
    return res.json(avaiable);
  }
}

export default new AvailableController();
