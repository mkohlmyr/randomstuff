from flask import Flask
from highfield import loading
from highfield.errors import ValidationError
from highfield.settings import settings
from highfield.helpers.random import unique_id

def csrf(func):
    def wrapper(*args, **kwargs):
        controller = args[0]
        csrf_token = controller.session.get('csrf_token')
        csrf_expires = int(controller.session.get('csrf_expires', 0))
        csrf_token_expired = False
        if not (csrf_token and csrf_expires) or csrf_expires < controller.timestamp:
            if csrf_token:
                csrf_token_expired = True
            lifespan = controller.app.settings.sessions.csrf_token_lifespan
            controller.session.update(csrf_token=unique_id(24),
                                      csrf_expires=timestamp + lifespan)
        if controller.post:
            if controller.form.get('csrf_token') != csrf_token:
                if csrf_token_expired:
                    string = 'The form timed out before submission as a security measure. Please try again.'
                else:
                    string = 'The form submission token did not match the session. Submision was stopped as a security measure.'
                raise ValidationError({controller.model.canonical_name: string})
        controller.context.update(csrf_token=controller.session['csrf_token'])
        return func(*args, **kwargs)
    return wrapper

class Application(Flask):

    def __init__(self, routes):
        template_folder = loading.path('views')
        static_folder = loading.path('static')
        super(Application, self).__init__(__name__,
                                          template_folder=template_folder,
                                          static_folder=static_folder)

        self.configure(routes)

        self.session_cookie_name = self.settings.sessions.cookie_name
        self.secret_key = self.settings.sessions.secret_key
        pass

    def configure(self, routes):
        self.settings = settings

        self.controllers = loading.namespace('controllers')
        self.models = loading.namespace('models')

        for (path, route, methods) in routes:
            c_name, a_name = route.split('.')
            methods = [m.upper() for m in methods]

            def closure(c_name, a_name):
                def dispatch(*args, **kwargs):
                    controller = getattr(self.controllers, c_name)(self, a_name)
                    try:
                        return csrf(getattr(controller, a_name)).__call__(*args, **kwargs)
                    except ValidationError as e:
                        controller.context.setdefault('validation_errors', {})
                        controller.context['validation_errors'].update(e.errors)
                        return controller.render()
                    pass
                return dispatch
            self.add_url_rule(path, route, closure(c_name, a_name), methods=methods)
            pass
        return self

    def run(self, network=False, **kwargs):
        if network:
            kwargs.update(host='0.0.0.0')
            pass
        super(Application, self).run(**kwargs)
        pass
    pass
