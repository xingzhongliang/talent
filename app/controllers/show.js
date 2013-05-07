/**
 * 前台页面的controller
 * User: laichendong
 * Date: 13-5-3
 * Time: 下午4:41
 */
var config = require("../../config/config");
var mongoose = require("mongoose");
/**
 * 首页
 * @param req
 * @param res
 */
exports.index = function (req, res) {
//    var Candidate = mongoose.model("Candidate");
//    var candidates = Candidate.list({
//        criteria: {},
//        pageSize: 3,
//        pageNo: 0
//    }, function () {
//    });
    res.render("index", {candidates: {}});

};

/**
 * 候选人列表页 （各个地区的页面）
 * @param req
 * @param res
 */
exports.list = function (req, res) {
    var area = req.param("area");
    res.render("show/list", {"title": area + "赛区 - " + config.app.name});
};

/**
 * 候选人详情页
 * @param req
 * @param res
 */
exports.candidate = function (req, res) {
    var erpId = req.param("erpId");
    res.render("show/person", {title: erpId + " - " + config.app.name});
};