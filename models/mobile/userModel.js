var mysql = require('mysql');
var db_config = require('../db_config');
var pool = mysql.createPool(db_config);
var async = require('async');

exports.join = function(user_data, done){
    pool.getConnection(function(err, conn){
        if (err){
           console.error("mobile userModel pool.getConnection error : ", err);
           conn.release();
           done(2);
        }
        else {
            async.waterfall([
                function(callback){
                    var sql = "SELECT count(*) as cnt FROM USER WHERE id=?";
                    conn.query(sql, user_data[0], callback);
                },
                function(rows, field, callback){
                    if (!rows[0].cnt){
                        var sql = "INSERT INTO USER(id, password, name, gender, kind, phone, push_id, description, address) VALUES(?,?,?,?,?,?,?,?,?)";
                        conn.query(sql, user_data, callback);
                    }
                    else{
                        console.log("duplicated id");
                        callback(null, -1);
                    }
                }
            ],function(err, status){
                conn.release();
                if (err){
                    console.error("mobile userModel error ", err);
                    done(2);
                }
                else{
                    if (status == -1){
                        done(100);
                    }
                    else{
                        done(0);
                    }
                }
            });
        }
    });
};

exports.login = function(user_data, done){
    pool.getConnection(function(err, conn) {
        if (err) {
            console.error("mobile userModel pool.getConnection error : ", err);
            conn.release();
            done(2);
        }
        else {
            var sql = "SELECT count(*) as cnt FROM USER WHERE id=? and password=?";
            conn.query(sql, user_data, function(err, rows){
                conn.release();
                if (err){
                    console.error("mobile userModel error ", err);
                    done(2);
                }
                else if (!rows[0].cnt) {
                    done(111);
                }
                else{
                    done(0);
                }
            });
        }
    });
};

exports.getMyInfo = function(user_id, done){
    pool.getConnection(function(err, conn){
        if (err){
            console.error("mobile userModel pool.getConnection error : ", err);
            conn.release();
            done(2);
        }
        else{
            var sql = "SELECT id, profile_name, name, gender, kind, phone, address FROM USER WHERE id=?";
            conn.query(sql, user_id, function(err, rows){
                conn.release();
                if (err){
                    console.error("mobile userModel error ", err);
                    done(2);
                }
                else if (rows.length){
                    done(0, rows);
                }
                else{
                    done(2, null);
                }
            });
       }
    });
};

exports.uploadProfile = function(user_data, done){
    pool.getConnection(function(err, conn){
        if (err){
           console.error("mobile userModel pool.getConnection error : ", err);
           conn.release();
           done(2);
        }
        else{
            var sql = "UPDATE USER SET profile_name = ? WHERE id=?";
            conn.query(sql, user_data, function(err, rows) {
                conn.release();
                if (err) {
                    console.error("mobile userModel error ", err);
                    done(2);
                }
                else if (rows.affectedRows) {
                    done(0, rows);
                }
                else {
                    done(2, null);
                }
            });
        }
    });
};

// push_id, id, profile_name, name
exports.getCallInfo = function(user_data, done){
    var sender = user_data[0];
    var receiver = user_data[1];

    pool.getConnection(function(err, conn){
        if (err){
           console.error("mobile userModel pool.getConnection error : ", err);
           conn.release();
           done(2);
        }
        else{
            async.parallel([
                function(callback){
                    var sql = "SELECT push_id FROM USER WHERE id=?";
                    conn.query(sql, receiver, callback);
                },
                function(callback){
                    var sql = "SELECT name, profile_name FROM USER WHERE id=?";
                    conn.query(sql, sender, callback);
                }
            ],
            function(err, results){
                if (err){
                    console.error("mobile userModel error ", err);
                    done(2, null);
                }
                else{
                    done(0, results);
                }
            });
       }
    });
};