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

    var items = $('#main .message');
    for (var j = 0; j < items.length; j++) {
        var item = $(items[j]);
        var author = item.find('.author').html;
        if (author != '官方') {
            if (index == 0) {
                item.css('display', 'block');
            }
            else if (index == 1) {
                item.css('display', 'none');
            }
        }
    }
}

function AddMessage(msg, isToTop) {
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
    if (isToTop) {
        $api.prepend($main, message);
    }
    else {
        $api.append($main, message);
    }
}

//发送留言
function SendMessage() {
    var $contentDom = $api.dom('#sendMessageContent');
    var $content = $api.val($contentDom);
    var $uid = $api.getStorage('accountInfo').uid;
    var $author = $api.getStorage('accountInfo').username;
    $.post('http://' + GetServerHost() + "/message", {
        uid: $uid,
        author: $author,
        content: $content
    }, function (data, status) {
        console.log(data.msg);
        if (data.returnCode == 0) {
            var msg = new Message();
            msg.uid = $uid;
            msg.author = $author;
            msg.content = $content;
            msg.like = 0;
            msg.time = '刚刚';
            AddMessage(msg, true);
            SwitchMessageLeaveContainer(false);
        }
        alert(data.msg);
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
    console.log("a");
    var title = $('#writeMessage div.title');
    var titleLineHeight = title.css("height");
    title.css({"line-height": titleLineHeight});

    var submitBtn = $('#writeMessage div.aui-btn');
    var submitBtnLineHeight = submitBtn.css("height");
    submitBtn.css({"line-height": submitBtnLineHeight});
}

function QueryMessage() {
    $.get("http://" + GetServerHost() + "/message", function (data, status) {
        var obj = data;
        console.log("获取到" + obj.length + "条数据");
        for (var i = 0; i < obj.length; i++) {
            var json = obj[i];
            var msg = new Message();
            msg.uid = json.uid;
            msg.author = json.author;
            msg.content = json.content;
            msg.like = json.like;
            msg.time = json.time;

            AddMessage(msg);
        }
    });
}