actions = require '../actions.coffee'

React = require 'react'

module.exports = React.createClass {
    getInitialState: () ->
        return null
    componentDidMount: ->
    componentWillUnmount: ->
    render: () ->
        list = @props.list.map (item, index) ->
            switchto = actions.tabs.switchto.bind actions.tabs, {index}

            classes = ['tab']
            if item.active
                classes.push 'active'

            return (
                <li className={classes.join ' '}>
                    <a className="filename" onClick={switchto}>{item.filename or 'untitled'}</a>
                    <br/>
                    <span className="filepath">{item.filepath or '/'}</span>
                </li>
            )
        return (
            <div className="menu tabs">
                <h1 className="menu label">Active Tabs</h1>
                <ul className="tabs">
                    {list}
                </ul>
            </div>
        )
}
