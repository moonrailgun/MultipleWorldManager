/**
 * Created by Chen on 2015-09-21.
 */
console.time("程序初始化用时");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var router = require('./router');
var chatting = require('./chatting');

router.InitRouter(app);//初始化路由
chatting.InitChatting(io);//初始化聊天室

http.listen(3000, function () {
    console.timeEnd("程序初始化用时");
    console.log('正在监听 *:3000');
});