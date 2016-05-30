var friendshipModel = require('../models/friendshipModel');
var status_code = require('../status_code');

exports.getList = function(req, res){
    var datas = [req.session.user_id, req.params.page_num];
    friendshipModel.getList(datas, function(status, friendshipList){
        return res.json({
            "status" : status,
            "message" : status_code[status],
            "friendship_list" : friendshipList
        });
    });
};