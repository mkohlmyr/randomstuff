requirements:
	npm install

clean:
	rm -rf node_modules
	find . -name \*~ -type f -delete
	rm dist/*

prepare:
	npm install
	gulp build
	rm -rf node_modules
	find . -name \*~ -type f -delete
