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
var config = require('../../config/config');
var path = require("path");
var mmm = require('mmmagic');
var Magic = mmm.Magic;


exports.svf = function (req, res) {
    var magic = new Magic(mmm.MAGIC_MIME_TYPE | mmm.MAGIC_MIME_ENCODING);
    var file = req.files.fn;
    magic.detectFile(file.path,function(err,mt) {
        if(err) {
            console.info(err);
        }
        if(mt && mt.indexOf(';' != -1)) {
           var type = mt.split(';')[0].trim();
            var typeSize = {
                'image/jpg': 1048576, 'image/jpeg': 1048576, 'image/png': 1048576, 'image/pjpeg': 1048576, 'image/bmp': 1048576, 'image/x-png': 1048576, 'audio/mpeg': 1048576 * 50, 'video/mp4': 1048576 * 200
            };
           console.info(type);
            var target_path = config.uploadDir;
            if (!typeSize[type]) {
                return res.send({err: 'file type error', code: -1});
            }
            if (file.size > typeSize[type]) {
                return res.send({err: 'file size is too large', code: -2});
            }
            var tp = type.indexOf('png') != -1 ? 'png' : type.indexOf('jpeg') != -1 ? 'jpeg' : type.split('/')[1];
            var fn = '/' + type + '/' + uuid.v4() + '.' + tp;
            var tmpPath = file.path;
            var dir = target_path + '/' + type;
            target_path += fn;
            if(!fs.existsSync(dir)) {
                mkdirSync(dir);
            }
            console.info(target_path);
            fs.rename(tmpPath, target_path, function (err) {
                if (err) throw err;
                // 删除临时文件夹文件,
                fs.unlink(tmpPath, function () {
                    if (err) throw err;
                });
                res.send({path: fn, code: 1});

            });
        }
    });


};

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
        if (!fs.existsSync(cur)) {//不存在就创建一个
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
