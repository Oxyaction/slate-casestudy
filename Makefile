.PHONY: dev-start dev-stop clean test

# vars

DEV_DIRECTORY := docker/dev
DEV_COMPOSE_FILE := $(DEV_DIRECTORY)/docker-compose.yml
PROJECT := slate-cs

# tasks

test:
	echo $(CURDIR)

init:
	cd $(CURDIR)/order-service && npm i
	cd $(CURDIR)/payment-service && npm i

dev-start:
	docker-compose -p $(PROJECT) --project-directory $(DEV_DIRECTORY) -f $(DEV_COMPOSE_FILE) up

dev-stop:
	docker-compose -p $(PROJECT) --project-directory $(DEV_DIRECTORY) -f $(DEV_COMPOSE_FILE) stop

clean:
	docker-compose -p $(PROJECT) --project-directory $(DEV_DIRECTORY) -f $(DEV_COMPOSE_FILE) kill
	docker-compose -p $(PROJECT) --project-directory $(DEV_DIRECTORY) -f $(DEV_COMPOSE_FILE) rm -f -v
	docker rmi $(docker images -q -f dangling=true) 2>/dev/null || true