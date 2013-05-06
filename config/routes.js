/**
 * 网站url路由规则
 * @author laichendong
 * @date 13-7-4-28
 * @time 14:51
 * @param app
 */
// require auth模块
var auth = require("../config/middlewares/auth");

module.exports = function (app) {
    var show = require("../app/controllers/show");
    // 首页
    app.get('/', show.index);
    // 列表页
    app.get("/list/:area", show.list);
    var candidate = require("../app/controllers/candidate");
    app.get("/candidate/new", candidate.new);
    // 个人详情页
    app.get("/candidate/:erpId", show.candidate);


    var login = require("../app/controllers/passport");
    // 登录登出
    app.get('/login', login.login);
    app.post('/doLogin', login.doLogin);
    app.get('/doLogout', login.doLogout);

    // 管理控制台
    var admin = require("../app/controllers/admin");
    app.get("/admin", auth("admin"), admin.index);

};