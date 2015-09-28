/**
 * Created by Chen on 2015-09-26.
 */
    
var mysql = require('mysql');

function query(sql, func) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mwm'
    });
    var result = {};

    connection.connect();//打开连接
    connection.query(sql, function (err, res, fields) {
        if (err) throw err;
        func(res);//回调函数
        //console.log(res);
    });
    connection.end();//关闭连接
}

exports.query = query;