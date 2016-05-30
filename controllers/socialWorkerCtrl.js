var unirest = require('unirest');
var async = require('async');

var socialWorkerModel = require('../models/socialWorkerModel');
var db_crypto = require('../models/db_crypto');
var status_code = require('../status_code');

// main : 로고 클릭시 리다이렉트, 사회복지사 정보
// senior : 사회복지사가 담당하는 독거노인 리스트
// project : 독거노인 친구만들기 사업에 참여하는 리스트
// search : 독거노인 찾기
exports.getSeniorList = function(req, res)
{
    socialWorkerModel.getSeniorList(req.session.user_id, function(status, list){
       if (!status){
           return res.render('seniorList', {list: list})
       }
        else{
           return res.redirect('back');
       }
    });
};

exports.call = function(req, res)
{
    return res.render('call', {receiver: req.params.receiver});
};

exports.call2 = function(req, res)
{
    console.log(req.body.receiver);
    console.log(req.body.channel);
};

exports.callee = function(req, res)
{
    //console.log(req.body.receiver);
    //console.log(req.body.channel);
    //socialWorkerModel.call(req.body.receiver, function(status){
    //
    //});
    return res.render('callee');
};

exports.addSenior = function(req, res)
{
    var phone = req.body.tel1 + '-' + req.body.tel2 + '-' + req.body.tel3;
    // parameter check
    if (!req.body.user_id || !req.body.password || !req.body.name || !req.body.gender || !req.body.kind ){
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
        socialWorkerModel.add(req.session.user_id, user_data, function(status){
            console.log(status);
            if (!status){
                socialWorkerModel.getSeniorList(req.session.user_id, function(status, list){
                    if (!status){
                        return res.render('seniorList', {list: list})
                    }
                    else{
                        return res.redirect('back');
                    }
                });
            }
            else{
                return res.redirect('back');
            }

        });
    }
};

exports.deleteSenior = function(req, res)
{

};

exports.getSeniorDetails = function(req, res)
{
    socialWorkerModel.deleteSenior(req.params.user_id, function(status){
        if (!status){
            socialWorkerModel.getSeniorList(req.session.user_id, function(status, list){
                if (!status){
                    return res.render('seniorList', {list: list})
                }
                else{
                    return res.redirect('back');
                }
            });
        }
        else{
            return res.redirect('back');
        }
    });
};

exports.addSeniorNeibors = function(req, res)
{

};

exports.modifySeniorInfo = function(req, res)
{

};

exports.deleteSeniorNeibors = function(req, res)
{

};

exports.getSeniorProjectList = function(req, res)
{
    socialWorkerModel.getSeniorProjectList(req.session.user_id, function(status, list){
        if (!status){
            return res.render('seniorProjectList', {list: list})
        }
        else{
            return res.redirect('back');
        }
    });
};

exports.addSeniorProject = function(req, res)
{

};

exports.deleteSeniorProject = function(req, res)
{

};

exports.getSeniorAddForm = function(req, res)
{
    return res.render('senior_form');
};