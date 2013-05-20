/**
 * 投票
 * User: laichendong
 * Date: 13-5-20
 * Time: 下午11:12
 */
var mongoose = require("mongoose");
var Candidate = mongoose.model("Candidate");
var Subject = mongoose.model("Subject");
var Group = mongoose.model("Group");
var Scope = mongoose.model("Scope");
var Vote = mongoose.model("Vote");
var config = require("../../config/config");

/**
 * 某一主题的投票列表
 * @param req
 * @param res
 */
exports.list = function (req, res) {
    var time = req.param("time") || "-1";
    var department = req.param("department") || "all";
    var candidate = req.param("candidate") || "all";
    department = (department == "all") ? "" : department;
    candidate = (candidate == "all") ? "" : candidate;
    var page = req.param('page') > 0 ? req.param('page') : 0;
    var pageSize = req.param('pageSize') || config.app.pageSize;
    var subject = req.subject;
    var groupBy = {
        keys: {},
        condition: {subject: subject._id.toString()},
        initial: {
            count: 0,
            department: {},
            candidate: {},
            votes: [],
            page: page,
            pageSize: pageSize
        },
        reduce: function (doc, out) {

            out.count++;
            if ((out.count >= out.page * out.pageSize) && (out.count < (out.page + 1) * out.pageSize)) {
                out.votes.push(doc);
            }
            if (out.department[doc.voter_department]) {
                out.department[doc.voter_department] += 1;
            } else {
                out.department[doc.voter_department] = 1;
            }
            if (out.candidate[doc.candidate]) {
                out.candidate[doc.candidate] += 1;
            } else {
                out.candidate[doc.candidate] = 1;
            }
        },
        option: {
            $sort: {time: time}
        },
        finalize: function () {
        }
    };
    Vote.collection.group(groupBy.keys, groupBy.condition, groupBy.initial, groupBy.reduce, groupBy.finalize, true, groupBy.option, function (err, result) {
        if (err) throw err;
        res.render("vote/list", {
            result: result[0],
            subject: subject,
            pages: result[0].count / pageSize,
            page: page,
            dataOptions: {
                candidate: candidate,
                department: department,
                time: time
            }
        });
    });
};