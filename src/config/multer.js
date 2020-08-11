/** Esse arquivo configura o objeto de retorno do multer
 *  multer - permite a manipulação, envio de arquivos via http (image, text etc..)
 * cb  - funcao callback do multer, retorna o objeto com as informações do arquivo

 ex: Do objeto que a cb do multer vai retornar no response:
{
    fieldname: 'file',
    originalname: 'foto_face.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: 'E:\\workspace-dev\\uploadexemplo\\uploadfilebackend\\tmp\\uploads',
    filename: 'f2860f9fd73d1bc88f5b5d13727df13a-foto_face.jpg',
    path: 'E:\\workspace-dev\\uploadexemplo\\uploadfilebackend\\tmp\\uploads\\f2860f9fd73d1bc88f5b5d13727df13a-foto_face.jpg',
    size: 6164
  }

  */

 const multer = require('multer');
 const path = require('path');    // vem do node.js, usado para cria path no disco local
 const crypto = require('crypto'); // vem do node.js, usado para gerar caracteres aleatorios
 const aws = require('aws-sdk');    // contem as libs de integração com a AWS
 const multerS3 = require('multer-s3'); // provider de integração entre o multer e S3

 // constantes de objetos de storage local ou remoto(S3)
 const storageTypes = {
     local: multer.diskStorage({ // local no disk para onde sera enviado o file,
         // file - arquivo selecionando
         destination: (req, file, cb) => {
             cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads')); // retorna o endereço completo onde foi salvo o novo arquivo salvo em tmp/uploads na app
         },
         filename: (req, file, cb) => { // tratamento para novo nome do arquivo,para evitar sobreposição do file
             crypto.randomBytes(16, (err, hash) => { // gera 16 bytes de caracteres aleatorios e coloca em hash
                 if (err) cb(err); // se erro retorna callback cb do multer com erro pra tratamento pelo controler

                 file.key = `${hash.toString('hex')}-${file.originalname}`; // concatena hash gerado com onome do file e cria um novo nome para o file
                 cb(null, file.key); // cb do multer retorna o novo nome do arquivo a ser salvo
             })
         },
     }),
     s3: multerS3({
         s3: new aws.S3(), // le automaticamente as variaveis de ambiente do S3 no file .env
         bucket: process.env.BUCKET_S3,   // nome do bucket
         contentType: multerS3.AUTO_CONTENT_TYPE, // obtem contentType de forma automatica
         acl: 'public-read',            // aceita public somente leitura
         key: (req, file, cb) => { // file - informado no corpo da requisicao (selecionado pelo usuario)
             crypto.randomBytes(16, (err, hash) => { // gera 16 bytes de caracteres aleatorios e coloca em hash
                 if (err) cb(err); // se erro retorna callback cb do multer com erro pra tratamento pelo controler

                 const fileName = `${hash.toString('hex')}-${file.originalname}`; // concatena hash gerado com onome do file e cria um novo nome para o file
                 cb(null, fileName); // cb do multer retorna o novo nome do arquivo a ser salvo
             });
         }
     })
 }

 // configura multer
 module.exports = {
     dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'), // __dirname - se refere ao diretorio config, dest - path na maquina local, para onde as imagens seram enviadas
     storage: storageTypes[process.env.STORAGE_TYPE],
     limits: {
         fileSize: 2 * 1024 * 1024, // tamanho maximo do arquivo em bytes
     },
     fileFilter: (req, file, cb) => {  // file - nome, tipo do arquivo. cb - funcao callback a ser executa apos o upload  cb(erro, true) -
         // allowedMimes - filtro de tipos de arquivos aceitaiveis
         const allowedMimes = [
             'image/jpeg',
             'image/pjpeg',
             'image/png',
             'image/gif'
         ];
         // se o arquivo selecionado esta contido no filtro acima
         if (allowedMimes.includes(file.mimetype)) {
             cb(null, true); // ocorreu tudo bem retorna os dados do arquivo. Err recebe null (primeiro param é o err)
         } else {
             // aconteceu um erro, retorna msg
             cb(new Error("Invalid file type."))
         }
     },
 };

