actions = require '../actions.coffee'
TabsMenuComponent = require './tabsmenu.cjsx'
OpenMenuComponent = require './openmenu.cjsx'
SaveMenuComponent = require './savemenu.cjsx'
#InfoMenuComponent = require './infomenu.cjsx'
React = require 'react'

module.exports = React.createClass {
    getInitialState: () ->
        return null
    componentDidMount: ->
    componentWillUnmount: ->
    render: () ->
        content = null
        if @props.menus.showing is null
            return null
        if @props.menus.tabs.showing
            content = <TabsMenuComponent list={@props.tabs.list}/>
        if @props.menus.save.showing
            content = <SaveMenuComponent/>
        if @props.menus.open.showing
            content = <OpenMenuComponent/>
        return (
            <div className="menu overlay fullscreen">
                <div className="menu wrapper">
                    {content}
                </div>
            </div>
        )
}
