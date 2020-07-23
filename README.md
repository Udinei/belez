## Diario de Dev

## Rotas url local
"base_url": "http://localhost:3333",


## instalando o Sequelize (ORM)
`yarn add sequelize`

## instalando o CLI interface de linha de comando do Sequelize (ORM) em desenvolvimento
`yarn add sequelize-cli -D`

## Configurando o sequelize.
Criado arquivo .sequelizerc na raiz do projeto com o conteudo abaixo de acesso ao BD.

const { resolve } = require('path');

module.exports = {
  config : resolve( __dirname, 'src', 'config', 'database.js'),
  'models-path' : resolve( __dirname, 'src', 'app', 'models'),
  'migrations-path' : resolve (__dirname, 'src', 'database', 'migrations'),
  'seeders-path' : resolve( __dirname, 'src', 'database', 'seeds')
};

## instalando as dependencias pg e pg-store usadas pelo dialect do postgres
`yarn add pg pg-store`

## criando migrations de usuarios
`yarn sequelize migration:create --name=create-users`

O comando acima vai gerar dentro da pasta migrations um arquivo com um nome de prefixo numerico aleatorio e o sufixo -create-users

## Rodando migrate com sequelize para gerar as tabela no BD
`yarn sequelize db:migrate`

Sera criado também a tabela SequelizeMeta que ira conter todas
as migrations que o banco ja rodou. Os comandos abaixo desfaz a migrations do BD:
`yarn sequelize db:migrate:undo` - desfaz a ultima migration executada no bd

`yarn sequelize db:migrate:undo:all` - desfaz toda as migrations executadas do bd

## Preparando o projeto para enviar para (PRODUÇÃO)
Adicionado os script build e start no package.json, que será executado automaticamente
pelo heroku, para gerar a pasta /dist

- sucrase gera o projeto para distribuição dist, informando que esta usando imports
 em vez de require(..) no projeto
~~~
"build": "sucrase ./src -d ./dist --transforms imports",
"start": "node dist/server.js"
~~~

## Rodando migrations no postgres do heroku (PRODUÇÃO)
`heroku run sequelize db:migrate --app belez-api`

As dependencias do sequelize devem ser instaladas como dependencias
de produção no package.json:

    "sequelize": "^5.21.10",
    "sequelize-cli": "^5.5.1",

### Erro ao rodar o comando acima
ERROR: there is no unique constraint matching given keys for referenced table "files"

O erro acima é foi corrigido pela adição do atributo ex:
`unique: true`
no campo de chave primaria no caso na tabela users
para uso correto pela migration de relacionamento ex:

~~~
return queryInterface.addColumn(
      'users',
      'avatar_id',{
      'references': { model: 'files', key: 'id'}
~~~

## Criado o arquivo config.json na pasta config para uso em produção
Conteudo:

~~~
{
  "development": {
    "database": "projectdb",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "database": "projectdb",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "use_env_variable": "DATABASE_URL"
  }
}
~~~




# Instalação da aplicação no AWS da amazon ou na maquina local


## Executando app back-end
Nota: Apos usar git clone para baixar o projeto,
 executar o comando abaixo para atualizar o node_modules :
`yarn`

## startar images docker (dev)
https://hub.docker.com/repository/docker/udinei/mongobelez
https://hub.docker.com/repository/docker/udinei/postgres11
https://hub.docker.com/repository/docker/udinei/redisbelez

Comando docker para startar as imagens (no terminal):
- docker ps (constainer que estão executando)
- docker ps -a  (listar idcontainer das imagens)
- docker start idcontainer

# startar o processamento de filas do redis em blackground via Queue (dev)
`yarn queue`

# Finalmente iniciar a app com: (dev)
 `yarn dev`

 ## Configuração do Redis
 ~~~
 export default {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
};
~~~
no file .env
~~~
# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
~~~

## Deploy no heroku (produção)
Pagina de referência:
https://medium.com/jaguaribetech/utilizando-heroku-postgres-nas-aplica%C3%A7%C3%B5es-ruby-on-rails-8ec6a382ab2f

# GERÊNCIA DE CONFIGURAÇÃO
## configuração de variaveis de ambiente
Nota: Ao adicionar ou excluir uma variavel de ambiente o heroku restarta a aplicação

site do heroku em: dasboard.heroku.com/apps/nomeapp/settings
> Reveal Config Vars

Nota: Todas as variaveis de ambiente do arquivo `.env` devem ser setadas com os valores gerados pelo heroku para acesso banco de dados.

## Configuração timeZone no Heroku
`heroku config:add TZ=America/Campo_Grande --app belez-api`

## Instalação do Heroku CLI - ver site abaixo:
https://devcenter.heroku.com/articles/heroku-cli

Através do Heroku CLI (Command Line Interface)
`heroku --version`   - heroku/7.38.0 win32-x64 node-v12.13.0 (minha versão atual)

`heroku login`
Logando no heroku Cli, vai abrir o browser para digitar a senha e logar no heroky sera exibida a msg abaixo:

 »   Warning: heroku update available from 7.38.0 to 7.42.4.
heroku: Press any key to open up the browser to login or q to exit:
Opening browser to https://cli-auth.heroku.com/auth/cli/browser/44e1b615-fce3-48cc-a85e-6bba1ef563f4
heroku: Waiting for login...
Logging in... done
Logged in as udineisilva@gmail.com

Fechar o browser e continuar no terminal

Listando base de dados postgres:
`heroku addons | grep -i POSTGRES`

## Criar arquivo Procfile na raiz do projeto e inserir o conteudo abaixo:
- start - para subir a aplicação
- queue - start da fila do redis

`web: yarn start queue`


# Configurando o MongoDB no heroku
Referência:
https://www.youtube.com/watch?v=2E8eWUHJaNg

## Matando processo no windows rodando na <porta>
`netstat -a -n -o | findstr <porta>`

Matando o processo <pid>:
`Taskkill /PID <pid> /F`

## visualizando logs da app no heroku
 `heroku logs --tail --app belez-api`

## Conectando ao postgres no heroku via Postbird
`<URI_do_postgres_no_heroku>?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory


# Dicas Geral
## VSCode
`Ctrl + Shift + H` - Para buscar qualquer ocorrencia do texto dentro do projeto no VSCode

## Arrow functions
https://2ality.com/2012/04/arrow-functions.html

~~~
   () => { ... } // no argument
   x => { ... } // one argument
   (x, y) => { ... } // several arguments
~~~
## Referências
http://revistapensar.com.br/tecnologia/pasta_upload/artigos/a95.pdf
