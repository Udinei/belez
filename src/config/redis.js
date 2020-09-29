/** Esse arquivo armazena os objetos de configuração do BD Redis
 *  para ambiente de desenvolvimento e produção, localmente o Redis
 * esta rodando no Docker REDIS_URL=127.0.0.1 e REDIS_PORT=6379 sem senha
*/

if (process.env.NODE_ENV === 'development') {
  export default {
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
  };

} else {
  export default {
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    //password: process.env.REDIS_PASSWORD,
  };
};
