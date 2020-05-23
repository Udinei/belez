module.exports = {
   dialect: 'postgres',
   host: 'localhost',
   username: 'postgres',
   password:'docker',
   database: 'belez',
   port: 5433,
   define: {
     timestamps: true, // armazena a data de criação e edição dos registros
     underscored: true, // usar undescor em nome de tabelas
     underscoredAll: true,  // usar undescor em nome de campos
   },

};
