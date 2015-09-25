/**
 * Created by Chen on 2015-09-22.
 */

//立即执行以下函数
(function () {
    var d = document,
        w = window,
        p = parseInt,
        dd = d.documentElement,
        db = d.body,
        dc = d.compatMode == 'CSS1Compat',
        dx = dc ? dd : db,
        ec = encodeURIComponent,
        wsURL = "ws://192.168.0.151:3000",//默认服务器地址
        serverConfig = $api.getStorage('MWM_Server');

    if (serverConfig) {
        wsURL = "ws://" + serverConfig['url'] + ":" + port;
    }

    //聊天逻辑处理对象
    w.CHAT = {
        msgObj: d.getElementById("message"),
        screenheight: w.innerHeight ? w.innerHeight : dx.clientHeight,
        username: null,
        userid: null,
        portraitimg: '../image/defaultChatPortrait.jpg',
        socket: null,
        //让浏览器滚动条保持在最低部
        scrollToBottom: function () {
            w.scrollTo(0, this.msgObj.clientHeight);
        },
        //退出，本例只是一个简单的刷新
        logout: function () {
            //this.socket.disconnect();
            location.reload();//强制刷新
        },
        //提交聊天消息内容
        submit: function () {
            var content = d.getElementById("content").value;
            if (content != '') {
                var obj = {
                    userid: this.userid,
                    username: this.username,
                    content: content
                };
                this.socket.emit('message', obj);
                d.getElementById("content").value = '';
            }
            return false;
        },
        genUid: function () {
            return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100);
        },

        //更新系统消息，本例中在用户加入、退出的时候调用
        updateSysMsg: function (o, action) {
            //当前在线用户列表
            var onlineUsers = o.onlineUsers;
            //当前在线人数
            var onlineCount = o.onlineCount;
            //新加入用户的信息
            var user = o.user;

            //更新在线人数
            var userhtml = '';
            var separator = '';
            for (key in onlineUsers) {
                if (onlineUsers.hasOwnProperty(key)) {
                    userhtml += separator + onlineUsers[key];
                    separator = '、';//分隔符
                }
            }
            d.getElementById("onlinecount").innerHTML = '当前共有 ' + onlineCount + ' 人在线，在线列表：' + userhtml;

            //添加系统消息
            var html = '';
            html += '<div class="msg-system">';
            html += user.username;
            html += (action == 'login') ? ' 加入了聊天室' : ' 退出了聊天室';
            html += '</div>';
            var section = d.createElement('section');
            section.className = 'system J-mjrlinkWrap J-cutMsg';
            section.innerHTML = html;
            this.msgObj.appendChild(section);
            this.scrollToBottom();
        },
        init: function () {
            /*
             客户端根据时间和随机数生成uid,这样使得聊天室用户名称可以重复。
             实际项目中，如果是需要用户登录，那么直接采用用户的uid来做标识就可以
             */
            this.userid = $api.getStorage('uid');
            this.username = $api.getStorage('username');

            d.getElementById("showusername").innerHTML = this.username;//显示名字
            this.msgObj.style.minHeight = (this.screenheight - db.clientHeight + this.msgObj.clientHeight) + "px";
            this.scrollToBottom();

            //连接websocket后端服务器
            this.socket = io.connect(wsURL);

            //告诉服务器端有用户登录
            this.socket.emit('login', {userid: this.userid, username: this.username});

            //监听新用户登录
            this.socket.on('login', function (o) {
                CHAT.updateSysMsg(o, 'login');
            });

            //监听用户退出
            this.socket.on('logout', function (o) {
                CHAT.updateSysMsg(o, 'logout');
            });

            //监听消息发送
            this.socket.on('message', function (obj) {
                var isme = (obj.userid == CHAT.userid) ? true : false;
                var contentDiv = '<div>' + obj.content + '</div>';
                var usernameDiv = '<span class="chatPortrait" style="background-image: url(' + CHAT.portraitimg + ')"></span>';

                var section = d.createElement('section');
                if (isme) {
                    section.className = 'user';
                    section.innerHTML = contentDiv + usernameDiv;
                } else {
                    section.className = 'service';
                    section.innerHTML = usernameDiv + contentDiv;
                }
                CHAT.msgObj.appendChild(section);
                CHAT.scrollToBottom();
            });

        }
    };
})();