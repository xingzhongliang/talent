/**
 * 达人官网入口文件
 */
var express = require('express')
    , http = require('http')
    , config = require("./config/config")
    , mongoose = require('mongoose')
    , fs = require('fs');

// 启动数据库连接
//mongoose.connect(config.db);

// 加载各个model依赖
var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path + '/' + file)
});

var app = express();
// 配置express
require('./config/express')(app, config);
// 设置url路由
require('./config/routes')(app);

// 启动服务
app.listen(app.get("port"));
console.log('Express app started on port ' + app.get("port"));

// expose app
exports = module.exports = app;
