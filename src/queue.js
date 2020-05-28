/**
 * Esse arquivo é executado em outro terminal, para controle e execução
 * da fila sem interfirir na app, pode ser executado em outro servidor
 * e deve ser executao: yarn
 */
import Queue from './lib/Queue';

Queue.processQueue();
