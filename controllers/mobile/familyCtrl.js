var familyModel = require('../../models/mobile/familyModel');
var status_code = require('../../status_code');

exports.getList = function(req, res){
    var datas = [req.session.user_id, req.params.page_num];
    familyModel.getList(datas, function(status, familyList){
       return res.json({
          "status" : status,
           "message" : status_code[status],
           "family_list" : familyList
       });
    });
};