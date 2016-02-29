var fs = require('fs'),
    async = require('async'),
    handlebars = require('handlebars');

exports.views = [
    ['index', './hbs/index.hbs', 'text/html'],
    ['styles', './public/main.css', 'text/css'],
    ['main_js', './public/main.js', 'application/javascript'],
    ['dynamic_js', './public/javascript.hbs', 'application/javascript'],
    ['launcher', undefined, 'text/plain']
];

exports.build = function (finished) {
    var routes = {};

    async.eachSeries(exports.views, function (view, callback) {
        var name = view[0],
            file = view[1],
            mime = view[2];

        var add_route = function (name, data, mime) {
            routes[name] = [data, mime];
            console.log('Built route', name);
        };

        if (!file) {
            add_route(name, undefined, mime);
            callback();
        } else {
            fs.readFile(file, 'utf8', function (err, data) {
                if (err) throw err;

                if (file.indexOf('.hbs') > -1) {
                    data = handlebars.compile(data);
                }

                add_route(name, data, mime);
                callback();
            });
        }
    }, finished.bind(undefined, routes));
};
