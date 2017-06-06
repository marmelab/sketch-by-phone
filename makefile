.PHONY: build
install:
	npm install

start:
	npm start

build:
	npm run build

deploy: build
	now ./build --public --name sketch-by-phone
