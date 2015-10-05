/**
 * Created by Chen on 2015-10-03.
 */

//消息类
var Message = function () {
    this.uid = 0;//默认图片
    this.author = '';
    this.content = '';
    this.like = 0;
    this.time = '';
};

function SwitchMessage(obj, index) {
    var doms = $api.domAll('.aui-tab-nav li');
    for (var i = 0; i < doms.length; i++) {
        $api.removeCls(doms[i], 'active');
    }
    $api.addCls(obj, 'active');
}

function AddMessage(msg) {
    var message = '',
        img = '';
    $main = $api.dom('#main');
    message += '<div class="message">';
    if (msg.uid == 0) {
        img = '../image/DefaultPortrait.jpg';
    }
    else {
        img = 'http://' + GetServerHost() + '/portrait?uid=' + msg.uid;
    }
    message += '<img class="chatPortrait" src="' + img + '"/>';
    message += '<div class="messageInfo">';
    message += '<div class="author">' + msg.author + '</div>';
    message += '<div class="content">' + msg.content + '</div>';
    message += '<div class="like"><span class="aui-iconfont aui-icon-likefill"></span><span class="like-num">' + msg.like + '</span></div>';
    message += '</div><div class="time">' + msg.time + '</div></div>';

    $api.append($main, message);
}

//发送留言
function SendMessage() {
    var $contentDom = $api.dom('#sendMessageContent');
    var $content = $api.html($contentDom);
    var $uid = $api.getStorage('accountInfo').uid;
    var $author = $api.getStorage('accountInfo').username;
    $.post('http://' + GetServerHost() + "/message", {
        uid: $uid,
        author: $author,
        content: $content
    }, function (data, status) {
        alert(data.msg);
        if (data.returnCode == 0) {
            var msg = new Message();
            msg.uid = $uid;
            msg.author = $author;
            msg.content = $content;
            msg.like = 0;
            msg.time = '刚刚';
            AddMessage(msg);
        }
    });
}

function SwitchMessageLeaveContainer(isShow) {
    var container = $('#writeMessageContainer');
    if (isShow) {
        container.addClass('active');
        MessageUIInit();
    }
    else {
        container.removeClass('active');
    }
}

function MessageUIInit() {
    var title = $('#writeMessage div.title');
    var titleLineHeight = title.css("height");
    title.css({"line-height": titleLineHeight});

    var submitBtn = $('#writeMessage div.aui-btn');
    var submitBtnLineHeight = submitBtn.css("height");
    submitBtn.css({"line-height": submitBtnLineHeight});
}