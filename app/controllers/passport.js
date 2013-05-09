var config = require("../../config/config");
var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
/*
 * login page.
 */
exports.login = function (req, res) {
    res.render('login', { target: req.flash("target")});
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
                    req.flash('errors', err.message);
                    req.flash("target", req.body.target);
                    return res.redirect("/login");
                }
                gotoTarget(req, res);
            });
        } else {
            loginNoErp(req, res, function (err) {
                if (err) {
                    req.flash('errors', [err.message]);
                    req.flash("target", req.body.target);
                    return res.redirect("/login");
                }
                gotoTarget(req, res);
            });
        }

    } else {
        req.flash('errors', ["ERP账号和密码必填"]);
        req.flash("target", req.body.target);
        res.redirect("/login");
    }
};

/**
 * 执行退出登录逻辑
 * @param req
 * @param res
 */
exports.doLogout = function (req, res) {
    req.session.user = null;
    res.redirect('/');
};

/**
 * token 输入页面
 * @param req
 * @param res
 */
exports.token = function (req, res) {
    res.render('token', { target: req.flash("target"), subjectId: req.flash("subjectId")});
};

/**
 * 验证token是否正确
 * @param req
 * @param res
 */
exports.verifyToken = function (req, res) {
    // 返回错误信息
    var returnError = function(err){
        req.flash("errors", err);
        req.flash("target", req.body.target);
        req.flash("subjectId", req.body.subjectId);
        return res.redirect("/token");
    };

    if (req.body) {
        if (!req.body.token) {
            return returnError("请输入令牌");
        } else if (!req.body.subjectId) {
            return returnError("额，骚年，你要验证哪个主题的令牌？");
        } else {
            Subject.load(req.body.subjectId, function (err, subject) {
                if (err) return returnError("系统错误，请稍后再试");
                if (!subject) return returnError("额，骚年，你说的那个主题不存在");
                console.info(subject.token);
                if (req.body.token == subject.token) { // token 验证通过
                    req.session.user.token = req.body.token;
                    gotoTarget(req, res);
                } else {
                    return returnError("您的令牌不对");
                }
            });
        }
    }

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
                return callBack({message: "糟糕，ERP好像开小差了，暂时不能登录。"});
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
                callBack();
            } else {
                // 登录失败
                callBack({message: "erp账号和密码不匹配"});
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
        res.redirect(decodeURIComponent(target));
    } else {
        res.redirect("/");
    }
};