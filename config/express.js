/**
 * express 基本设置
 * User: laichendong
 * Date: 13-4-28
 * Time: 下午3:09
 */
var express = require('express'), path = require("path"), flash = require('connect-flash');

module.exports = function (app, config) {
    app.configure(function () {
        app.set('port', process.env.PORT || 3000);
        app.set('views', config.root + '/app/views');
        app.set('view engine', 'jade');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.compress()); // 启用压缩
        app.use(express.bodyParser({uploadDir: config.uploadDir}));
        app.use(express.methodOverride());
        app.use(express.cookieParser('password is nothing'));
        app.use(express.cookieSession({cookie: { maxAge: 1800000 }}));
        app.use(flash());
        app.use(require("./middlewares/utils")(config.app.name));
        app.use(app.router);
        app.use(require('less-middleware')({ src: config.root + '/public' }));
        app.use(express.static(config.root + '/public'));
        app.use(express.static(config.uploadDir));
        app.use(express.static(config.templateDir));

        // 全局错误处理 404 和 500
        app.use(function (err, req, res, next) {
            // treat as 404
            if (~err.message.indexOf('not found')) {
                next();
            }

            // log it
            console.error(err.stack);

            // error page
            res.status(500).render('500', {title: "500", error: err.stack });
        });

        // assume 404 since no middleware responded
        app.use(function (req, res, next) {
            res.status(404).render('404', {title: "404", url: req.originalUrl, error: 'Not found' });
        });

        // 处理“未捕获异常”，防止服务器异常退出
        process.on('uncaughtException', function (err) {
            console.error("uncaughtException!!!", err);
        });
    });
};