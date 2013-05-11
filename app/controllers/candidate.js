/**
 * 候选人controller
 * User: laichendong
 * Date: 13-5-5
 * Time: 下午1:10
 */
var mongoose = require("mongoose");
var Candidate = mongoose.model("Candidate");

/**
 * 新候选人
 * @param req
 * @param res
 */
exports.add = function (req, res) {
    // 查询主题下的域和组
    var scopes = [{name:"域a"},{name:"域b"},{name:"域c"}];
    var groups = [{name:"组a"},{name:"组b"},{name:"组c"}];
    req.subject.scopes = scopes;
    req.subject.groups = groups;

    res.render("candidate/new", {subject: req.subject});
};
