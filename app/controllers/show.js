/**
 * 前台页面的controller
 * User: laichendong
 * Date: 13-5-3
 * Time: 下午4:41
 */
var config = require("../../config/config");
/**
 * 首页
 * @param req
 * @param res
 */
exports.index = function (req, res) {
    res.render("index", {"title": config.app.name});
};

/**
 * 列表页 （各个地区的页面）
 * @param req
 * @param res
 */
exports.list = function (req, res) {
    var area = req.param("area");
    res.render("show/list", {"title": area + "赛区 - " + config.app.name});
};

/**
 * 个人详情页
 * @param req
 * @param res
 */
exports.person = function (req, res) {
    var erpId = req.param("erpId");
    res.render("show/person", {title: erpId + " - " + config.app.name});
};