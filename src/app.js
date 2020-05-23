import express from 'express';
import routes from './routes';
import './database'; // habilitando a app a acessar o BD

class App {

    // metodo construtor, chamada apenas uma vez
    constructor(){
         this.server = express();

         this.middlewares();
         this.routes(); // permite acesso a rotas
    }

    // registra todos os middlewares da app
    middlewares(){
       this.server.use(express.json()); // permite usar estruturas de dados json no express

    }

    // middleware de rotas
    routes(){
      this.server.use(routes);
    }
}

//module.exports = new App().server;
export default new App().server; // server - umico que pode ser exportado da classe
