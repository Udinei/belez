/** retorna a propriedade password para a configuração do Redis
    somente se estiver em ambiente de produção
    Nota: se o erro:  Ready check failed: NOAUTH Authentication required, for
    exibido no log, aguardar, pois o servidor heroku ira restartar a aplicação */
/*
TODO: Ao tentar executar a funcao abaixo o O erro:
This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason:
ReplyError: Ready check failed: NOAUTH Authentication required.
ver possivel SOLUÇÃO nos sites:
   https://medium.com/@JonasJancarik/handling-those-unhandled-promise-rejections-when-using-javascript-async-await-and-ifee-5bac52a0b29f
   https://medium.com/@programadriano/utilizando-cache-com-redis-mongodb-e-node-js-8b3d6461b966
Solução paliativa: Comentar a linha da senha ao executar localmente o redis
const ambiente = () => {
  if (process.env.NODE_ENV !== 'development')
    return 'password: process.env.REDIS_PASSWORD';
    return '';

}*/

// executa a funcao
//const password_ = ambiente();
//console.log("..... redis password : ", password_);
var redis = require('redis');
var client = redis.createClient();


export default {
host: process.env.REDIS_URL,
//port: process.env.REDIS_PORT,
// a linha abaixo é necessaria para execução no heroku,
// que exige a senha nessa var. de ambiente, essa variavel esta setada no
// heroku
//password: process.env.REDIS_PASSWORD
};

/*
module.exports = {
  open: function () {

    var client = require('redis').createClient(process.env.REDIS_PORT, process.env.REDIS_URL);
    var client = require('redis').createClient(process.env.REDIS_URL);
    .selected_db = 1;

    client.on("error", function (err) {
      console.log("Error " + err);
    });

    client.on('connect', function () {
      console.log('Redis client connected');
    });

    return client;
  },
  close: function (client) {
    client.quit();
  }

};*/


