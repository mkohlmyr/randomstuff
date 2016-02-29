gulp = require 'gulp'
less = require 'gulp-less'
proc = require 'child_process'
gutil = require 'gulp-util'
yargs = require 'yargs'
ws = require 'ws'

process = null
browser = null
server = new ws.Server {port: 49500}
server.on 'connection', (ws) ->
    gutil.log 'Browser connected to refresh server'
    ws.on 'message', (message) ->
        gutil.log "Browser says #{message}"
    browser = ws
    ws.on 'close', () ->
        gutil.log 'Refresh server closed connection'
        browser = null

server.on 'close', (ws) ->
    gutil.log 'Shutting down refresh server'

gulp.task 'less', (stopif) ->
    gulp.src './less/application.less'
      .pipe less undefined
      .pipe gulp.dest './resources/'

gulp.task 'refresh', ['less'], () ->
    if browser isnt null
        gutil.log 'Refresh server sending refresh notification'
        browser.send 'refresh'
    else
        gutil.log 'Refresh server has no active browsers'

gulp.task 'regulp', () ->
    if browser isnt null
        gutil.log 'Refresh server sending reconnect notification'
        browser.send 'reconnect'
    setTimeout () ->
        if server isnt null
            gutil.log 'Refresh server shutting down'
            server.close undefined
        if process isnt null
            process.kill.call process
        gutil.log 'Restarting gulp'
        args = yargs.argv.task
        process = proc.spawn 'gulp', (if args then [args] else []), {stdio: 'inherit'}
      , 1024

gulp.task 'watch', () ->
    watch = (path, task) ->
        gulp.watch path, {debounceDelay: 256}, [task]
    watch 'src/components/*.cjsx', 'refresh'
    watch 'src/**/*.coffee', 'refresh'
    watch 'less/**/*.less', 'refresh'
    watch 'gulpfile.coffee', 'regulp'

gulp.task 'default', ['less', 'watch']
