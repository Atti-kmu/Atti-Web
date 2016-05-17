var easyimage = require('easyimage');

var userModel = require('../../models/mobile/userModel');
var db_crypto = require('../../models/db_crypto');
var status_code = require('../../status_code');

exports.join = function(req, res)
{
    // parameter check
    if (!req.body.id || !req.body.password || !req.body.name || !req.body.gender || !req.body.kind ){
        return res.json({
            "status" : 1,
            "message" : status_code[1]
        });
    }
    // password checker
    else if(!validatePassword(req.body.password)){
        return res.json({
           "status" : 101,
            "message" : status_code[101]
        });
    }
    else{
        var user_data = [
            req.body.id, db_crypto.do_ciper(req.body.password),
            req.body.name,req.body.gender,
            req.body.kind, req.body.phone,
            req.body.push_id, req.body.description,
            req.body.address
        ];
        userModel.join(user_data, function(status){
            return res.json({
               "status" : status,
                "message" : status_code[status]
            });
        });
    }
};

exports.login = function(req, res)
{
    // parameter check
    if (!req.body.id || !req.body.password){
        return res.json({
            "status" : 1,
            "message" : status_code[1]
        });
    }
    else{
        var user_data = [
            req.body.id, db_crypto.do_ciper(req.body.password)
        ];
        userModel.login(user_data, function(status){
            if (!status){
               req.session.user_id = req.body.id;
            }
            return res.json({
               "status" : status,
                "message" : status_code[status]
            });
        });
    }
};

exports.logout = function(req, res)
{
    req.session.destroy();

    return res.json({
        "status" : 0,
        "message" : status_code[0]
    });
};

exports.isLogin = function(req, res, next)
{
    if (req.session.user_id) {
        next();
    }
    else {
        return res.json({
            "status" : 110,
            "message" : status_code[110]
        });
    }
};

exports.getMyInfo = function(req, res)
{
    userModel.getMyInfo(req.session.user_id, function(status, info){
        return res.json({
           "status" : status,
            "message" : status_code[status],
            "my_info" : info
        });
    });
};

exports.uploadProfile = function(req, res)
{
    var filename = req.session.user_id+'.'+req.file.originalname.split('.').pop();
    var filepath = 'public/images/profile/'+filename;

    easyimage.rescrop({
       src: filepath, dst: filepath,
        width:250, height:250
    }).then(
        function(image){
            userModel.uploadProfile([filename, req.session.user_id], function(status){
                return res.json({
                    "status" : status,
                    "message" : status_code[status]
                });
            });
        },
        function(err){
            console.error("userCtrl uploadProfile error : ", err);
            res.json({
                "status" : 115,
                "message" : status_code[115]
            })
        }
    );
};

// 7 to 15 characters which contain at least one numeric digit and a special character
function validatePassword(user_password) {
    var pattern=  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
    if(user_password.match(pattern)){
        return true;
    }
    else{
        return false;
    }
}