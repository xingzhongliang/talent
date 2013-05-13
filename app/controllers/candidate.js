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
var config = require("../../config/config");
var uuid = require("node-uuid");

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
        Group.findBySubjectId(subject._id, function (err, groups) {
            subject.groups = groups;
            res.render("candidate/add", {subject: subject});
        });
    });
};

/**
 * 保存候选人
 * @param req
 * @param res
 */
exports.doAdd = function (req, res) {
    var candidate = new Candidate(req.body);
    var subject = req.subject;
    // 选项图片
    console.info(candidate.avatar);
    // 所属主题
    candidate.subject = subject._id;
    // 根据选项是否“是人” 来决定value和department的值
    if (subject.viewOpt.candidateIsEmployee) {
        candidate.value = req.session.user.erpId;
        candidate.department = req.session.user.department;
    } else {
        candidate.value = uuid.v4();
    }
    candidate.create(function (err) {
        if (err)  throw err;
        if (config.isAdmin(req.session.user.erpId)) {
            res.redirect('/subject/' + candidate.subject + '/candidate/list');
        } else {
            res.redirect('/');
        }
    });
};

/**
 * req.subject下的选项列表
 * @param req
 * @param res
 */
exports.list = function (req, res) {
    var page = req.param('page') > 0 ? req.param('page') : 0;
    var pageSize = req.param('page') || config.app.pageSize;
    Candidate.findBySubjectId(req.subject._id, function (err, candidates) {
        if (err) throw err;
        Candidate.count().exec(function (err, count) {
            res.render("candidate/list", {
                title: "选项管理 - " + req.subject.name,
                subject: req.subject,
                candidates: candidates,
                pages: count / pageSize,
                page: page
            });
        });
    });
};


