//登陆游戏
//todo:未完成
function Login(username, password) {
    var token = '123456789';
    return token;
}

function SetStorageJsonData(storageKey, dataKey, dataValue) {
    var data = $api.getStorage(storageKey);
    data[dataKey] = dataValue;
    $api.setStorage(storageKey, data);
}

function InitConfig() {
    //配置服务器信息
    $api.setStorage('MWM_Server', {
        url: '192.168.0.151',
        port: '3000'
    });
    $api.setStorage('MWM_APP', {
        version: '0.0.1',
        author: 'moonrailgun'
    });

    //测试数据-用户信息
    $api.setStorage('accountInfo', {
        uid: 1000,
        username:"moonrailgun"
    });
}

/**
 * @return {string}
 */
function GetServerHost() {
    var server = $api.getStorage('MWM_Server');
    if (server) {
        return server['url'] + ':' + server['port'];
    }
    else {
        return '127.0.0.1:3000';
    }
}