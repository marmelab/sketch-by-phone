install:
	npm install

start:
	npm start

build:
	npm run build

deploy: build
	cd dist && now --public
