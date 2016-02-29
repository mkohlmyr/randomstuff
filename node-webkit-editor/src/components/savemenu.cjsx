actions = require '../actions.coffee'
helpers = require '../helpers.coffee'
MenuStore = require '../stores/menus.coffee'
jQuery = require 'jquery'
React = require 'react'
path = require 'path'

module.exports = React.createClass {
    asyncStateUpdate: (pathList) ->
        self = this
        helpers.withFolders pathList, (folders) ->
            if self.isMounted undefined
                self.setState {
                    pathList: helpers.getPathArr pathList
                    treeList: folders
                }
        return
    getInitialState: () ->
        {cwd, save} = MenuStore.getMenus undefined
        if not cwd then cwd = save.lastdir
        return {
            dir: cwd
            pathList: []
            treeList: []
        }
    componentDidMount: ->
        @asyncStateUpdate @state.dir

    componentWillUnmount: ->
    render: () ->
        self = this
        pathList = helpers.folderListItems @state.pathList, (index) ->
            closed = helpers.onPathClickClosure self, index
            onClick = () ->
                self.asyncStateUpdate closed undefined
            return {onClick}
        treeList = helpers.folderListItems @state.treeList, (index) ->
            closed = helpers.onTreeClickClosure self, index, self.state.pathList
            onClick = () ->
                self.asyncStateUpdate closed undefined
            return {onClick}
        submitHandler = (evt) ->
            evt.preventDefault undefined
            [fp, fn] = helpers.onSaveSubmit self, self.state.pathList
            MenuStore.update {save: {lastdir: fp.substring (fp.lastIndexOf '/') + 1}}
            actions.tabs.save {filePath: fp, fileName: fn}
        return (
            <div className="menu save">
                <h1 className="menu label">
                    Save As
                </h1>
                <ul className="save path">
                    {pathList}
                </ul>
                <form className="save fileName" onSubmit={submitHandler}>
                    <input className="save filename"/>
                </form>
                <ul className="save tree">
                    {treeList}
                </ul>
            </div>
        )
}
