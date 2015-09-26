/**
 * Created by Chen on 2015-09-21.
 */
var exec = require("child_process").exec;
var multiparty = require('multiparty');
var fs = require('fs');

//app为express对象
function InitRouter(app) {
    //express配置
    app.locals.title = "MWMServer";

    //越上面优先级越高

    app.get('/', function (req, res) {
        res.send('<h1 style="text-align: center; line-height: 70px;">请不要尝试直接连接服务器</h1>');
    });
    app.get('/login', function (req, res) {
        res.send('login');
    });

    app.get('/ls', function (req, res) {
        exec("ls -lah", function (error, stdout, stderr) {
            var con = stdout;
            con = con.replace(/\n/g, "<br />");
            res.send(con);
        });
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