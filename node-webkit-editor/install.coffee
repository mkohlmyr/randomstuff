fs = require 'fs'
fp = '/usr/local/bin/node-webkit-editor'

script = "#!/bin/bash\n`nohup nw #{__dirname} $PWD $1</dev/null &> /dev/null &`"

fs.writeFile fp, script, {encoding: 'utf-8'}, (err) ->
    if err then throw err
    console.log "#{fp} saved.."
    # note that 0777 or 777 octal = 511 decimal
    fs.chmod fp, 511, () ->
    	console.log "#{fp} permissions set.."
