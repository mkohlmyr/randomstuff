dispatcher = require './dispatcher.coffee'
constants = require './constants.coffee'

module.exports = {
    tabs: {
        load: (data) ->
            dispatcher.handleViewAction {
                actionType: constants.TABS_LOAD
                data: data
            }
        new_: (data) ->
          dispatcher.handleViewAction {
              actionType: constants.TABS_NEW
              data: data
          }
        close: (data) ->
          dispatcher.handleViewAction {
              actionType: constants.TABS_CLOSE
              data: data
          }
        switchto: (data) ->
          dispatcher.handleViewAction {
              actionType: constants.TABS_SWITCH
              data: data
          }
        save: (data) ->
            dispatcher.handleViewAction {
                actionType: constants.TABS_SAVE
                data: data
            }
        open: (data) ->
            dispatcher.handleViewAction {
                actionType: constants.TABS_OPEN
                data: data
            }
    }
    menu: {
        tabs: (data) ->
            dispatcher.handleViewAction {
                actionType: constants.MENU_TABS
                data: data
            }
        open: (data) ->
            dispatcher.handleViewAction {
                actionType: constants.MENU_OPEN
                data: data
            }
    }
    app: {
        devtools: ->
    }
}
