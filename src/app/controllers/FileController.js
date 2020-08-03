/**
 * Essa classe grava na base de dados o nome do arquivo
 * e o path do arquvio de avatar do usuario
 */
import File from '../models/File';

class FileController {

  async store(req, res) {

      // obtem com destruct de req.file: originalname e filename e atribui respectivamente
      // as variaveis name e  path
      //const { originalname: name, filename: path } = req.file;
      const { originalname: name, size , key, location: url = "", filename: path = key} = req.file;


      // nome e path vem do destruc
      const file = await File.create({
        name,
        path,
        size,
        key,
        url,
      });


       return res.json(file);
  }
}

export default new FileController();
