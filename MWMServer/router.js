/**
 * Created by Chen on 2015-09-21.
 */

//app为express对象
function InitRouter(app) {
    //express配置
    app.locals.title = "MWMServer";

    app.get('/', function (req, res) {
        res.send('<h1 style="text-align: center; line-height: 70px;">请不要尝试直接连接服务器</h1>');
    });
    app.get('/login', function (req, res) {
        res.send('login');
    });
}

exports.InitRouter = InitRouter;
