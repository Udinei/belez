/**
 * Essa funcao trata o envio de imagem para o servidor informando
 * o local e nome de armazenamento do arquivo
 */
import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  // define como o arquivo de imagem sera armazenado
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'), // path local

    filename: (req, file, cb) => {
       crypto.randomBytes(16, (err, res) => {
         // se houve erro retorna uma funcao com o erro
         if(err) return cb(err);

         // se nao houve erro, retorna como nome do arquivo um hexadecimal mais a extensao do file original
         return cb(null, res.toString('hex') + extname(file.originalname));
       });
    },
  }),
};
