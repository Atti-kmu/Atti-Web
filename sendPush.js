var gcm = require('node-gcm');

exports.send = function (sender_id, sender_profile, clientKey) {
    var message = new gcm.Message();
    var message = new gcm.Message({
        collapseKey: 'atti',
        priority: 'high',
        delayWhildIdle: true,
        timeToLive: 3,
        data: {
            sender_id : sender_id,
            sender_profile : sender_profile
        }
    });
    var server_access_key = "AIzaSyBShibgEKow7Qqsen5XzbT0oyiI2J2Hnj8";
    var sender = new gcm.Sender(server_access_key);

    sender.send(message, clientKey, 10, function (err, result) {
        console.log(result);
    });
}