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
var env = process.env.NODE_ENV || "development";
var config = require("../../config/config")[env];

/**
 * 某一主题的投票列表
 * @param req
 * @param res
 */
exports.list = function (req, res) {
    var time = req.param("time") || "-1";
    var department = req.param("department") || "";
    var candidate = req.param("candidate") || "";
    var page = req.param('page') > 0 ? req.param('page') : 0;
    var pageSize = req.param('pageSize') || config.app.pageSize;
    var subject = req.subject;
    summaryInfo(req, function(summary){
        var options = {
            pageSize: pageSize,
            page: page,
            criteria: {subject: subject._id}
        };
        Vote.find(options.criteria)
            .sort({time: time})
            .limit(options.pageSize)
            .skip(options.pageSize * options.page)
            .exec(function (err, votes) {
                if (err) throw err;
                Vote.count(options.criteria).exec(function (err, count) {
                    res.render("vote/list", {
                        summary: summary,
                        subject: subject,
                        votes: votes,
                        pages: count / pageSize,
                        page: page,
                        dataOptions: {
                            candidate: candidate,
                            department: department,
                            time: time
                        }
                    });
                });
            });

    });
};

/**
 * 获取投票汇总数据
 * @param req 请求对象
 * @param cb 回调函数
 */
var summaryInfo = function (req, cb) {
    var time = req.param("time") || "-1";
    var department = req.param("department") || "";
    var candidate = req.param("candidate") || "";
    var subject = req.subject;
    var init = {
        count: 0,
        department: {},
        candidate: {}
    };
    var condition = {subject: subject._id.toString()};
    if (candidate) condition.candidate = candidate.toString();
    if (department) condition.voter_department = department.toString();
    var groupOpts = {
        keys: {},
        condition: condition,
        initial: init,
        reduce: function (doc, out) {
            out.count++;
            if (out.department[doc.voter_department]) {
                out.department[doc.voter_department] += 1;
            } else {
                out.department[doc.voter_department] = 1;
            }
            if (out.candidate[doc.candidate] && out.candidate[doc.candidate].count) {
                out.candidate[doc.candidate].count += 1;
            } else {
                out.candidate[doc.candidate] = {
                    count: 1,
                    name: doc.candidate_name
                };
            }
        },
        finalize: function () {
        }
    };
    Vote.collection.group(groupOpts.keys, groupOpts.condition, groupOpts.initial, groupOpts.reduce, groupOpts.finalize, true, groupOpts.option, function (err, result) {
        if (err) throw err;
        result = result[0] || init;
        cb(result);
    });
};