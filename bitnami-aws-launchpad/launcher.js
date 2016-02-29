var WebSocketServer = require('ws').Server,
    discovery_config = require('./config/discovery-config.js'),
    request = require('request'),
    AWS = require('aws-sdk'),
    atob = require('atob'),
    btoa = require('btoa'),
    Cache = require('expiring-lru-cache'),
    util = require('./lib/util.js'),
    async = require('async');

module.exports = function (port) {
    var self = this;
    this.cache = new Cache({size: 100, expiry: 300000});
    this.server = new WebSocketServer({port: port});

    request.get(discovery_config.addr + ':' + discovery_config.port + '/register/launcher/' + port);

    var decode = function (string) {
        return decodeURIComponent(encodeURI(atob(string)));
    };

    var encode = function (string) {
        return btoa(decodeURI(encodeURIComponent(string)));
    };

    var ec2_instance = function (access_key, secret_key, region) {
        return new AWS.EC2({
            accessKeyId: access_key,
            secretAccessKey: secret_key,
            region: region,
            apiVersion: 'latest',
            maxRetries: 3
        });
    };

    this.authenticate = function (message, callback) {
        if (!message.access_key || !message.secret_key || !message.region) {
            console.log('Authentication attempt with missing details', JSON.stringify(message));
            callback({error: 'Some required details were missing'});
        }

        var decoded_access_key = decode(message.access_key),
            decoded_secret_key = decode(message.secret_key);

        var ec2 = ec2_instance(decoded_access_key, decoded_secret_key, message.region);

        ec2.describeInstanceStatus({}, function (error, data) {
            if (error) {
                callback({command: 'authentication', authenticated: false, error: error.message});
            } else if (data.requestId) {
                callback({
                    command: 'authentication',
                    authenticated: true,
                    access_key: decoded_access_key,
                    secret_key: decoded_secret_key,
                    region: message.region
                });
            }
        });
    };

    this.describe = function (cached, callback) {

        var ec2 = ec2_instance(cached.access_key, cached.secret_key, cached.region);

        ec2.describeImages({
            Filters: [{
                Name: 'image-type',
                Values: ['machine']
            }, {
                Name: 'state',
                Values: ['available']
            }, {
                Name: 'description',
                Values: ['http://bitnami.org']
            }]
        }, function (error, data) {
            if (error) {
                callback({success: false, error: error.message});
            } else if (data.requestId && data.Images.length) {
                callback(data.Images);
            } else {
                callback({success: false, error: 'Failed to retrieve images'});
            }
        });
    };

    this.launch = function (cached, message, callback) {

        var ec2 = ec2_instance(cached.access_key, cached.secret_key, cached.region);

        var kp_token = ('bitnami-aws-launchpad-' + util.token());

        ec2.createKeyPair({
            KeyName: kp_token
        }, function (error, data) {
            if (error) {
                callback({success: false, error: error.message});
            } else if (data.requestId) {
                var key_digest = data.KeyFingerprint,
                    private_key = data.KeyMaterial;

                ec2.runInstances({
                    ImageId: message.ami.id,
                    MinCount: 1,
                    MaxCount: 1,
                    KeyName: kp_token,
                    InstanceType: 't1.micro'
                }, function (_error, _data) {
                    if (_error) {
                        callback({success: false, error: _error.message});
                    } else if (_data.requestId) {
                        callback(_data, key_digest, private_key, kp_token, message.ami);
                    } else {
                        callback({success: false, error: 'Failed to launch AMI on instance'});
                    }
                });
            }
        });
    };

    this.status = function (cached, data, callback) {

        var ec2 = ec2_instance(cached.access_key, cached.secret_key, cached.region);
        console.log(data);
        ec2.describeInstances({
            Filters: [{
                Name: 'reservation-id',
                Values: [data.reservation_id]
            }]
        }, function (error, data) {
            if (error) {
                callback({success: false, error: error.message});
            } else if (data.requestId) {
                callback(data);
            } else {
                callback({success: false, error: 'Failed to retrieve status of launched instance'});
            }
        });
    };

    this.server.on('connection', function (ws) {
        var key = encode(ws._socket.remoteAddress + ws._socket.remotePort),
            cached;
        if ((cached = self.cache.get(key))) {
            ws.send(JSON.stringify({command: 'handshake', authenticated: true}));
        } else {
            ws.send(JSON.stringify({command: 'handshake', authenticated: false}));
        }

        ws.on('message', function (message) {
            message = JSON.parse(message);
            console.log(message);
            switch (message.command) {
                case 'authenticate':
                    self.authenticate(message, function (data) {
                        if (data.authenticated) {
                            self.cache.set(key, data);
                            cached = data;
                        }
                        ws.send(JSON.stringify(data));
                    });
                    break;
                case 'describe':
                    self.describe(cached, function (data) {
                        var buffer = [];

                        data.forEach(function (image) {
                            var platform = image.Platform || 'Other';
                            buffer.push({
                                id: image.ImageId,
                                name: image.Name,
                                architecture: image.Architecture,
                                platform: platform
                            });

                            if (buffer.length > 50) {
                                ws.send(JSON.stringify({
                                    command: 'description',
                                    images: buffer
                                }));
                                buffer = [];
                            }
                        });
                        if (buffer.length) {
                            ws.send(JSON.stringify({
                                command: 'description',
                                images: buffer
                            }));
                        }
                    });
                    break;
                case 'launch':
                    self.launch(cached, message, function (data, key_digest, private_key, kp_token, ami) {
                        if (!data.error && key_digest) {
                            var _data = {
                                command: 'launch',
                                private_key: private_key,
                                key_digest: key_digest,
                                reservation_id: data.ReservationId,
                                state: data.Instances[0].State.Name,
                                key_name: kp_token,
                                time: data.LaunchTime,
                                ami: ami
                            };
                            ws.send(JSON.stringify(_data));
                            var counter = 0,
                                _id;
                            _id = setInterval(function () {
                                if (counter++ > 20) clearInterval(_id);
                                self.status(cached, _data, function () {
                                    console.log(arguments.Reservations[0]);
                                });
                            }, 5000);
                        } else {
                            ws.send(JSON.stringify(data));
                        }
                    });
                    break;
            }
        });
    });


};

