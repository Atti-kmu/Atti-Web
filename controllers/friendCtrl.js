var friendModel = require('../models/friendModel');
var status_code = require('../status_code');

exports.getList = function(req, res){
    var datas = [req.session.user_id, req.params.page_num];
    friendModel.getList(datas, function(status, friendList){
        return res.json({
            "status" : status,
            "message" : status_code[status],
            "friend_list" : friendList
        });
    });
};