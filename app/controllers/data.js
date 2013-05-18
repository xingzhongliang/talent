/**
 * 数据报表controller
 * User: laichendong
 * Date: 13-5-18
 * Time: 下午10:42
 */
var mongoose = require("mongoose");
var Candidate = mongoose.model("Candidate");
var Subject = mongoose.model("Subject");
var Group = mongoose.model("Group");
var Scope = mongoose.model("Scope");
var Vote = mongoose.model("Vote");
var config = require("../../config/config");

/**
 * 主题数据首页
 * @param req
 * @param res
 */
exports.subject = function (req, res) {
    var subject = req.subject;
    var summary = {};
    // 选项数
    Candidate.count({subject: subject._id}).exec(function (err, count) {
        if (err) throw err;
        summary.numCandidate = count;
        // 投票数
        Vote.count({subject: subject._id, round: subject.round}).exec(function (err, count) {
            if (err) throw err;
            summary.numVotes = count;
            // 组数
            Group.count({subject: subject._id, yn: 1}).exec(function (err, count) {
                if (err) throw err;
                summary.numGroup = count;
                // 域数
                Scope.count({subject: subject._id, yn: 1}).exec(function (err, count) {
                    if (err) throw err;
                    summary.numScope = count;
                    res.render("data/subject", {
                        subject: subject,
                        summary: summary
                    });
                });
            });
        });
    });

};