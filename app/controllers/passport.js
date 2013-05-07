var config = require("../../config/config");
/*
 * login page.
 */
exports.login = function (req, res) {
    res.render('login', { target: req.param("target")});
};

/**
 * 处理登录逻辑
 * @param req
 * @param res
 */
exports.doLogin = function (req, res) {
    if (req.body && req.body.userName && req.body.password) {
        if (config.app.needErpLogin) {
            loginWithErp(req, res, function (err) {
                if (err) {
                    res.flash(err);
                }
                gotoTarget(req, res);
            });
        } else {
            loginNoErp(req, res, function (err) {
                if (err) {
                    res.flash(err);
                }
                gotoTarget(req, res);
            });
        }

    } else {
        res.flash("login error", "ERP账号和密码必填");
    }
};

/**
 * 执行退出登录逻辑
 * @param req
 * @param res
 */
exports.doLogout = function (req, res) {
    req.session.destroy(function () {
        res.redirect('/');
    });
};

/**
 * 使用erp的web Service验证用户名和密码登录
 * @param req
 * @param res
 * @param callBack
 */
var loginWithErp = function (req, res, callBack) {
    var soap = require('soap');
    var url = 'http://erp1.360buy.com/hrmservice/DeptWebService.asmx?wsdl';
    var args = {'name': req.body.userName, 'password': req.body.password};
    soap.createClient(url, function (err, client) {
        client.Verify(args, function (err, result) {
            if (err) {
                return callBack(err);
            }
            if (result && result.VerifyResult) {
                result = result.VerifyResult[0];
                // 登录成功
                var user = {};
                user.erpId = result.Name;
                user.name = result.RealName;
                user.department = result.Dept.Name;
                user.role = ["user"];

                // 如果登录者是管理员， 赋予用户管理员角色
                if (config.isAdmin(user.erpId)) {
                    user.role.push("admin");
                }
                req.session.user = user;
                req.session.save();
                callBack();
            } else {
                // 登录失败
                callBack("登录失败");
            }
        });

    });
};

/**
 * 没erp的情况下登录， 任何用户名密码都能登录
 * @param req
 * @param res
 * @param callBack
 */
var loginNoErp = function (req, res, callBack) {
    var user = {};
    user.erpId = req.body.userName;
    user.name = req.body.userName;
    user.role = ["user"];
    // 如果登录者是管理员， 赋予用户管理员角色
    if (config.isAdmin(user.erpId)) {
        user.role.push("admin");
    }
    req.session.user = user;
    req.session.save();

    callBack();
};

/**
 * 转向到“正确的”（登录前想去的）页面
 * @param req
 * @param res
 */
var gotoTarget = function (req, res) {
    var target = req.body.target;
    if (target) {
        res.redirect(target);
    } else {
        res.redirect("/");
    }
};