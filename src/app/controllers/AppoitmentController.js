﻿import * as Yup from 'yup' // importando framewok de validação
import { format, startOfHour, getMinutes, parseISO, isBefore, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt'
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointments';
import Notification from '../schemas/Notification';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';


class AppointmentsController {

  // listagens dos agendamentos
  async index(req, res) {
    const { page = 1 } = req.query; // se valor de page nao informado inicia page com 1

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'], // past =false se o horario ainda nao passou
      limit: 20, // qtd de registro da paginação
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
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

    // TODO: O usuario prestador de serviço nao pode agender um serviço pra si proprio

    // se usuario nao for um prestador de servico
    if (!checkIsProvider) {
      return res.status(401)
        .json({ error: 'Você não pode criar um agendamento como prestador de serviço' });
    }


    // pega a data somente com o inicio da hora (sem minuto e segundo)
    const hourStart = startOfHour(parseISO(date));
    const minutos = getMinutes(new Date(date))

    // valida se o agendamento e de meia hora ou hora cheia
    if (minutos !== 30 && minutos !== 0) {
      return res.status(400).json({ error: 'Agendamentos são permitidos a cada 30 minutos' })
    }

    // se a data for menor que a data atual
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Não é permitido datas passadas' })
    }
    // verifica no BD se a data esta disponivel
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,  // somente os que não foram cancelados
        date: date,
      },
    });

    // se data de agendamento nao disponivel
    if (checkAvailability) {
      return res.status(400).json({ error: 'Agendamento para esse dia e horario não esta disponivel' });
    }


    const appointments = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: date,
    });

    // recupera o usuario por id
    const user = await User.findByPk(req.userId);

    // formata data para exibição
    const formattedDate = format(
      parseISO(date),
      "'dia' dd 'de' MMMM', às' H:mm'h'", // ex. formatacao dia 22 de Junho, às 8:30h
      { locale: pt }
    );

    // notificando o provedor de servico
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointments);
  }

  async delete(req, res) {

    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        }
      ],
    });

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "Você não tem permissão para cancelar este agendamento."
      });
    }

    // retira duas horas da hora atual em (date)
    const dataWithSub = subHours(appointment.data, 2);

    // apos retirar duas horas do agendamento,
    // e comparar com a hora atual, e for menor que duas horas
    // do agendamento então nao pode mais cancelar o agendamento
    if (isBefore(dataWithSub, new Date())) {
      return res.status(401).json({
        error: 'Você não pode cancelar agendamentos com 2 horas antes do atendimento.',
      });
    }

    // se ainda estiver em tempo de cancelar, seta a data atual
    appointment.canceled_at = new Date();

    // salva o agendamento
    await appointment.save();

    // adicionando o agendadmento a fila Cancellation para controle do redis
    // o seu processamento
    await Queue.add(CancellationMail.key, {
        appointment,
    });

    // retorna o agendamento cancelado
    return res.json(appointment);
  }
}

export default new AppointmentsController();
