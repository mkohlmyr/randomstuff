utfhate
=======
Doing BAD THINGS<sup>TM</sup> to UTF-8 byte strings and unicode strings.

e.g.
```
$ python
>>> import utfhate
>>> utfhate
<module 'utfhate' from 'utfhate/__init__.py'>

>>> utfhate.htmlstring('asd \xc2\xa3 \xe2\x98\xaf \xc2\xbf \xe0\xa6\x8b')
'asd &#163; &#9775; &#191; &#2443;'

>>> utfhate.htmlstring(u'asd \xa3 \u262f \xbf \u098b')
'asd &#163; &#9775; &#191; &#2443;'
```
