var mysql = require('mysql');
var async = require('async');
var db_config = require('./db_config');
var pool = mysql.createPool(db_config);

exports.getSeniorList = function(user_id, done){
    pool.getConnection(function(err, conn) {
        if (err) {
            console.error("socialWorkerModel pool.getConnection error : ", err);
            conn.release();
            done(2);
        }
        else {
            var sql = "SELECT id, name, profile_name, gender, phone, push_id, description, address FROM USER INNER JOIN (SELECT id_to FROM SOCIALWORKER WHERE id_from=?) sw ON USER.id = sw.id_to";
            conn.query(sql, user_id, function(err, rows){
                if (err){
                    console.error("socialWorkerModel conn.query error : ", err);
                    conn.release();
                    done(2, null);
                }
                else{
                    conn.release();
                    done(0, rows);
                }
            });
        }
    });
};

exports.getSeniorProjectList = function(user_id, done){
    pool.getConnection(function(err, conn) {
        if (err) {
            console.error("socialWorkerModel pool.getConnection error : ", err);
            conn.release();
            done(2);
        }
        else {
            var sql = "SELECT id, name, profile_name, gender, phone, push_id, description, address FROM USER INNER JOIN (SELECT id_to FROM PROJECT WHERE id_from=?) sw ON USER.id = sw.id_to";
            conn.query(sql, user_id, function(err, rows){
                if (err){
                    console.error("socialWorkerModel conn.query error : ", err);
                    conn.release();
                    done(2, null);
                }
                else{
                    conn.release();
                    done(0, rows);
                }
            });
        }
    });
};

exports.add = function(socialworker_id, datas, done){
    pool.getConnection(function(err, conn) {
        if (err) {
            console.error("socialWorkerModel pool.getConnection error : ", err);
            conn.release();
            done(2);
        }
        else {
            async.waterfall([
                function(callback){
                    var sql = "SELECT count(*) as cnt FROM USER WHERE id=?";
                    conn.query(sql, datas[0], callback);
                },
                function(rows, field, callback){
                    if (!rows[0].cnt){
                        var sql = "INSERT INTO USER(id, password, name, gender, kind, phone, push_id, description, address) VALUES(?,?,?,?,?,?,?,?,?)";
                        conn.query(sql, datas, callback);
                    }
                    else{
                        console.log("duplicated id");
                        callback(null, -1);
                    }
                }
            ],function(err, status){
                if (err){
                    conn.release();
                    console.error("mobile userModel error ", err);
                    done(2);
                }
                else{
                    if (status == -1){
                        conn.release();
                        done(100);
                    }
                    else{
                        var sql = "INSERT INTO SOCIALWORKER(id_from, id_to) VALUES(?, ?)";
                        console.log(socialworker_id+ " " + datas[0]);
                        conn.query(sql, [socialworker_id, datas[0]], function(err, row){
                            if (err){
                                console.error(err);
                                conn.release();
                                done(2);
                            }
                        });
                        conn.release();
                        done(0);
                    }
                }
            });
        }
    });
};

exports.deleteSenior = function(user_id, done)
{
    pool.getConnection(function(err, conn) {
        if (err) {
            console.error("socialWorkerModel pool.getConnection error : ", err);
            conn.release();
            done(2);
        }
        else {
            var sql = "DELETE FROM USER WHERE id=?";
            conn.query(sql, user_id, function(err, row){
               if (err){
                   console.error(err);
                   conn.release();
                   done(2);
               }
            });
            conn.release();
            done(0);
        }
    });
};