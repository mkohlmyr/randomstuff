import urlparse
import urllib2
import urllib
import json
import six
import xml.dom.minidom as minidom

class http(object):
    useragent = "Apiary/1.0"
    translator = NotImplemented

    def __init__(self, *args, **kwargs):
        pass

    class json(object):
        mime = 'application/json'

        @staticmethod
        def request(obj):
            return json.dumps(obj)

        @staticmethod
        def response(objstr):
            try:
                return json.loads(objstr)
            except ValueError as e:
                if 'No JSON object could be decoded' in e.message:
                    return None
                raise
        pass

    class xml(object):
        mime = 'application/xml'

        @staticmethod
        def request(xml):
            return xml.toprettyxml()

        @staticmethod
        def response(xmlstr):
            return minidom.parseString(xmlstr)
        pass

    class exceptions(object):
        handled = "http_exceptions_handled"

    @staticmethod
    def _consume(generator, dictionary):
        keys = dictionary.keys()
        for key, value in generator:
            if key in keys:
                if isinstance(value, tuple):
                    dictionary[key].append(value)
                elif isinstance(value, dict):
                    dictionary[key].extend(value.items())
                elif isinstance(value, list):
                    dictionary[key].extend(value)
                continue
            dictionary[key] = value
        pass

    @staticmethod
    def _compose_uri_query(uri, query):
        if not query or not any(query):
            return uri
        parsed = urlparse.urlparse(uri)
        query = urllib.urlencode(query)
        if parsed.query:
            query = "&".join([parsed.query, query])
        parsed = parsed._replace(query=query)
        return urlparse.urlunparse(parsed)

    @staticmethod
    def _compose_uri_path(uri, path):
        if not path or not len(path):
            return uri
        parsed = urlparse.urlparse(uri)
        if parsed.path.endswith("/"):
            path = "%s%s" % (parsed.path, path)
        else:
            path = "%s/%s" % (parsed.path, path)
        parsed = parsed._replace(path=path)
        return urlparse.urlunparse(parsed)

    @staticmethod
    def _compose_auth(auth):
        if isinstance(auth, six.string_types):
            auth = tuple(auth.split(" "))
        if not isinstance(auth, tuple):
            raise TypeError("authorization must be string or tuple")
        return "%s %s" % (auth[0], auth[1])

    @staticmethod
    def _obj_then_dict(obj, dictionary, field, do):
        if hasattr(obj, field) and getattr(obj, field):
            do(getattr(obj, field))
        if field in dictionary:
            do(dictionary.get(field))

    @staticmethod
    def _set_authorization(request):
        def do(v):
            request.add_header("Authorization", http._compose_auth(v))
        return do

    @staticmethod
    def _set_headers(request):
        def do(v):
            for field, value in v:
                request.add_header(field, value)
        return do

    @staticmethod
    def request(impl):
        def wrapper(api, *args, **kwargs):
            generator = impl(api, *args, **kwargs)
            generated = {"headers": [],
                         "params": []}

            klass = api.__class__
            klass._consume(generator, generated)

            if "uri" not in generated and not getattr(api, "uri", None):
                raise KeyError("http request requires an endpoint uri")
            uri = generated.get("uri", api.uri)
            uri = klass._compose_uri_path(uri, generated.get("path"))
            uri = klass._compose_uri_query(uri, generated.get("query"))

            (request, transform) = (urllib2.Request(uri), generated.get("transform", lambda x: x))

            request.add_header("User-Agent", getattr(klass, "useragent"))
            for header in ["Accept", "Content-Type"]:
                request.add_header(header, klass.translator.mime)
            klass._obj_then_dict(api, generated, "authorization", klass._set_authorization(request))
            klass._obj_then_dict(api, generated, "headers", klass._set_headers(request))

            if "data" in generated:
                request.add_data(klass.translator.request(generated["data"]))
            try:
                response = urllib2.urlopen(request).read()
            except Exception as e:
                if getattr(klass, "exceptions", False) is http.exceptions.handled:
                    if isinstance(e, urllib2.HTTPError):
                        http_error_slug = "http_%s" % e.msg.lower().replace(" ", "_")
                        def closure(fname):
                            def closed(*args, **kwargs):
                                raise NotImplementedError("%s not implemented" % fname)
                        handler = getattr(api, http_error_slug, closure(http_error_slug))
                        if "exceptions" in generated:
                            handler = generated["exceptions"]
                        data = klass.translator.response(e.read())
                        return handler(e, data=data, source=impl.__name__)
                    raise e
                raise e
            return transform(klass.translator.response(response))
        return wrapper
    pass
