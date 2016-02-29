class GUID
    constructor: ->
        @v = (Math.floor (Math.random null) * 16384) + 8192

    generate: ->
        @v = @v + (Math.floor (Math.random null) + (64)) + 4
        return "GUID#{(@v.toString 16).toUpperCase null}"

window.$guid = GUID = new GUID null
