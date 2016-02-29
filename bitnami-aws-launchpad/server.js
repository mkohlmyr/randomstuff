var connect = require('connect'),
    http = require('http'),
    url = require('url'),
    util = require('./lib/util.js'),
    routes = require('./lib/routes.js'),
    cookies = require('cookies');

module.exports = function (port) {
    var self = this;

    this.port = port;
    this.routes = {};
    this.launchers = [];

    this.render = function (request, response, route) {
        if (!route) {
            response.writeHead(404, undefined);
            response.end(undefined);
        } else {
            response.writeHead(200, {'Content-Type': route[1]});
            if (route[0] && route[0].call && route[0].apply) {
                var data = {
                    launcher: request.cookies.get('launcher')
                };

                response.end(route[0](data));
            } else {
                response.end(route[0]);
            }
        }
    };

    this.middleware = connect().use(function (request, response) {
        var data = url.parse(request.url, true),
            path = data.pathname;

        request.cookies = new cookies(request, response);

        if (self.launchers.length && !request.cookies.get('launcher')) {
            request.cookies.set('launcher', self.launchers[util.random(0, self.launchers.length - 1)], {maxage: 300000});
        }

        switch (path) {
            case '/':
                self.render(request, response, self.routes.index);
                return;
            case '/main.css':
                self.render(request, response, self.routes.styles);
                return;
            case '/main.js':
                self.render(request, response, self.routes.main_js);
                return;
            case '/dynamic.js':
                self.render(request, response, self.routes.dynamic_js);
                return;
        }

        if (!path.indexOf('/register/launcher/')) {
            self.launchers.push('ws://' + util.ip(request) + ':' + path.substring(path.lastIndexOf('/') + 1));
            self.render(request, response, self.routes.launcher);
            console.log('Registered new Launcher', self.launchers[self.launchers.length - 1]);
            return;
        }
    });

    routes.build(function (routes) {
        self.routes = routes;
        console.log('All routes built');

        self.server = http.createServer(self.middleware).listen(self.port);
        console.log('Started server on port', self.port);
    });
};
