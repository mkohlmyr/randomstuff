global.document = window.document
global.navigator = window.navigator

gui = window.require 'nw.gui'
nwk =
    gui: gui
    app: gui.App
    arg: gui.App.argv
    win: gui.Window.get.call gui.Window

cwd = nwk.arg[0]
env = nwk.arg[1]

React = require 'react'
jQuery = require 'jquery'

actions = require './actions.coffee'
shortcuts = require './shortcuts.coffee'
MenuStore = require './stores/menus.coffee'
BaseComponent = require './components/base.cjsx'

actions.app.devtools = () ->
    nwk.win.showDevTools undefined

MenuStore.update {cwd}

(jQuery window.document).ready () ->
    jQuery 'head'
      .append '<link rel="stylesheet" type="text/css" href="node_modules/codemirror/lib/codemirror.css" />'
      .append '<link rel="stylesheet" type="text/css" href="node_modules/codemirror/theme/pastel-on-dark.css" />'
      .append '<link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Lato|Ubuntu+Mono" />'
      .append '<link rel="stylesheet" type="text/css" href="resources/application.css" />'
      #.append '<script src="node_modules/less/dist/less.min.js"></script>'
    React.render (React.createElement BaseComponent), document.body

if env is 'development'
    restart = () ->
        for module_name, module of global.require.cache
            delete global.require.cache[module_name]
        window.location.reload.call window.location

    ws = new window.WebSocket 'ws://localhost:49500/'

    ws.onopen = () ->
        console.log 'websocket conection established'
        ws.send 'hi'

    ws.onerror = (error) ->
        console.log "websocket error #{error}"

    ws.onclose = () ->
        console.log 'websocket connection closed'

    ws.onmessage = (message) ->
        switch message.data
            when 'refresh'
                console.log 'websocket received refresh command'
                restart.call undefined
            when 'reconnect'
                wait = 5120
                console.log "websocket received reconnect command (reconnecting in #{wait}ms)"
                window.setTimeout () ->
                    console.log 'websocket reconnecting'
                    restart.call undefined
                  , wait
            else
                console.log "websocket received unrecognized command #{message.data}"
