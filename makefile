.PHONY: build
install:
	npm install

start:
	npm start

build:
	npm run build

deploy:
	now ./build --public
