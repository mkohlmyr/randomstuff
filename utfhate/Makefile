clean:
	find . -name \*.pyc -type f -delete
	find . -name \*~ -type f -delete

pypi:
	python setup.py register sdist bdist_egg upload
