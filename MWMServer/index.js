/**
 * Created by Chen on 2015-09-21.
 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var router = require('./router');
var chatting = require('./chatting');

router.InitRouter(app);//初始化路由
chatting.InitChatting(io);//初始化聊天室

http.listen(3000, function () {
    console.log('listening on *:3000');
});