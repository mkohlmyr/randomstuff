class Event

    @on: (element, type, func) ->
        guid = @createRecord element, type, func
        @addListener guid
        return guid

    @off: (guid, permanent) ->
        @removeListener guid
        if permanent
            return @removeRecord guid
        return true

    @toggle: (guid) ->
        if @map[guid]
            return @removeListener guid
        return @addListener guid

    @map: {}

    @createRecord: (element, type, fn) ->
        guid = GUID.generate null
        @map[guid] =
            fn: fn
            handler: (args...) ->
                return Event.map[guid].fn.apply this, [guid].concat args
            element: element
            live: false
            guid: guid
            type: type
            data: {}
        return guid

    @removeRecord: (guid) ->
        delete @map[guid]
        return true

    @addListener: (guid) ->
        event = Event.map[guid]
        if event.element.addEventListener
            event.element.addEventListener event.type, event.handler, false
        else if event.element.attachEvent
            event.element.attachEvent "on#{event.type}", event.handler
        else
            return false
        event.live = true
        return guid

    @removeListener: (guid) ->
        event = Event.map[guid]
        if event.element.removeEventListener
            event.element.removeEventListener event.type, event.handler, false
        else if event.element.detachEvent
            event.element.detachEvent "on#{event.type}", event.handler
        else
            return false
        event.live = false
        return true

window.$e = Event
