exports.table = (alphabet) ->
    # Produce a lookup table for the source alphabet.
    table = {}
    for a, cursor in alphabet
        table[a] = cursor
    return table

exports.tosum = (sequence, base) ->
    # Produce decimal value sum from sequence in given base.
    return sequence.reduce (sum, x, cursor) ->
        exp = sequence.length - (cursor + 1)
        return sum + (x * Math.pow base, exp)
      , 0

exports.fromsum = (sum, base) ->
    # Find the first non-useful exponent.
    #
    # Then reduce sequence of useful
    #   exponents from largest to smallest.
    #
    # Use base and exponent to get the value
    #   at this position in the sequence in
    #   the given base.
    #
    # Returning a new sequence of values in
    #   the desired base.
    fn = (mem, exp) ->
        [rem, set] = mem
        y = (Math.pow base, exp)
        r = (rem % y)
        set.push (rem - r) / y
        return [r, set]
    recurse = (exp) ->
        y = Math.pow base, exp
        if y > sum
            return ([0...exp].reduceRight fn, [sum, []])
        return (recurse exp + 1)
    return (recurse 0)[1]

exports.normalize = (seq, tbl) ->
    # Map an alphabet sequence to numeric values.
    fn = (v) ->
        return tbl[v]
    return seq.map fn

exports.foldseq = (seq, target) ->
    # Fold a sequence into a string.
    fn = (str, int) ->
        return "#{str}#{target[int]}"
    return seq.reduce fn, ''

exports.convert = (input, source, target) ->
    # Convert between two "alphabets", where
    #   alphabets are essentially sequences of
    #   symbols representing numeric values in
    #   a certain base (the sequence length).
    if source is target
        return input
    input = input.split ''
    norm = exports.normalize input, exports.table source

    source_t = exports.table source
    norm = exports.normalize input, source_t
    seq = exports.fromsum (exports.tosum norm, source.length), target.length

    return (exports.foldseq seq, target)
