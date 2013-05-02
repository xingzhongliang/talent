/**
 * 网站url路由规则
 * @author laichendong
 * @date 13-7-4-28
 * @time 14:51
 * @param app
 */
module.exports = function (app) {
    //首页
    app.get('/', function (req, res) {
        res.render('index', {
            title: '首页'
        });
    });

    // 登录登出
    var login = require("../app/controllers/login");
    app.get('/login', login.login);
    app.post('/doLogin', login.doLogin);
    app.get('/doLogout', login.doLogout);

    // 管理控制台
    var admin = require("../app/controllers/admin");
    var auth = require("../config/middlewares/auth");
    app.get("/admin", auth("admin"), admin.index);

};