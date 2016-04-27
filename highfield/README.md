highfield
=========
###Structured flask with mongo
=========

**Install highfield and dependencies**
```
$ virtualenv .env
$ source .env/bin/activate
$ pip install Flask
$ pip install pymongo
$ pip install highfield
```
=========

**Start a highfield project**
```
$ python
>>> import highfield.build
>>> highfield.build.init()
>>> exit()

```
=========

**Set required config.py values**
```python
default_database_uri = 'mongodb://localhost:27017/'
default_database_name = 'highfield'
session_secret_key = '{{YOUR SECRET STRING}}'

routes = []
```
=========

**Start a server**
```python
from highfield.application import Application

app = Application()
app.run(network=True, debuge=True)
```
