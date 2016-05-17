var mysql = require('mysql');
var db_config = require('../db_config');
var pool = mysql.createPool(db_config);

exports.getList = function(datas, done){
    var user_id = datas[0];
    var page_num = datas[1];
    var size = 8;
    var startNum = (page_num-1)*size;

    pool.getConnection(function(err, conn){
        if (err){
           console.error("mobile familyModel pool.getConnection error : ", err);
           conn.release();
           done(2);
        }
        else{
           var sql = "SELECT id, name, profile_name, gender, phone, push_id, description, address FROM USER INNER JOIN (SELECT id_to FROM FAMILY WHERE id_from=?) familys ON USER.id = familys.id_to LIMIT ?, ?";
            conn.query(sql, [user_id, startNum, size], function(err, rows){
                if (err){
                    console.error("mobile familyModel conn.query error : ", err);
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