/**
 * Created by Chen on 2015-09-29.
 */
var canvas,
    context,
    app,
    waterParticles = [],
    player,
    playerArray = [],
    mouse = {x:0,y:0,worldx:0,worldy:0,kami:null};

var resizeCanvas = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

var update = function () {
    //更新玩家
    for(id in playerArray) {
        playerArray[id].update(mouse);
    }
};

var draw = function () {
    //绘制玩家
    for(id in playerArray) {
        playerArray[id].draw(context);
    }
};

var runLoop = function () {
    update();
    draw();
};

//初始化事件
var initEvent = function () {
    window.addEventListener('resize', resizeCanvas, false);
    setInterval(runLoop,30);
};

//构造体
(function () {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    resizeCanvas();

    for (var i = 0; i < 150; i++) {
        //waterParticles.push(new WaterParticle());
    }

    player = new Kami();
    player.id = -1;
    playerArray[player.id] = player;


    initEvent();
})();
