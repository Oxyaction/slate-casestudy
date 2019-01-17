.PHONY: dev-start dev-stop clean test

# vars

DEV_DIRECTORY := docker/dev
DEV_COMPOSE_FILE := $(DEV_DIRECTORY)/docker-compose.yml
DEV_PROJECT := slate-cs

TEST_DIRECTORY := docker/test
TEST_COMPOSE_FILE := $(TEST_DIRECTORY)/docker-compose.yml
TEST_PROJECT := slate-cs-test

PROD_DIRECTORY := docker/prod
PROD_COMPOSE_FILE := $(PROD_DIRECTORY)/docker-compose.yml
PROD_PROJECT := slate-cs-prod

# tasks

dev-start:
	docker-compose -p $(DEV_PROJECT) --project-directory $(DEV_DIRECTORY) -f $(DEV_COMPOSE_FILE) up

dev-stop:
	docker-compose -p $(DEV_PROJECT) --project-directory $(DEV_DIRECTORY) -f $(DEV_COMPOSE_FILE) stop

clean:
	docker-compose -p $(DEV_PROJECT) --project-directory $(DEV_DIRECTORY) -f $(DEV_COMPOSE_FILE) kill
	docker-compose -p $(DEV_PROJECT) --project-directory $(DEV_DIRECTORY) -f $(DEV_COMPOSE_FILE) rm -f -v
	docker-compose -p $(TEST_PROJECT) --project-directory $(TEST_DIRECTORY) -f $(TEST_COMPOSE_FILE) kill
	docker-compose -p $(TEST_PROJECT) --project-directory $(TEST_DIRECTORY) -f $(TEST_COMPOSE_FILE) rm -f -v
	docker-compose -p $(PROD_PROJECT) --project-directory $(PROD_DIRECTORY) -f $(TEST_COMPOSE_FILE) kill
	docker-compose -p $(PROD_PROJECT) --project-directory $(PROD_DIRECTORY) -f $(TEST_COMPOSE_FILE) rm -f -v
	docker rmi $(docker images -q -f dangling=true) 2>/dev/null || true

test:
	docker-compose -p $(TEST_PROJECT) --project-directory $(TEST_DIRECTORY) -f $(TEST_COMPOSE_FILE) build
	docker-compose -p $(TEST_PROJECT) --project-directory $(TEST_DIRECTORY) -f $(TEST_COMPOSE_FILE) up probe
	docker-compose -p $(TEST_PROJECT) --project-directory $(TEST_DIRECTORY) -f $(TEST_COMPOSE_FILE) up order-test
	docker-compose -p $(TEST_PROJECT) --project-directory $(TEST_DIRECTORY) -f $(TEST_COMPOSE_FILE) up payment-test

build:
	docker-compose -p $(TEST_PROJECT) --project-directory $(TEST_DIRECTORY) -f $(TEST_COMPOSE_FILE) up order-builder
	docker-compose -p $(TEST_PROJECT) --project-directory $(TEST_DIRECTORY) -f $(TEST_COMPOSE_FILE) up payment-builder

prod:
	docker-compose -p $(PROD_PROJECT) --project-directory $(PROD_DIRECTORY) -f $(PROD_COMPOSE_FILE) build
	docker-compose -p $(PROD_PROJECT) --project-directory $(PROD_DIRECTORY) -f $(PROD_COMPOSE_FILE) up
