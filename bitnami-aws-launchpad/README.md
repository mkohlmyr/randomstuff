bitnami-aws-launchpad
=====================
Basic one-page web application for launching instances from bitnami AMIs.

**MIT License**  
Copyright (c) 2014 Mikael Kohlmyr
mikael@kohlmyr.com

==========
**Requirements**  
[gulp.js](http://example.net/) streaming build system.  
```
npm install -g gulp
```

==========
**Server**  
Simple NodeJS web server which serves a few static files and rendered handlebars templates.

==========
**Launcher**  
WebSocket server which performs API requests against Amazon EC2 based on actions taken in the application and sends back responses.

==========
**Build**  
```
npm install
gulp less
gulp js
```
==========
**Run**  
```
gulp server
gulp launcher
```
