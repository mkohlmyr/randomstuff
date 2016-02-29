dispatcher = require '../dispatcher.coffee'
constants = require '../constants.coffee'
shortcuts = require '../shortcuts.coffee'
actions = require '../actions.coffee'
MenuStore = require './menus.coffee'
cmsettings = require '../../settings/codemirror.json'
EventEmitter = (require 'events').EventEmitter
assign = require 'object-assign'
fs = require 'fs'

CodeMirror = require 'codemirror'

_tabs = {
    cursor: null,
    list: []
}

class Tab
    constructor: () ->
        @active = false
        @filePath = null
        @fileName = null

    initCM: (elt) ->
        @cm = CodeMirror.fromTextArea elt, cmsettings
        @cm.setOption 'extraKeys', shortcuts.cm

    setFile: (filePath) ->
        @filePath = filePath
        @fileName = filePath.substring (filePath.lastIndexOf '/') + 1


TabStore = assign {}, EventEmitter.prototype, {
    getTabs: () ->
        return _tabs

    getCurrent:() ->
        return _tabs.list[_tabs.cursor] or null

    emitChange: () ->
        @emit 'change'

    addChangeListener: (callback) ->
        @on 'change', callback

    removeChangeListener: (callback) ->
        @removeListener 'change', callback
}

dispatcher.register (payload) ->
    {action} = payload

    switch action.actionType
        when constants.TABS_LOAD
            _tabs = action.data.tabs
        when constants.TABS_NEW
            tab = new Tab undefined
            _tabs.list.push tab
            _tabs.cursor = _tabs.list.length - 1
        when constants.TABS_CLOSE
            if _tabs.cursor is null
                return true
            _tabs.list.splice _tabs.cursor, 1
            _tabs.cursor = switch
                when _tabs.list.length is 0 then null
                when _tabs.cursor is _tabs.list.length then _tabs.cursor - 1
                else _tabs.cursor
        when constants.TABS_SWITCH
            _tabs.cursor = action.data.index
        when constants.TABS_SAVE
            tab = TabStore.getCurrent undefined
            if not tab
                return true
            else if action and action.data and action.data.filePath
                tab.fileName = action.data.fileName
                tab.filePath = action.data.filePath
                TabStore.emitChange undefined
            if not tab.fileName or not tab.filePath
                return true
            fs.writeFile tab.filePath, (tab.cm.getValue undefined), (err) ->
                if err then console.log err
            return true
        when constants.TABS_OPEN
            if not action.data or not action.data.filePath
                return true
            tab = new Tab undefined
            tab.setFile action.data.filePath
            _tabs.list.push tab
            _tabs.cursor = _tabs.list.length - 1
        else
            return true

    TabStore.emitChange undefined
    return true

module.exports = TabStore
