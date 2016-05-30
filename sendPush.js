var gcm = require('node-gcm');

exports.send = function (sender_name, sender_profile, clientKey, channel) {
    var message = new gcm.Message({
        collapseKey: 'atti',
        priority: 'high',
        delayWhildIdle: true,
        timeToLive: 3,
        data: {
            sender_name : sender_name,
            sender_profile : sender_profile,
            channel : channel
        }
    });

    // GCM Server key
    var server_access_key = "";
    var sender = new gcm.Sender(server_access_key);

    sender.send(message, clientKey, 1, function (err, result) {
        console.log(result);
    });
}
