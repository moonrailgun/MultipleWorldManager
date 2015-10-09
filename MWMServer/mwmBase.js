/**
 * Created by Chen on 2015-10-06.
 */

var mwmSql = require('./mwmSql');
var randomWord = require('./randomWord');

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

//给某UID创建UUID并返回创建的值
function CreateUUID(uid, func) {
    var uuid = randomWord.Generate(20);
    var sql = "UPDATE account SET uuid = '" + uuid + "' WHERE uid = '" + uid + "' ";
    mwmSql.query(sql, function (data) {
        func(uuid);
    });
}

/*
 //无参多任务模块
 //未测试
 var MultiTasks = function(){
 var taskQueue = [];
 var taskIndex = 0;
 var currentIndex = 0;

 this.Task = function(func){
 this.taskName = "";
 this.func = func;//任务函数
 };

 this.push = function(task){
 taskqueue.push(task);
 };

 this.startQueue = function(){
 if(taskQueue.length > 0)
 {
 for(var i = 0;i<taskQueue.length;i++)
 {
 var task = taskQueue[i];
 task.func();
 }
 }
 };
 };*/

exports.CheckUUID = CheckUUID;
exports.CreateUUID = CreateUUID;