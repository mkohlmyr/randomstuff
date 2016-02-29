var WebSocketWrapper = function () {
    var self = this;

    this.connection = undefined;

    if (window.WebSocket && settings.launcher) {
        this.launcher = settings.launcher;
        this.connection = new WebSocket(settings.launcher);

        this.connection.onopen = function () {

        };

        this.connection.onmessage = function (evt) {
            var data = JSON.parse(evt.data);

            if (data.error) {
                window.ui.error(data.error);
                return;
            }

            switch (data.command) {
                case 'handshake':
                case 'authentication':
                    self.onHandshake(data);
                    break;
                case 'description':
                    self.onDescription(data);
                    break;
                case 'launch':
                    self.onLaunch(data);
                    break;
            }

        };

        this.connection.onclose = function () {
            console.log('game over');
        };

    } else throw 'WebSockets not supported by browser';

    this.encode = function (string) {
        return window.btoa(window.decodeURI(window.encodeURIComponent(string)));
    };

    this.describe = function () {
        try {
            this.connection.send(JSON.stringify({
                command: 'describe'
            }));
        } catch (e) {
            window.ui.error('Failed to retrieve list of available AMIs');
        }
    };

    this.authenticate = function (access_key, secret_key, region_id) {
        try {
            this.connection.send(JSON.stringify({
                command: 'authenticate',
                access_key: this.encode(access_key),
                secret_key: this.encode(secret_key),
                region: region_id
            }));
        } catch (e) {
            window.ui.error('Authentification failed: ', e.message);
        }
    };

    this.launch = function (ami) {
        try {
            this.connection.send(JSON.stringify({
                command: 'launch',
                ami: ami
            }));
        } catch (e) {
            window.ui.error('Launch failed: ', e.message);
        }
    };

    this.onHandshake = function (data) {
        if (data.authenticated) {
            window.ui.selection();
        } else {
            window.ui.authentication();
        }
    };

    this.onDescription = function (data) {
        window.ui.description(data);
    };

    this.onLaunch = function (data) {
        window.ui.launch(data);
    };
};

window.WebSocketWrapper = WebSocketWrapper;
