actions = require './actions.coffee'

keymaster = require 'keymaster'

exports.commands = [
    {
        'keys': ['Ctrl', 'N'],
        'action': (cm) ->
            actions.tabs.new_ undefined
    }
    {
        'keys': ['Ctrl', 'Q'],
        'action': (cm) ->
            actions.tabs.close undefined
    }
    {
        'keys': ['Ctrl', 'S'],
        'action': (cm) ->
            actions.tabs.save undefined
    }
    {
        'keys': ['Alt', 'Tab'],
        'action': (cm) ->
            actions.menu.tabs undefined
    }
    {
        'keys': ['Ctrl', 'O']
        'action': (cm) ->
            actions.menu.open undefined
    }
    {
        'keys': ['Ctrl', 'J'],
        'action': (cm) ->
            actions.app.devtools undefined
    }
]

exports.cm = {}

for command in exports.commands
    kmstr = command.keys.join '+'
    kmstr = kmstr.toLowerCase undefined
    keymaster kmstr, command.action
    exports.cm[command.keys.join '-'] = command.action
