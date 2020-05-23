import jwt from 'jsonwebtoken';
import { promisify } from 'util'; // retorna um callback em funcao

import authConfig from '../../config/auth';

// Essa funcao  valida o token emviadp no header da requisicao
export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // 401 - nao autorizado
    return res.status(401).json({ error: 'Token not provided' });
  }
  const [, token] = authHeader.split(' ');

  try {
    // decodifica o token retornando os dados usados para gera-lo, id, data expiracao, etc..
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id; // coloca na requisição uma variavel userId com id do usuario authenticado

    return next(); // continua com a requisicao do programa

  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
}

