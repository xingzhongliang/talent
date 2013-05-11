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
    // 个人详情页
    app.get("/candidate/:erpId", show.candidate);


    var login = require("../app/controllers/passport");
    // 登录登出
    app.get('/login', login.login);
    app.post('/do-login', login.doLogin);
    app.get('/do-logout', login.doLogout);
    app.get('/token', login.token);
    app.post('/verify-token', login.verifyToken);

    // 管理控制台
    var admin = require("../app/controllers/admin");
    app.get("/admin", auth("admin"), admin.index);

    // 主题相关
    var subject = require("../app/controllers/subject");
    app.get('/subject/add', auth("admin"), subject.add); // 添加主题
    app.post('/subject/do-add',auth("admin"), subject.doAdd);// 插入数据
    app.get('/subject/:subjectId',  subject.show); // 前台展示主题首页
    app.get('/subject/:subjectId/edit', auth("admin"), subject.edit); // 编辑，管理主题
    app.get('/subject/:subjectId/candidate/add', auth("token"), candidate.add); // 主题报名

    app.param("subjectId", subject.subject); // 处理带:subjectId参数的url中的:subjectId

    // 主题选项详情页编辑
    app.get('/admin/addSubOpt',auth("admin"), subject.addSubjectOption);

    //域管理
    app.get('/scope/save',auth("admin"), subject.saveScope);
    //分组管理
    app.get('/group/save',auth("admin"), subject.saveGroup);

    var uploaddata = require('../app/controllers/uploaddata');
    app.all('/uploaddata',uploaddata.uploaddata);


};