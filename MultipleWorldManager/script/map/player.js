/**
 * Created by Chen on 2015-10-01.
 */

//玩家对象
var Kami = function () {
    var kami = this;

    //初始位置
    this.x = 0;
    this.y = 0;
    this.size = 4;

    this.name = '';
    this.faction = '';//阵营

    this.hover = false;

    this.momentum = 0;
    this.maxMomentum = 3;
    this.angle = Math.PI * 2;//方向角

    this.targetX = 0;
    this.targetY = 0;
    this.targetMomentum = 0;

    this.messages = [];
    this.timeSinceLastActivity = 0;

    this.changed = 0;
    this.timeSinceLastServerUpdate = 0;//向服务器更新的时间

    this.update = function () {
        kami.timeSinceLastServerUpdate++;//增加最后一次服务器更新时间

        //位移
        kami.x += Math.cos(kami.angle) * kami.momentum;
        kami.y += Math.sin(kami.angle) * kami.momentum;
        //惯性
        if (kami.targetX != 0 || kami.targetY != 0) {
            kami.x += (kami.targetX - kami.x) / 20;
            kami.y += (kami.targetY - kami.y) / 20;
        }

        //更新聊天记录
        for (var i = kami.messages.length - 1; i >= 0; i++) {
            var msg = kami.messages[i];
            msg.update();

            if (msg.age >= msg.maxAge) {
                //从数组中删除该条数据
                kami.messages.splice(i, 1);
            }
        }

        // Update tadpole hover/mouse state
    };

    this.userUpdate = function(kamis, angleTargetX, angleTargetY) {
        var prevState = {
            angle: kami.angle,
            momentum: kami.momentum
        };

        //角度变化
        var anglediff = ((Math.atan2(angleTargetY - kami.y, angleTargetX - kami.x)) - kami.angle);
        //将角度变化大小区间设定为[-pi,pi]
        while(anglediff < -Math.PI)
        {
            anglediff += Math.PI * 2;
        }
        while(anglediff > Math.PI) {
            anglediff -= Math.PI * 2;
        }

        kami.angle += anglediff / 5;//每次只修改变化的1/5，使其有变化，不生硬

        //动力变化
        if(kami.targetMomentum != kami.momentum) {
            kami.momentum += (kami.targetMomentum - kami.momentum) / 20;
        }

        if(kami.momentum < 0) {
            kami.momentum = 0;
        }
        kami.changed += Math.abs((prevState.angle - kami.angle)*3) + kami.momentum;

        if(kami.changed > 1) {
            this.timeSinceLastServerUpdate = 0;
        }
    };

    this.draw = function(context){
        //kami.x+=1;kami.y+=1;

        //透明度变化
        var opacity = Math.max(Math.min(20 / Math.max(kami.timeSinceLastServerUpdate-300,1),1),.2).toFixed(3);//四舍五入保留三位小数

        if(kami.hover && isAuthorized()){
            context.fillStyle = 'rgba(192, 253, 247,'+opacity+')';
        }
        else{
            context.fillStyle = 'rgba(226,219,226,'+opacity+')';
        }

        //设置阴影
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 6;
        context.shadowColor = 'rgba(255,255,255,'+opacity*0.7+')';

        //绘制圆形
        context.beginPath();
        context.arc(kami.x, kami.y,kami.size,kami.angle + Math.PI * 2.7,kami.angle+Math.PI * 1.3,true);

        kami.tail.draw(context);

        context.closePath();
        context.fill();

        context.shadowBlur = 0;
        context.shadowColor = '';

        drawName(context);
        drawMessage(context);
    };

    var isAuthorized = function() {
        return tadpole.name.charAt('0') == "@";
    };

    //绘制名字
    var drawName = function(context){

    };

    //绘制消息
    var drawMessage = function(context){

    };

    // 构造函数
    (function() {
        kami.tail = new Tail(kami);
    })();
};

var Tail = function(kami){
    var tail = this;
    tail.joints = [];

    var kami = kami;
    var jointSpacing = 1.4;//节点距离
    var animationRate = 0;

    this.update = function(){
        animationRate += (.2 + kami.momentum / 10);
    };

    this.draw = function(){
        var path = [[],[]];

        //预留
    };

    (function() {
        for(var i = 0; i < 15; i++) {
            tail.joints.push({
                x: 0,
                y: 0,
                angle: Math.PI*2
            })
        }
    })();
}

//聊天信息
var Message = function (msg) {
    var message = this;

    this.age = 1;
    this.maxAge = 300;

    this.message = msg;

    this.update = function () {
        this.age++;
    }
};