class Scheduler
    @delay: (fn, options) ->
        [guid, now] = [(GUID.generate null), (new Date) * 1]
        id = window.setTimeout (args...) ->
            delete Scheduler.map[guid]
            fn.apply this, args
        , options.wait
        @map[guid] =
            guid: guid
            fn: fn
            id: id
            at: now + options.wait
        return guid

    @empty: ->
        for guid, scheduled of @map
            if not @cancel guid
                return false
        return null

    @cancel: (guid) ->
        if @map[guid]
            window.clearTimeout @map[guid].id
            delete @map[guid]
            return true
        return false

    @map: {}

window.$s = Scheduler
