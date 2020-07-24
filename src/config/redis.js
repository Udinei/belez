/** retorna a propriedade password para a configuração do Redis
    somente se estiver em ambiente de produção
    Nota: se o erro:  Ready check failed: NOAUTH Authentication required, for
    exibido no log, aguardar, pois o servidor heroku ira restartar a aplicação */
const ambiente = () => {
  if (process.env.NODE_ENV !== 'development')
      return 'password: process.env.REDIS_PASSWORD';
      return '';
}

// executa a funcao
const password_ = ambiente();
console.log("senha do redis: ", password_);

export default {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  //password: process.env.REDIS_PASSWORD, // incluir essa somente quando subir para o heroku
};




