/**
 * 管理控制台的controller
 * User: laichendong
 * Date: 13-4-30
 * Time: 下午2:11
 */
exports.index = function (req, res) {
    res.render("admin/index", {title: "管理控制台 - 达人官网"});
};