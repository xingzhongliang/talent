/**
 * 权限验证模块
 */
exports.auth = function (role) {
    return function (req, res, next) {
        if (!req.session.user) {
            req.flash('error', '未登录');
            res.redirect('/login');
        } else {
            if (req.session.user.role.contains(role)) {
                // 有相应的权限
                next();
            } else {
                // 没相应的权限，转向相应的页面获取
                switch (role) {
                    case "user" :
                    case "admin" :
                        res.redirect('/login');
                        break;
                    case "candidate" :
                        res.redirect('/token');
                        break;
                    default :
                        res.redirect('/login');
                }
            }
        }
    }
};