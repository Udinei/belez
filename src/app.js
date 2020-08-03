import 'dotenv/config'; // coloca todas variaveis de ambiente do node em process.env.NAME_VAR

import express from 'express';
import path from 'path';
import cors from 'cors';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

import routes from './routes';
import sentryConfig from './config/sentry';

import './database'; // habilitando a app a acessar o BD

class App {

    // metodo construtor, chamada apenas uma vez
    constructor(){
         this.server = express();
         Sentry.init(sentryConfig); // start Sentry conexao

         this.middlewares();
         this.routes(); // permite acesso a rotas
         this.exceptionHandler();
    }

    // registra todos os middlewares da app
    middlewares(){
       this.server.use(Sentry.Handlers.requestHandler()); // config. monitoração de erros via site na web
       this.server.use(cors()); // permite qualquer endereco acessar a aplicação (dev)
       this.server.use(express.json()); // permite usar estruturas de dados json no express

       // liberando ao express acesso local a arquivos estaticos
       this.server.use('/files',
       express.static(path.resolve(__dirname, '..', 'tmp', 'uploads' ))
       );
    };

    // middleware de rotas
    routes(){
      this.server.use(routes);
      this.server.use(Sentry.Handlers.errorHandler());
    }
     // middlawer de tratamento de execçoes
    exceptionHandler(){
      this.server.use(async (err, req, res,next) =>{

        // exibe mensagens de erro somente em desenvolvimento
        if(process.env.NODE_ENV === 'development'){
             const errors = await new Youch(err, req).toJSON();
            return res.status(500).json(errors);
        }
        // em produção os erros devem ser exibidos no Sentry
        return res.status(500).json({error: 'Internal Server Error'});
       });
    }
}

//module.exports = new App().server;
export default new App().server; // server - umico que pode ser exportado da classe
