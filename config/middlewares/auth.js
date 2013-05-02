/**
 * 权限验证模块
 */
module.exports = function (role) {
    return function (req, res, next) {
        if (!req.session.user) {
            res.redirect('/login');
        } else {
            if (req.session.user.role.toString().indexOf(role) >= 0) {
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