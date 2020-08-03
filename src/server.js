/** separar o server evita inicializar o servidor em outra porta, facilita os testes */
import app from './app';

// a var. env. process.env.PORT vem do servidor remoto (heroku), na maquina local usa porta 33
app.listen(process.env.PORT || 3333);
