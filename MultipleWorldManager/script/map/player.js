/**
 * Created by Chen on 2015-10-01.
 */

//玩家
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

    }
};

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