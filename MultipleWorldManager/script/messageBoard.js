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
    if(msg.uid == 0){img = '../image/DefaultPortrait.jpg';}
    else{img = 'http://'+GetServerHost()+'/portrait?uid='+msg.uid;}
    message += '<img class="chatPortrait" src="'+img+'"/>';
    message += '<div class="messageInfo">';
    message += '<div class="author">'+msg.author+'</div>';
    message += '<div class="content">'+msg.content+'</div>';
    message += '<div class="like"><span class="aui-iconfont aui-icon-likefill"></span><span class="like-num">'+msg.like+'</span></div>';
    message += '</div><div class="time">'+msg.time+'</div></div>';

    $api.append($main, message);
}