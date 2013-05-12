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



    var passport = require("../app/controllers/passport");
    // 登录登出
    app.get('/login', passport.login);
    app.post('/do-login', passport.doLogin);
    app.get('/do-logout', passport.doLogout);
    app.get('/token', passport.token);
    app.post('/verify-token', passport.verifyToken);

    // 管理控制台
    var admin = require("../app/controllers/admin");
    app.get("/admin", auth("admin"), admin.index);

    // 主题相关
    var subject = require("../app/controllers/subject");
    var candidate = require("../app/controllers/candidate");
    app.get('/subject/add', auth("admin"), subject.add); // 添加主题
    app.post('/subject/do-add',auth("admin"), subject.doAdd);// 插入数据
    app.get('/subject/:subjectId',  subject.show); // 前台展示主题首页
    app.get('/subject/:subjectId/edit', auth("admin"), subject.edit); // 编辑，管理主题

    // 选项管理
    app.get('/subject/:subjectId/candidate/add', auth("token"), candidate.add); // 主题添加选项
    app.post("/subject/:subjectId/candidate/new", auth("token"), candidate.doAdd); // 保存新选项
    app.get('/subject/:subjectId/candidate/list', auth("admin"), candidate.list); // 主题管理选项

    // 域管理
    var scope = require("../app/controllers/scope");
    app.get('/scope/save',auth("admin"), scope.save);
    // 分组管理
    var group = require("../app/controllers/group");
    app.get('/group/save',auth("admin"), group.save);


    app.get("/candidate/:erpId", show.candidate); // 选项详情页

    app.param("subjectId", subject.subject); // 处理带:subjectId参数的url中的:subjectId

    var uploaddata = require('../app/controllers/uploaddata');
    app.all('/uploaddata',uploaddata.uploaddata);
    //改良版本的upload
    var svf = require('../app/controllers/svf');
    app.all('/svf',svf.svf);


};