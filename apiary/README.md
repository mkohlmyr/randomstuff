# apiary

Build HTTP API clients with generators. Apiary will do the rest.

```python
from apiary.http import http
import base64

api_url = "http://example.com"

class Example(http):
    translator = http.json

    def __init__(self, *args, **kwargs):
        super(Example, self).__init__(*args, **kwargs)
        authorization = base64.b64encode("%s:%s" % ("username", "password"))
        self.authorization = ("Basic", authorization)
        self.uri = api_url

    @http.request
    def ping(self, **kwargs):
        yield ("path", "ping")
        yield ("query", kwargs)

ex = Example()
print ex.ping(hello="world")
```
```
http://example.com/ping?hello=world
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
User-Agent: Apiary/1.0
Accept: application/json
Content-Type: application/json
```
