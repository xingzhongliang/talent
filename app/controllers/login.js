var User = require("../models/user")
    , config = require("../../config/config");
/*
 * login page.
 */
exports.login = function (req, res) {
    res.render('login', { title: 'login' });
};

/**
 * 处理登录逻辑
 * @param req
 * @param res
 */
exports.doLogin = function (req, res) {
    if (req.body && req.body.userName && req.body.password) {
        var soap = require('soap');
        var url = 'http://erp1.360buy.com/hrmservice/DeptWebService.asmx?wsdl';
        var args = {'name': req.body.userName, 'password': req.body.password};
        soap.createClient(url, function (err, client) {
            client.Verify(args, function (err, result) {
                if (err) throw err;
                if (result) {
                    // 登录成功
                    var user = new User();
                    user.erpId = req.body.userName;
                    user.role.push("user");
                    // todo 完善user对象中的信息
                    res.session.user = user;

                    // 如果登录者是管理员， 赋予用户管理员角色
                    if (config.isAdmin(user.erpId)) {
                        user.role.push("admin");
                    } else {
                        user.role.push("user");
                    }
                } else {
                    // 登录失败
                    res.flash("login failed", "登录失败");
                }
            });

        });
    } else {
        res.flash("login error", "ERP账号和密码必填");
    }
    console.log(req.body);
};