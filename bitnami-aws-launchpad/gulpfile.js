var gulp = require('gulp'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    intercept = require('gulp-intercept'),
    gulpif = require('gulp-if'),
    path = require('path'),
    util = require('./lib/util.js'),
    portfinder = require('portfinder');

gulp.task('default', function () {

});

gulp.task('less', function () {
    gulp.src('./less/*.less')
        .pipe(less({paths: [path.join(__dirname, 'less', 'includes')]}))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./public/'));
});



gulp.task('js', function () {
    var is_template = function (desired, file) {
        return util.oneof(file.path, ['hbs']) === desired;
    };

    gulp.src('./js/*.js')
        //.pipe(uglify()) // make devtools work better by not uglifying while developing
        .pipe(gulpif(is_template.bind(undefined, true), concat('javascript.hbs')))
        .pipe(gulpif(is_template.bind(undefined, false), concat('main.js')))
        .pipe(gulp.dest('./public/'));
});

gulp.task('server', function () {
    var Server = new require('./server.js'),
        discovery_config = require('./config/discovery-config.js');

    new Server(discovery_config.port);
});

gulp.task('launcher', function () {
    var Launcher = new require('./launcher.js');
    portfinder.getPort(function (err, port) {
        new Launcher(port);
    });
});
