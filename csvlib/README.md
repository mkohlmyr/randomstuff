csvlib
======

Python CSV helpers

```
$ python
>>> foo = [{'a': '1', 'b': '2'}, {'a': '3', 'c': '4'}]
>>> bar = [{'c': '5', 'd': '6'}]
>>> import csvlib
>>> csvlib.stringify(True, foo, bar)
"a","b","c","d"
"1","2","",""
"3","","4",""
"","","5","6"
```
