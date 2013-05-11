/**
 * 候选人controller
 * User: laichendong
 * Date: 13-5-5
 * Time: 下午1:10
 */
var mongoose = require("mongoose");
var Candidate = mongoose.model("Candidate");
var Scope = mongoose.model("Scope");
var Group = mongoose.model("Group");

/**
 * 新候选人
 * @param req
 * @param res
 */
exports.add = function (req, res) {
    var subject = req.subject;
    // 查询主题下的域
    Scope.findBySubjectId(subject._id, function (err, scopes) {
        subject.scopes = scopes;
        // 查询主题下的组
        Group.findBySubjectId(subject._id, function (err, groups){
            subject.groups = groups;
            res.render("candidate/new", {subject: subject});
        });
    });
};
