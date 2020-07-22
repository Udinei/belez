/** retorna a propriedade password para a configuração do Redis
    somente se estiver em ambiente de produção */
const ambiente = () => {
  if (process.env.NODE_ENV !== 'development')
      return 'password: process.env.REDIS_PASSWORD';
      return '';
};

const password_ = ambiente();

export default {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password_
};




