var status_code = require('../status_code');
var sendPush = require('../sendPush');
var userModel = require('../models/userModel');

exports.call = function(req, res){
    if (!req.body.receiver || !req.body.channel){
        return res.json({
            "status" : 1,
            "message" : status_code[1]
        });
    }

    console.log(req.body.receiver);
    var user_data = [req.session.user_id, req.body.receiver];
    userModel.getCallInfo(user_data, function(status, info){
        var receiver_push_id = info[0][0][0].push_id;
        var sender_name = info[1][0][0].name;
        var sender_profile = info[1][0][0].profile_name;

        sendPush.send(sender_name, sender_profile, receiver_push_id, req.body.channel);

        return res.json({
            "status": 0,
            "message": status_code[0]
        })
    });
};
