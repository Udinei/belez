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

//export default {
//  host: process.env.REDISTOGO_URL || '127.0.0.1',
//  port: process.env.REDIS_PORT || 6379,
  // a linha abaixo é necessaria para execução no heroku,
  // que exige a senha nessa var. de ambiente, essa variavel esta setada no
  // heroku
  //password: process.env.REDIS_PASSWORD
//};

var Redis = require("redis");

module.exports = {
  open: function() {
    //var client = Redis.createClient(process.env.REDIS_PORT || 6379, process.env.REDIS_URL || '127.0.0.1');
    var client = require('redis').createClient(process.env.REDIS_URL);
    client.selected_db = 1;

    return client;
  },
  close: function(client) {
    client.quit();
  }
};


