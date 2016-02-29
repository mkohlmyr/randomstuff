gulp = require "gulp"
gutil = require "gulp-util"
concat = require "gulp-concat"
coffee = require "gulp-coffee"

gulp.task "build", ->
    files = [
        "./src/guid.coffee"
        "./src/event.coffee"
        "./src/scheduler.coffee"
        "./src/middleware.coffee"
    ]
    return gulp.src files
      .pipe concat "earhole.coffee"
      .pipe (coffee {bare: true}).on "error", gutil.log
      .pipe gulp.dest "./dist/"
