/** retorna a propriedade password para a configuração do Redis
    somente se estiver em ambiente de produção
    Nota: se o erro:  Ready check failed: NOAUTH Authentication required, for
    exibido no log, aguardar, pois o servidor heroku ira restartar a aplicação */
async function ambiente() {
  if (process.env.NODE_ENV !== 'development') {
    return {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    }

  } else {
    return {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }
  }
};

// executa a funcao
const configRedis = ambiente();

export default {
  configRedis
};




