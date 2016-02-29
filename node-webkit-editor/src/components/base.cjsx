React = require 'react'
TabStore = require '../stores/tabs.coffee'
MenuStore = require '../stores/menus.coffee'
TabComponent = require './tab.cjsx'
MenuComponent = require './menu.cjsx'

module.exports = React.createClass {
    getInitialState: () ->
        return {
            tabs: TabStore.getTabs undefined
            menus: MenuStore.getMenus undefined
        }
    componentDidMount: () ->
        TabStore.addChangeListener @_onChange
        MenuStore.addChangeListener @_onChange
    componentWillUnmount: () ->
        TabStore.removeChangeListener @_onChange
        MenuStore.removeChangeListener @_onChange
    _onChange: () ->
        @setState {
            tabs: TabStore.getTabs undefined
            menus: MenuStore.getMenus undefined
        }
    render: () ->
        self = this
        tabs = @state.tabs.list.map (tab, index) ->
            tab.active = index is self.state.tabs.cursor
            return (<TabComponent key={index}/>)
        return (
            <div className="fullscreen container">
                <MenuComponent tabs={@state.tabs} menus={@state.menus}/>
                <div className="editor container">
                    {tabs}
                </div>
            </div>
        )
}
