earhole
=======
###Advanced cross-browser event-listening and scheduling.
=========
**Install dependencies and clone**
```
$ npm install -g coffee-script
$ npm install -g gulp
$ git clone git@github.com:kmyr/earhole.git
$ cd earhole
$ npm install
```
=========

**Build a bundled JavaScript file**
```
$ make clean
$ gulp build
$ cd dist
$ ls
earhole.js
```
=========

**Usage example**
```
/**
 * Throttle event listener to fire at most once per 3072ms.
 * Only fire 5 times.
 * Last added middleware executes first.
 * ------------------------------------------------
 * $guid = window.$guid
 *
 * $e = window.$e = window.Event
 * $m = window.$m = window.Event.Middleware
 * $s = window.$s = window.Scheduler
 **/

$m.when($e.on(element, 'keyup', function (event) {
    console.log('Executed event handler');
    console.log(this, event)
})).use($m.times, 5).use($m.throttle, 3072);
```
