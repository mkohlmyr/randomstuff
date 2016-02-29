assign = require 'object-assign'
jQuery = require 'jquery'
React = require 'react'
async = require 'async'
path = require 'path'
fs = require 'fs'

exports.isFolder = (pth, callback) ->
    fs.stat pth, (err, stat) ->
        if err or not stat or not stat.isDirectory undefined
            return callback false
        return callback true
    return

exports.getFolders = (pth, callback) ->
    pth = exports.getPathStr pth
    fs.readdir pth, (err, files) ->
        if not err
            files = files.map (v) ->
                return path.join pth, v
            wrappedCallback = (folders) ->
                folders = folders.map (v) ->
                    return v.substring (v.lastIndexOf '/') + 1
                return callback folders
            return async.filter files, exports.isFolder, wrappedCallback
        return console.log err
    return

exports.getFilesAndFolders = (pth, callback) ->
    pth = exports.getPathStr pth
    fs.readdir pth, (err, items) ->
        if not err
            items = items.map (v) ->
                return [v, path.join pth, v]
            files = []
            folders = []
            each = (item, callback) ->
                console.log item
                [name, pth] = item
                fs.stat pth, (err, stat) ->
                    if err or not stat
                        callback "Error processing #{pth}"
                    if not stat.isDirectory undefined
                        files.push name
                    else
                        folders.push name
                    callback undefined
            complete = (err) ->
                console.log err, files, folders
                if err then console.log err
                callback files, folders
            return async.each items, each, complete
        return console.log err
    return

exports.withFilesAndFolders = (pathList, callback) ->
    if not Array.isArray pathList
        pathList = exports.getPathArr pathList
    exports.getFilesAndFolders pathList, callback

exports.getPathArr = (pathStr) ->
    if Array.isArray pathStr
        return pathStr
    return pathStr.split '/'
      .filter (p) ->
        return not not p

exports.getPathStr = (pathArr) ->
    if not Array.isArray pathArr
        return pathArr
    return '/' + path.join.apply path, pathArr

exports.withFolders = (pathList, callback) ->
    if not Array.isArray pathList
        pathList = exports.getPathArr pathList
    exports.getFolders pathList, callback

exports.folderListItems = (folderList, each) ->
    if not each
        each = () -> {}
    return folderList.map (folderName, index) ->
        a = React.createElement 'a', (assign (each index), {className: 'folderName'}), folderName
        return React.createElement 'li', {className: 'folder', key: index}, a

exports.fileListItems = (fileList, each) ->
    if not each
        each = () -> {}
    return fileList.map (fileName, index) ->
        a = React.createElement 'a', (assign (each index), {className: 'fileName'}), fileName
        return React.createElement 'li', {className: 'file', key: index}, a

exports.onPathClickClosure = (self, index) ->
    fn = () ->
        elts = jQuery self.getDOMNode undefined
          .find 'ul.path li.folder a.folderName'
          .slice 0, index + 1
        elts = jQuery.makeArray elts
        elts = elts.map (e) ->
            return e.textContent
        return exports.getPathStr elts
    return fn

txtFinder = (self, index, selector) ->
    return jQuery self.getDOMNode undefined
      .find selector
      .get index
      .textContent

exports.onTreeClickClosure = (self, index, pathList) ->
    fn = () ->
        txt = txtFinder self, index, 'ul.tree li.folder a.folderName'
        return path.join (exports.getPathStr pathList), txt
    return fn

exports.onFileClickClosure = (self, index, pathList) ->
    fn = () ->
        txt = txtFinder self, index, 'ul.files li.file a.fileName'
        return path.join (exports.getPathStr pathList), txt
    return fn


exports.onSaveSubmit = (self, pathList) ->
    fn = jQuery self.getDOMNode undefined
      .find 'input.save.fileName'
      .get 0
      .value
    pathList = pathList.concat fn
    return [(exports.getPathStr pathList), fn]
