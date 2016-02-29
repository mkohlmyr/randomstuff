React = require 'react'
TabStore = require '../stores/tabs.coffee'
MenuStore = require '../stores/menus.coffee'
jQuery = require 'jquery'
fs = require 'fs'

module.exports = React.createClass {
    getInitialState: () ->
        return {tab: TabStore.getCurrent undefined}
    componentDidMount: () ->
        textarea = jQuery @getDOMNode undefined
            .find 'textarea'
            .get 0
        @state.tab.initCM textarea
        if @state.tab.filePath
            self = this
            fs.readFile @state.tab.filePath, {encoding: 'utf8'}, (err, data) ->
                if err then (console.log err) else self.state.tab.cm.setValue data
                menus = MenuStore.getMenus undefined
                if menus.open.showing
                    MenuStore.close undefined
                    MenuStore.emitChange undefined
    componentWillUnmount: ->
    render: () ->
        classes = ['editor', 'wrapper']
        if @state.tab.active
            classes.push 'active'
        return (
            <div className={classes.join ' '}>
                <textarea className="editor source"></textarea>
                <div className="editor status">{@state.tab.fileName or 'untitled'}</div>
            </div>
        )
}
