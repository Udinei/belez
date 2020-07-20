# belez
Executando app back-end

# Apos git clone para atualizar o node_modules usar:
`yarn`

# startar images docker
https://hub.docker.com/repository/docker/udinei/mongobelez
https://hub.docker.com/repository/docker/udinei/postgres11
https://hub.docker.com/repository/docker/udinei/redisbelez

Comando docker para startar as imagens (no terminal):
- docker ps (constainer que estão executando)
- docker ps -a  (listar idcontainer das imagens)
- docker start idcontainer

# startar o processamento de filas do redis em blackground via Queue
`yarn queue`

# Finalmente iniciar a app com:
 `yarn dev`

## Deploy no heroku
Pagina de referência:
https://medium.com/jaguaribetech/utilizando-heroku-postgres-nas-aplica%C3%A7%C3%B5es-ruby-on-rails-8ec6a382ab2f

Instalação do Heroku CLI - ver site abaixo:
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

Criar arquivo Procfile na raiz do projeto e inserir o conteudo abaixo:
web: yarn start

# configurando o MongoDB no heroku
Referência:
https://www.youtube.com/watch?v=2E8eWUHJaNg
