var easyimage = require('easyimage');

var userModel = require('../models/userModel');
var db_crypto = require('../models/db_crypto');
var status_code = require('../status_code');

/***        WEB          ***/
exports.main = function(req, res)
{
    userModel.getMyInfo(req.session.user_id, function(status, info){
        if (!status){
            return res.render('main', {title:'main', my_info:info[0][0]});
        }
        else{
            return res.redirect('back');
        }
    });
};

exports.loginForm = function(req, res)
{
    if (req.session.user_id){
        return res.redirect('/');
    }
    else {
        return res.render('login', {title: 'Login'});
    }
};

exports.joinForm = function(req, res)
{
    return res.render('join', {title: 'Join'});
};

exports.loginWeb = function(req, res)
{
    // parameter check
    if (!req.body.user_id || !req.body.password){
        return res.redirect('back');
    }
    else{
        var user_data = [
            req.body.user_id, db_crypto.do_ciper(req.body.password)
        ];
        userModel.login(user_data, function(status){
            if (!status){
                req.session.user_id = req.body.user_id;
                return res.redirect('/');
            }
            else{
                return res.redirect('back');
            }
        });
    }
};

exports.joinWeb = function(req, res)
{
    var phone = req.body.tel1 + '-' + req.body.tel2 + '-' + req.body.tel3;
    // parameter check
    if (!req.body.user_id || !req.body.password || !req.body.name || !req.body.gender || !req.body.kind ){
        return res.redirect('back');
    }
    // password checker
    else if(!validatePassword(req.body.password)){
        return res.redirect('back');
    }
    else{
        var user_data = [
            req.body.user_id, db_crypto.do_ciper(req.body.password),
            req.body.name,req.body.gender,
            req.body.kind, phone,
            req.body.push_id, req.body.description,
            req.body.address
        ];
        console.log(user_data);
        userModel.join(user_data, function(status){
            console.log(status);
            if (!status){
                return res.redirect('/user/login');
            }
            else{
                return res.redirect('back');
            }

        });
    }
};

exports.isLoginWeb = function(req, res, next)
{
    if (req.session.user_id)    {
        next();
    }
    else{
        return res.redirect('/user/login');
    }
};

exports.logoutWeb = function(req, res)
{
    req.session.destroy();

    return res.redirect('/user/login');
};

/***        MOBILE          ***/
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
    if (!req.body.id || !req.body.password || !req.body.push_id){
        return res.json({
            "status" : 1,
            "message" : status_code[1]
        });
    }
    else{
        var user_data = [
            req.body.id, db_crypto.do_ciper(req.body.password),
            req.body.push_id
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
            "my_info" : info[0][0],
            'socialworker_info' : info[1][0]
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