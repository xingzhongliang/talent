/**
 * 通用文件上传类
 * Created with IntelliJ IDEA.
 * User: Jale
 * Date: 13-5-12
 * Time: 上午5:15
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');
var uuid = require("node-uuid");
var env = process.env.NODE_ENV || "development";
var config = require("../../config/config")[env];
var path = require("path");
var child_process = require('child_process');
var mime = require('mime-magic');

exports.svf = function (req, res) {
    var file = req.files.fn;
    for(var p in file){
        console.log(p + ":" + file[p]);
    }

    var unkonwn = 'application/octet-stream';
    mime(file.path, function (err, type) {
        console.info(type);
        if (err)  throw err;
        var typeSize = {
            'image/jpg': 1048576, 'image/jpeg': 1048576, 'image/png': 1048576, 'image/pjpeg': 1048576, 'image/bmp': 1048576, 'image/x-png': 1048576, 'audio/mpeg': 1048576 * 50, 'video/mp4': 1048576 * 200, 'video/x-flv': 1048576 * 200
        };
        var target_path = config.uploadDir;
        if (type == unkonwn) {
            type = req.body.mime;
        }
        if (!typeSize[type]) {
            return res.send({err: 'file type error', code: -1});
        }
        if (file.size > typeSize[type]) {
            return res.send({err: 'file size is too large', code: -2});
        }
        var tp = type.indexOf('png') != -1 ? 'png' : type.indexOf('jpeg') != -1 ? 'jpeg' : type == 'audio/mpeg' ? 'mp3' : type == "video/x-flv" ? "flv" : type.split('/')[1];
        var fn = '/' + type + '/' + uuid.v4() + '.' + tp;
        var tmpPath = file.path;
        var dir = target_path + '/' + type;
        target_path += fn;
        if (!fs.existsSync(dir)) {
            mkdirSync(dir);
        }
        console.info(target_path);
        fs.rename(tmpPath, target_path, function (err) {
            if (err) throw err;
            // 删除临时文件夹文件,
            if (fs.existsSync(tmpPath)) {
                fs.unlink(tmpPath, function (err) {
                    if (err) throw err;
                });
            }
            // 抓取视频快照
            if (type == 'video/mp4' || type == "video/x-flv") {
                getSnapShot(target_path, tp, function (err, path) {
                    if (err) throw err;
                    res.send({path: fn.replace("." + tp, '.png'), code: err ? -3 : 1, video: fn});         //-3 : 抓取缩略图错误
                });
            } else {
                res.send({path: fn, code: 1});
            }
        });
    });

};

function getSnapShot(videoPath, tp, callback) {
    var cmd = 'ffmpeg -i "INPUT" -ss 00:00:02.435 -f image2 -vframes 1 "OUT"';
    var path = videoPath.replace("." + tp, '.png');
    var rm = cmd.replace('INPUT', videoPath).replace('OUT', path);
    while (rm.indexOf('\\') != -1) {
        rm = rm.replace('\\', '/');
    }
    child_process.exec(rm, function (err, out, code) {
        callback(err, path);
    });

//    var opt = [
//        '-i ',
//        videoPath,
//        '-ss 00:00:02.435',
//        '-f image2',
//        '-vframes 1 '+ path
//    ];
//    var ffm = child_process.spawn('D:\\tools\\ffmpeg\\bin\\ffmpeg.exe',opt);
//    ffm.stderr.on('data',function(line){
//        console.info('err:' + line);
//    });
//    ffm.stdout.on('data',function(line){
//        console.info(line.toString());
//    });
//    ffm.stdout.on('end',function(e){
//        console.info('================End=========');
//        console.info(e);
//    });
//   ffm.on('exit',function(code){
//       callback(code,path);
//   });
}

function mkdirSync(url, mode, cb) {
    var arr = url.split("/");
    mode = mode || 0755;
    cb = cb || function () {
    };
    if (arr[0] === ".") {//处理 ./aaa
        arr.shift();
    }
    if (arr[0] == "..") {//处理 ../ddd/d
        arr.splice(0, 2, arr[0] + "/" + arr[1])
    }
    function inner(cur) {
        if (cur && !fs.existsSync(cur)) {//不存在就创建一个
            fs.mkdirSync(cur, mode)
        }
        if (arr.length) {
            inner(cur + "/" + arr.shift());
        } else {
            cb();
        }

    }

    arr.length && inner(arr.shift());

}
