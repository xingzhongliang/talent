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
    var subject = require("../app/controllers/subject");
    var candidate = require("../app/controllers/candidate");
    var passport = require("../app/controllers/passport");

    app.get('/', subject.index);// 首页
    app.get("/admin", auth("admin"), subject.list);// 管理控制台

    // 登录登出
    app.get('/login', passport.login);
    app.post('/do-login', passport.doLogin);
    app.get('/do-logout', passport.doLogout);
    app.get('/token', passport.token);
    app.post('/verify-token', passport.verifyToken);

    // 主题相关
    app.get('/subject/add', auth("admin"), subject.add); // 添加主题
    app.post('/subject/do-add', auth("admin"), subject.doAdd);// 插入数据
    app.get('/subject/:subjectId', subject.show); // 前台展示主题首页
    app.get('/subject/:subjectId/edit', auth("admin"), subject.edit); // 编辑，管理主题
    app.post('/subject/:subjectId/do-edit', auth("admin"), subject.doEdit); // Modify

    // 选项管理
    app.get('/subject/:subjectId/candidate', candidate.channel); // 前台展示列表（频道）页
    app.get('/subject/:subjectId/candidate/add', auth("token"), candidate.add); // 新选项
    app.post("/subject/:subjectId/candidate/new", auth("token"), candidate.doAdd); // 保存新选项
    app.get('/subject/:subjectId/candidate/list', auth("admin"), candidate.list); // 主题管理选项

    // 域管理
    var scope = require("../app/controllers/scope");
    app.get('/scope/save', auth("admin"), scope.save);
    app.get('/scope/:scopeId/del', auth("admin"), scope.del);
    // 分组管理
    var group = require("../app/controllers/group");
    app.get('/group/save', auth("admin"), group.save);
    app.get('/group/:groupId/del', auth("admin"), group.del);

    // 选项相关
    app.get("/candidate/:candidateId", candidate.show); // 选项详情页
    app.get("/candidate/:candidateId/del", auth("admin"), candidate.del); // 删除选项
    app.get("/candidate/:candidateId/vote", auth("user"), candidate.vote); // 删除选项

    app.param("subjectId", subject.subject); // 处理带:subjectId参数的url中的:subjectId
    app.param("candidateId", candidate.candidate); // 处理带:candidateId参数的url中的:candidateId
    app.param("scopeId", scope.scope);
    app.param("groupId", group.group);

    //改良版本的upload
    var svf = require('../app/controllers/svf');
    app.all('/svf', svf.svf);

};