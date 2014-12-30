should = require 'should'

project = undefined
alphabets =
    binary: '01'
    numbers: '0123456789'
    lowercase: 'abcdefghijklmnopqrstuvwxyz'
    hexadecimal: '0123456789ABCDEF'

suite 'API', () ->
    suiteSetup (done) ->
        project = require '../index'
        return done.apply undefined

    test 'Available functions', (done) ->
        should.exist project
        should.exist project.table
        should.exist project.tosum
        should.exist project.fromsum
        should.exist project.normalize
        should.exist project.foldseq
        should.exist project.convert
        return done.apply undefined

suite 'Helpers', () ->
    suiteSetup (done) ->
        project = require '../index'
        return done.apply undefined

    test 'Helpers: convert.table', (done) ->
        hextable = {
            '0': 0, '1': 1, '2': 2, '3': 3,
            '4': 4, '5': 5, '6': 6, '7': 7,
            '8': 8, '9': 9, 'A': 10, 'B': 11,
            'C': 12, 'D': 13, 'E': 14, 'F': 15
        }
        (project.table alphabets.binary).should.eql {'0': 0, '1': 1}
        (project.table alphabets.hexadecimal).should.eql hextable
        return done.apply undefined

    test 'Helpers: convert.tosum', (done) ->
        (project.tosum [18, 21, 8, 15], 26).should.equal 330787
        (project.tosum [1, 2, 9], 10).should.equal 129
        return done.apply undefined

    test 'Helpers: convert.fromsum', (done) ->
        (project.fromsum 330787, 16).should.eql [5, 0, 12, 2, 3]
        (project.fromsum 129, 2).should.eql [1, 0, 0, 0, 0, 0, 0, 1]
        return done.apply undefined

    test 'Helpers: convert.normalize', (done) ->
        table = project.table alphabets.hexadecimal
        (project.normalize ['5', '0', 'C', '2', '3'], table).should.eql [5, 0, 12, 2, 3]
        return done.apply undefined

    test 'Helpers: convert.foldseq', (done) ->
        (project.foldseq [5, 0, 12, 2, 3], alphabets.hexadecimal).should.equal '50C23'
        return done.apply undefined

suite 'Full tests', () ->
    suiteSetup (done) ->
        project = require '../index'
        return done.apply undefined

    test 'Same base', (done) ->
        (project.convert '1', alphabets.numbers, alphabets.numbers).should.equal '1'
        (project.convert 'F', alphabets.hexadecimal, alphabets.hexadecimal).should.equal 'F'
        return done.apply undefined

    test 'Different bases', (done) ->
        (project.convert '129', alphabets.numbers, alphabets.binary).should.equal '10000001'
        (project.convert '10000001', alphabets.binary, alphabets.numbers).should.equal '129'

        (project.convert '129', alphabets.numbers, alphabets.hexadecimal).should.equal '81'
        (project.convert '81', alphabets.hexadecimal, alphabets.numbers).should.equal '129'

        (project.convert '10000001', alphabets.binary, alphabets.hexadecimal).should.equal '81'
        (project.convert '81', alphabets.hexadecimal, alphabets.binary).should.equal '10000001'


        (project.convert '3F', alphabets.hexadecimal, alphabets.numbers).should.equal '63'
        (project.convert '63', alphabets.numbers, alphabets.hexadecimal).should.equal '3F'

        (project.convert 'ba', alphabets.lowercase, alphabets.numbers).should.equal '26'
        (project.convert 'ba', alphabets.lowercase, alphabets.binary).should.equal '11010'
        (project.convert '11010', alphabets.binary, alphabets.numbers).should.equal '26'
        return done.apply undefined

    test 'Roundtrip', (done) ->
        (project.convert '10011101101', alphabets.binary, alphabets.hexadecimal).should.equal '4ED'
        (project.convert '4ED', alphabets.hexadecimal, alphabets.numbers).should.equal '1261'
        (project.convert '1261', alphabets.numbers, alphabets.lowercase).should.equal 'bwn'
        (project.convert 'bwn', alphabets.lowercase, alphabets.binary).should.equal '10011101101'
        return done.apply undefined

suite 'Requirements', () ->
    suiteSetup (done) ->
        project = require '../index'
        return done.apply undefined

    test '129  -> 10000001', (done) ->
        (project.convert '129', alphabets.numbers, alphabets.binary).should.equal '10000001'
        return done.apply undefined

    test 'FF   -> 255', (done) ->
        (project.convert 'FF', alphabets.hexadecimal, alphabets.numbers).should.equal '255'
        return done.apply undefined

    test 'svip -> 50C23', (done) ->
        (project.convert 'svip', alphabets.lowercase, alphabets.hexadecimal).should.equal '50C23'
        return done.apply undefined

