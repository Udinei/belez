require('dotenv/config')

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  timezone: process.env.TIME_ZONE,
  port: process.env.DB_PORT,
  define: {
    timestamps: true, // armazena a data de criação e edição dos registros
    underscored: true, // usar undescor em nome de tabelas
    underscoredAll: true,  // usar undescor em nome de campos
  },
  dialectOptions: {
    useUTC: false, //for reading from database
  },
};
