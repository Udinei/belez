/**
+ Agendamentos disponiveis para o prestador de servico
*/
import {
  startOfDay, endOfDay, setHours,
  setMinutes, setSeconds, format, isAfter
} from 'date-fns';
import Appointment from '../models/Appointments';
import { Op, DataTypes } from 'sequelize';

class AvailableController {

  async index(req, res) {

    const { date } = req.query;
    console.log(date);
    // se a data nao foi informada
    if (!date) {
      return res.status(400).json({ error: 'Data inválida' });
    }

    const searchDate = Number(date); // converte data para numero

    // retorna todos os agendamentos para o provedor informado
    // que nao estejam cancelados e esteja entre as datas
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
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
      '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '17:00',
      '17:30', '18:00', '18:30', '19:00', '19:30',
    ];

    // insere value horas, minutos e segundos em avaiable
    const avaiable = schedule.map(time => {

      const [hor, minute] = time.split(':');

      const value = setSeconds(
        setMinutes(setHours(searchDate, hor), minute), // formata data
        0
      );

      // retorna uma lista com os horarios que ja venceram hoje
      // com avaiable = false, e os horarios que vão vencer em
      // menos de meia com avaiable=true
      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        avaiable:
          isAfter(value, new Date()) &&  // isAfter verifica se o horario ja passou
          !appointments.find(a =>  // se encontra dentro de appointmets formata
            // emcontra a data de agenciamento
            format(a.date, 'HH:mm') === time),  //se a data for igual do vetor, formata Hora:Minutos 10:30
      };

    });

    //1590683489159
    return res.json(avaiable);
  }
}

export default new AvailableController();
