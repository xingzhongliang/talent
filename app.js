/**
 * 达人官网入口文件
 */
var express = require('express')
    , env = process.env.NODE_ENV || "development"
    , config = require("./config/config")[env]
    , http = require('http')
    , mongoose = require('mongoose')
    , fs = require('fs');

console.log("NODE_ENV=" + env);

// 启动数据库连接
mongoose.connect(config.db);

if (env == "development") {
    mongoose.set('debug', true);
}

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
