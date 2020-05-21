/** separar o server evita inicializar o servidor em outra porta, facilita os testes */
import app from './app';
app.listen(3333);