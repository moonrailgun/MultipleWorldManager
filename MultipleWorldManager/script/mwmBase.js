//登陆游戏
function Login(username, password) {
	var token = '123456789';
	return  token;
}

function SetStorageJsonData(storageKey,dataKey,dataValue)
{
	var data = $api.getStorage(storageKey);
	data[dataKey] = dataValue;
	$api.setStorage(storageKey, data);
}

function InitConfig(){
	//配置服务器信息
	$api.setStorage('MWM_Server',{
		url:'192.168.0.151',
		port:'3000'
	});
	$api.setStorage('MWM_APP',{
		version:'0.0.1',
		author:'moonrailgun'
	});
}