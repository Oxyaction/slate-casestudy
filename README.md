# slate-casestudy

### Requirements

- docker
- docker-compose

### Development
`make dev-start` - starts development docker-compose with mounted microservices and nodemon, installs dependencies.  
`make dev-stop` - stops dev services

### CI Flow
`Test` -> `Build` -> `Tag` -> `Deploy images`  

Commands: 

`make test` - runs __e2e__ and __unit__ tests for __order__ and __payment__ services, compiles src code to dist  
`make build` - builds production images, preserving test stage consistency (base images, dependencies)  
`make tag` - tags built prod images with appropriate tags  
`make push` - pushes images to docker hub  
`make clean` - removes containers and dangling images and volumes  

### Features

- preserved base images and dependencies consistency
- easy managing via make
- probing postgres before e2e tests start to avoid race conditions

### Future improvements

- move config to injectable service
- separate order service and payment service to own repos
- autobuild docker images on push to github repo