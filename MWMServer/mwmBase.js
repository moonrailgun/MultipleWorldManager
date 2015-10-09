/**
 * Created by Chen on 2015-10-06.
 */

var mwmSql = require('./mwmSql');

//应用通用模块

//检查UUID合法性。如果合法则调用func回调。参数为uid，如果不合法直接抛弃
function CheckUUID(uuid, func) {
    var sql = "SELECT * FROM account WHERE uuid='" + uuid + "' LIMIT 1";
    mwmSql.query(sql, function (data) {
        var uid;
        if (data.length > 0) {
            uid = data[0].uid;
            func(uid);
        } else {
            console.log("不合法的UUID");
        }
    });
}

exports.CheckUUID = CheckUUID;