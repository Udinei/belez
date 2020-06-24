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
