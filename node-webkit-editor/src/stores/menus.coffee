dispatcher = require '../dispatcher.coffee'
constants = require '../constants.coffee'
EventEmitter = (require 'events').EventEmitter
assign = require 'object-assign'
TabStore = require './tabs.coffee'

_menus = {
    showing: null,
    cwd: null
    tabs: {
        showing: false
    },
    open: {
        showing: false
        lastdir: null
    },
    save: {
        showing: false
        lastdir: null
    }
}

MenuStore = assign {}, EventEmitter.prototype, {
    getMenus: () ->
        return _menus

    update: (obj) ->
        _menus = assign {}, _menus, obj

    setdefault: (obj) ->
        _menus = assign {}, obj, _menus

    show: (menu) ->
        _menus[menu].showing = true
        _menus.showing = menu

    close: () ->
        _menus[_menus.showing].showing = false
        _menus.showing = null

    handleTabs: () ->
        if _menus.showing
            MenuStore.close undefined
        else
            MenuStore.show 'tabs'

    handleRest: (menu) ->
        if _menus.showing is menu
            return true
        if _menus.showing
            MenuStore.close undefined
        MenuStore.show menu
        return false

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
        when constants.MENU_TABS
            MenuStore.handleTabs undefined
        when constants.TABS_SAVE
            if action.data and action.data.filePath
                if _menus.showing is 'save'
                    MenuStore.close undefined
                    MenuStore.emitChange undefined
                return true
            tab = TabStore.getCurrent undefined
            if tab is null
                return true
            if tab.filePath and tab.fileName
                return true
            if MenuStore.handleRest 'save'
                return true
        when constants.TABS_SWITCH
            MenuStore.handleTabs undefined
        when constants.MENU_OPEN
            if MenuStore.handleRest 'open'
                return true
        when constants.MENU_INFO
            if MenuStore.handleRest 'info'
                return true
        else
            return true
    MenuStore.emitChange undefined
    return true

module.exports = MenuStore
