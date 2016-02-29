Dispatcher = (require 'flux').Dispatcher

dispatcher = new Dispatcher undefined
dispatcher.handleViewAction = (action) ->
    @dispatch {
        source: 'VIEW_ACTION',
        action: action
    }

module.exports = dispatcher
