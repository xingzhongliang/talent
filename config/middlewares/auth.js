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
                    res.redirect('/login');
                } else { // 有登录，检查登录的用户是否有相应的角色，有则放过，无则继续登录去
                    if (req.session.user.role.toString().indexOf(role) < 0) {
                        res.redirect('/login');
                    } else {
                        next();
                    }
                }
                break;
            case "token" :
                if (!req.session.user) return res.redirect('/login');
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
                res.redirect('/login');
        }

    }
};