/**
 * 权限验证模块
 */
module.exports = function (role, url) {

    return function (req, res, next) {
        // 获得相应权限后跳转到的url
        var targetUrl = encodeURIComponent(url || req.originalUrl);
        if (req.flash("target")) {
            req.flash("target", undefined);
        }
        req.flash("target", targetUrl);
        switch (role) {
            case "user" :
            case "admin" :
                if (!req.session.user) { // 没有登录，直接跳转到登录页面
                    returnNeedLogin(req, res, targetUrl);
                } else { // 有登录，检查登录的用户是否有相应的角色，有则放过，无则继续登录去
                    var hasRole = false;
                    for (var i = 0; i < req.session.user.role; i++) {
                        if (role == req.session.user.role[i]) hasRole = true;
                    }
                    if (!hasRole) {
                        req.flash("errors", "此账户没有足够的权限");
                        returnNeedLogin(req, res, targetUrl);
                    } else {
                        next();
                    }
                }
                break;
            case "token" :
                if (!req.session.user) return returnNeedLogin(req, res, targetUrl);
                if (!req.subject.token) { // 如果主题不要求token 直接放过
                    next();
                } else {
                    var token = req.param("token") || req.session.user.token;
                    if (token != req.subject.token) { // 如果请求中带了token参数且和对应主题的token一致，则放过，否则去token输入页
                        req.flash("subjectId", req.subject._id);
                        res.redirect('/token');
                    } else {
                        next();
                    }
                }
                break;
            default :
                returnNeedLogin(req, res, targetUrl);
        }

    }
};

/**
 * 返回需要登录的信息，
 * 根据请求是否为ajax请求，返回的方式不同
 * @param req
 * @param res
 * @param targetUrl
 */
function returnNeedLogin(req, res, targetUrl) {
    if (req.xhr) {
        res.send({
            success: false,
            code: -10,
            msg: "need login",
            target: targetUrl
        });
    } else {
        res.redirect('/login');
    }
}