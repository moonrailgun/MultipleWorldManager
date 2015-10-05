/**
 * Created by Chen on 2015-09-21.
 */
var multiparty = require('multiparty');
var fs = require('fs');
var bodyParser = require('body-parser');
var mwmSql = require('./mwmSql');

//app为express对象
function InitRouter(app) {
    //todo:暂时设置为允许跨网请求数据
    //express配置
    app.locals.title = "MWMServer";
    //app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    //越上面优先级越高
    app.get('/', function (req, res) {
        res.send('<h1 style="text-align: center; line-height: 70px;">请不要尝试直接连接服务器</h1>');
    });

    app.post('/login', function (req, res) {
        //登陆
        console.log("账户登陆请求:");
        console.log(req.body);
        if (req.body.account != undefined && req.body.password != undefined) {
            var account = req.body.account;
            var password = req.body.password;
            var sql = "SELECT id,account,username FROM account WHERE account = '" + account + "' AND password = '" + password + "'";
            mwmSql.query(sql, function (ret) {
                console.log(ret);
                res.send(ret);
            })
        }
        else {
            console.log("错误:账号或密码为空");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send("错误:账号或密码为空");
        }
    });

    //头像处理
    app.get('/portrait', function (req, res) {
        var uid;
        if (uid = req.query.uid) {
            var path = '';
            path += './upload/portrait/' + uid + '.jpg';
            fs.exists(path, function (exists) {
                if (!exists) {
                    //如果头像图片不存在
                    console.log("请求的头像不存在。返回默认头像");
                    uid = 0;
                }

                var options = {
                    root: __dirname + '/upload/portrait/',
                    dotfiles: 'deny',
                    headers: {
                        'x-timestamp': Date.now(),
                        'x-sent': true
                    }
                };

                res.sendFile(uid + '.jpg', options, function (err) {
                    if (err) {
                        console.log(err);
                        res.status(err.status).end();
                    }
                    else {
                        console.log('Sent:', uid + '.jpg');
                    }
                });

            });
        } else {
            res.send('没有uid参数');
        }
    });
    app.post('/portrait', function (req, res) {
        console.log('头像上传请求:');
        console.log(req.body);
        var uid = req.body.uid;
        var img = req.body.img;
        //todo 现在是简单处理。数据信息未经过验证

        var base64Data = img.replace(/^data:image\/\w+;base64,/, "");//过滤data:URL
        var dataBuffer = new Buffer(base64Data, 'base64');
        fs.writeFile("./upload/portrait/" + uid + ".jpg", dataBuffer, function (err) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            if (err) {
                res.send(err);
            } else {
                res.send("上传成功！");
                console.log("上传成功！")
            }
        });
    });

    //留言处理
    app.get('/message', function (req, res) {
        //todo:暂时只查询最近30条数据
        //id自增所以id越大数据越新
        var sql = 'SELECT * FROM message ORDER BY id DESC LIMIT 0,30';
        mwmSql.query(sql, function (ret) {
            console.log("请求留言");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(ret);
        });
    });
    app.post('/message', function (req, res) {
        var uid = req.body.uid;
        var author = req.body.author;
        var content = req.body.content;

        //todo 现在是简单处理。数据信息未经过验证
        console.log(uid + "请求留言");
        if (uid && author && content) {
            console.log("合法，开始处理");
            var sql = "INSERT INTO message(uid,author,content,time) VALUES (" + uid + ",'" + author + "','" + content + "',now())";
            mwmSql.query(sql, function (ret) {
                console.log(ret);
                var r = {
                    msg: "发送留言成功",
                    returnCode: 0
                };
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.send(r);
            })
        }
        else {
            console.log("数据有空");
        }
    });

    app.get('/upload', function (req, res) {
        var body = '<html>' +
            '<head>' +
            '<meta http-equiv="Content-Type" content="text/html; ' +
            'charset=UTF-8" />' +
            '</head>' +
            '<body>' +
            '<form action="/upload" method="post" enctype="multipart/form-data">' +
            '<input type="file" name="inputFile" multiple="mutiple" />' +
            '<input type="submit" value="提交" />' +
            '</form>' +
            '</body>' +
            '</html>';

        res.send(body);
    });

    app.post('/upload', function (req, res) {
        console.log("上传数据");
        //生成multiparty对象，并配置下载目标路径
        var form = new multiparty.Form({uploadDir: './upload/files/'});

        form.parse(req, function (err, fields, files) {
            var filesTmp = JSON.stringify(files, null, 2);

            if (err) {
                console.log('parse error: ' + err);
            } else {
                console.log('parse files: ' + filesTmp);
                var inputFile = files.inputFile[0];
                var uploadedPath = inputFile.path;
                var dstPath = './public/files/' + inputFile.originalFilename;
                //重命名为真实文件名
                //-----------------------这里失败了-----------------------
                fs.rename(uploadedPath, dstPath, function (err) {
                    if (err) {
                        console.log('rename error: ' + err);
                    } else {
                        console.log('rename ok');
                    }
                });
            }

            res.send("上传完毕");
        });

        app.get('*', function (req, res) {
            console.log("请求了不存在的页" + req.url);
            res.send('404 not found');
        });
    });
}

exports.InitRouter = InitRouter;