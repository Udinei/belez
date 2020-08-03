/**
 * Essa classe grava na base de dados o nome do arquivo
 * e o path do arquvio de avatar do usuario
 */
import Filex from '../schemas/Filex';

class FilexController {

  async store(req, res) {
       // obtendo via(destruct) atributos do arquivo a fazer upload
    const { originalname: name, size , key, location: url = ""} = req.file;

    // criando collection Filex no mongodb
    const file = await Filex.create({
        name,
        size,
        key,
        url,
       });

      return res.json(file);

  }
}

export default new FilexController();
