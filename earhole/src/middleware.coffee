class Middleware

    @when: (guid) ->
        self = this
        class Closure
            @use: (fn, args...) ->
                fn.apply self, [guid].concat args
                return this

            @provide: (data) ->
                event = Event.map[guid]
                for key, val of data
                    event.data[key] = val
                return this
        return Closure

    @times: (guid, times) ->
        [count, fn] = [0, Event.map[guid].fn]
        Event.map[guid].fn = (args...) ->
            if count++ < times
                fn.apply Event.map[guid], args
            else
                Event.off guid
        return guid

    @nth: (guid, n) ->
        [count, fn] = [0, Event.map[guid].fn]
        Event.map[guid].fn = (args...) ->
            if (count++ % n) < 1
                fn.apply Event.map[guid], args
        return guid

    @filter: (guid, filter) ->
        fn = Event.map[guid].fn
        Event.map[guid].fn = (args...) ->
            if filter.apply Event.map[guid], args
                fn.apply Event.map[guid], args
        return guid

    @defer: (guid, buffer) ->
        fn = Event.map[guid].fn
        Event.map[guid].fn = (args...) ->
            defer_id = Event.map[guid].data.defer_id
            scheduled = Scheduler.map[defer_id]

            if defer_id and scheduled
                Scheduler.cancel defer_id

            Event.map[guid].data.defer_id = Scheduler.delay ->
                fn.apply Event.map[guid], args
            , {wait: buffer}
        return guid

    @throttle: (guid, buffer) ->
        event = Event.map[guid]
        fn = event.fn
        event.fn = (args...) ->
            [last, now] = [event.data.throttle_last, (new Date) * 1]

            if event.data.throttle_id
                Scheduler.cancel event.data.throttle_id
                delete event.data.throttle_id

            if !last or now > (last + buffer)
                event.data.throttle_last = now
                fn.apply event, args
            else
                remaining_wait_time = buffer - (now - last)
                event.data.throttle_id = Scheduler.delay ->
                    event.data.throttle_last = (new Date) * 1
                    fn.apply event, args
                , {wait: remaining_wait_time}
        return guid

window.$m = Middleware
