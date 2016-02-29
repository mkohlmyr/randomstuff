actions = require '../actions.coffee'
helpers = require '../helpers.coffee'
MenuStore = require '../stores/menus.coffee'
jQuery = require 'jquery'
React = require 'react'
path = require 'path'

module.exports = React.createClass {
    asyncStateUpdate: (pathList) ->
        self = this
        helpers.withFilesAndFolders pathList, (files, folders) ->
            if self.isMounted undefined
                self.setState {
                    pathList: helpers.getPathArr pathList
                    treeList: folders
                    fileList: files
                }
        return
    getInitialState: () ->
        {cwd, open} = MenuStore.getMenus undefined
        if not cwd then cwd = open.lastdir
        return {
            dir: cwd
            pathList: []
            treeList: []
            fileList: []
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
        fileList = helpers.fileListItems @state.fileList, (index) ->
            closed = helpers.onFileClickClosure self, index, self.state.pathList
            onClick = () ->
                actions.tabs.open {filePath: closed undefined}
            return {onClick}
        return (
            <div className="menu open">
                <h1 className="menu label">
                    Open File
                </h1>
                <ul className="open path">
                    {pathList}
                </ul>
                <ul className="open tree">
                    {treeList}
                </ul>
                <ul className="open files">
                    {fileList}
                </ul>
            </div>
        )
}
