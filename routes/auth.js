/**
 * 权限验证模块
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */

function authValidate(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登入');
        return res.redirect('/login');
    }
    //其他权限验证
    next();
}

module.exports = authValidate;