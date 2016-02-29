exports.ip = function (request) {
    var forwarded;
    if ((forwarded = request.headers['x-forwarded-for'])) {
        if (forwarded.indexOf(', ')) {
            return forwarded.split(', ')[0];
        } else {
            return forwarded;
        }
    } else {
        return request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
    }
};

exports.random = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.oneof = function (str, set) {
    var i = 0;
    for (i; i < set.length; i++) {
        if (str.toLowerCase().indexOf(set[i].toLowerCase()) > -1) {
            return true;
        }
    } return false;
};

exports.token = function () {
    return (Math.random() + 1).toString(36).substring(2, 8);
};
