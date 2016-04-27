from highfield.errors import *

def hf_decorator(decorator, *args, **kwargs):
    def wrapper(*args, **kwargs):
        wrapped = decorator(*args, **kwargs)
        if hasattr(args[0], 'original'):
            wrapped.original = args[0].original
            pass
        else:
            wrapped.original = args[0]
            pass
        return wrapped
    return wrapper
