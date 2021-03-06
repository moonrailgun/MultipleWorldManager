/**
 * Created by Chen on 2015-10-06.
 */

/*
 ** randomWord 产生任意长度随机字母数字组合
 ** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
 */
//字典
var dir = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function randomWord(randomFlag, min, max) {
    var str = "",
        range = min;

    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;//范围生成
    }
    for (var i = 0; i < range; i++) {
        var pos = Math.round(Math.random() * (dir.length - 1));
        str += dir[pos];
    }
    return str;
}

function Generate(min, max) {
    if (arguments.length == 1) {
        return randomWord(false, min);
    }
    else {
        return randomWord(true, min, max);
    }
}

exports.Generate = Generate;