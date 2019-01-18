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

DOCKER_REGISTRY ?= docker.io
ORG_NAME ?= oxyaction

# tasks

# init:
# 	cd $(CURDIR)/order-service && npm i
# 	cd $(CURDIR)/payment-service && npm i

dev-start:
	docker-compose -p $(DEV_PROJECT) --project-directory $(DEV_DIRECTORY) -f $(DEV_COMPOSE_FILE) up

dev-stop:
	docker-compose -p $(DEV_PROJECT) --project-directory $(DEV_DIRECTORY) -f $(DEV_COMPOSE_FILE) stop

clean:
	docker-compose -p $(DEV_PROJECT) --project-directory $(DEV_DIRECTORY) -f $(DEV_COMPOSE_FILE) kill
	docker-compose -p $(DEV_PROJECT) --project-directory $(DEV_DIRECTORY) -f $(DEV_COMPOSE_FILE) rm -f -v
	docker-compose -p $(TEST_PROJECT) --project-directory $(TEST_DIRECTORY) -f $(TEST_COMPOSE_FILE) kill
	docker-compose -p $(TEST_PROJECT) --project-directory $(TEST_DIRECTORY) -f $(TEST_COMPOSE_FILE) rm -f -v
	docker-compose -p $(PROD_PROJECT) --project-directory $(PROD_DIRECTORY) -f $(PROD_COMPOSE_FILE) kill
	docker-compose -p $(PROD_PROJECT) --project-directory $(PROD_DIRECTORY) -f $(PROD_COMPOSE_FILE) rm -f -v
	docker rmi $(docker images -q -f dangling=true) 2>/dev/null || true

test:
	# Ensure working with latest images
	docker-compose -p $(TEST_PROJECT) --project-directory $(TEST_DIRECTORY) -f $(TEST_COMPOSE_FILE) pull

	# Ensure building with latest base image (node) and used this cached image for consistency
	docker-compose -p $(TEST_PROJECT) --project-directory $(TEST_DIRECTORY) -f $(TEST_COMPOSE_FILE) build --pull order-test
	docker-compose -p $(TEST_PROJECT) --project-directory $(TEST_DIRECTORY) -f $(TEST_COMPOSE_FILE) build payment-test
	docker-compose -p $(TEST_PROJECT) --project-directory $(TEST_DIRECTORY) -f $(TEST_COMPOSE_FILE) build payment

	docker-compose -p $(TEST_PROJECT) --project-directory $(TEST_DIRECTORY) -f $(TEST_COMPOSE_FILE) up probe
	docker-compose -p $(TEST_PROJECT) --project-directory $(TEST_DIRECTORY) -f $(TEST_COMPOSE_FILE) run --rm order-test
	docker-compose -p $(TEST_PROJECT) --project-directory $(TEST_DIRECTORY) -f $(TEST_COMPOSE_FILE) run --rm payment-test

build:
	docker-compose -p $(TEST_PROJECT) --project-directory $(TEST_DIRECTORY) -f $(TEST_COMPOSE_FILE) build order-builder
	docker-compose -p $(TEST_PROJECT) --project-directory $(TEST_DIRECTORY) -f $(TEST_COMPOSE_FILE) up order-builder
	docker-compose -p $(TEST_PROJECT) --project-directory $(TEST_DIRECTORY) -f $(TEST_COMPOSE_FILE) build payment-builder
	docker-compose -p $(TEST_PROJECT) --project-directory $(TEST_DIRECTORY) -f $(TEST_COMPOSE_FILE) up payment-builder

prod:
	docker-compose -p $(PROD_PROJECT) --project-directory $(PROD_DIRECTORY) -f $(PROD_COMPOSE_FILE) build
	docker-compose -p $(PROD_PROJECT) --project-directory $(PROD_DIRECTORY) -f $(PROD_COMPOSE_FILE) up --no-start

tag:
	docker tag $(ORDER_IMAGE_ID) $(DOCKER_REGISTRY)/$(ORG_NAME)/order:latest
	docker tag $(PAYMENT_IMAGE_ID) $(DOCKER_REGISTRY)/$(ORG_NAME)/payment:latest

push:
	docker push order:latest
	docker push payment:latest

ORDER_CONTAINER_ID := $$(docker-compose -p $(PROD_PROJECT) --project-directory $(PROD_DIRECTORY) -f $(PROD_COMPOSE_FILE) ps -q order)
ORDER_IMAGE_ID := $$(docker inspect -f '{{ .Image }}' $(ORDER_CONTAINER_ID))

PAYMENT_CONTAINER_ID := $$(docker-compose -p $(PROD_PROJECT) --project-directory $(PROD_DIRECTORY) -f $(PROD_COMPOSE_FILE) ps -q payment)
PAYMENT_IMAGE_ID := $$(docker inspect -f '{{ .Image }}' $(PAYMENT_CONTAINER_ID))