/**
 * Essa classe controla as filas de requisições blackground
 */

import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

// todo jobs dever importado e colocado nesse array de fila de trabalho
const jobs = [CancellationMail];


class Queue {
  constructor() {
    this.queues = {}; // queues fila de jobs

    this.init();
  }

  init() {

    // inicializando criando uma fila pra cada job, com chave e valor
    jobs.forEach(({ key, handle }) => {
          this.queues[key] = {
        bee: new Bee(key, { redis: redisConfig, }), // bee instancia que conecta com o redis
        handle, // funcao que ira enviar o email
      };
    });
  }

  // adicionando itens de jobs na fila
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save(); // salva o job na fila informada
  }

  // processa o jobs in backgroud
  processQueue(){

    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.process(handle); // processa o envio do email
    });
  }
}

export default new Queue();
