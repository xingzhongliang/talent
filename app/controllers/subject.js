var mongoose = require("mongoose");
var moment = require("moment");
var uuid = require("node-uuid");
var Subject = mongoose.model("Subject");
var Candidate = mongoose.model("Candidate");
var util = require("./util/util");
var config = require("../../config/config");
/**
 * 按Id查找主题，找到之后放到req里面
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.subject = function (req, res, next, id) {
    Subject.load(id, function (err, subject) {
        if (err) return next(err);
        if (!subject) return next(new Error('找不到该主题，主题ID： ' + id));
        req.subject = subject;
        next()
    });
};

/*
 * addSubject page.
 */
exports.add = function (req, res) {
    res.render('admin/addSubject', { title: '添加主题' });
};

/**
 * 编辑，管理主题页面
 * @param req
 * @param res
 */
exports.edit = function (req, res) {
    var subject = req.subject;
    Subject.scopesAndGroups(subject._id, function (scopes, groups, err) {
        if (err) throw err;
        res.render('admin/editSubject', { title: '主题管理', subject: subject, scopes: scopes, groups: groups });
    });
};

/**
 * 显示主题，主题首页
 * @param req
 * @param res
 */
exports.show = function (req, res) {
    var subject = req.subject;
    var template = subject.viewOpt.templateName || "default";
    Subject.scopesAndGroups(subject._id, function (scopes, groups, err) {
        if (err) throw err;
        subject.scopes = scopes;
        subject.groups = groups;
        var cs = [];
        Candidate.findBySubjectId(subject._id, function (err, candidates) {
            if(err) throw err;
            for (var i = 0; i < candidates.length; i++) {
                var s = candidates[i].scope;
                var g = candidates[i].group;
                if (!cs[s]) {
                    cs[s] = [];
                }
                if (!cs[s][g]) {
                    cs[s][g] = [];
                }
                cs[s][g].push(candidates[i]);
            }
            // 按key排序
            cs = util.sortMap(cs);
            for (var key in cs) {
                cs[key] = util.sortMap(cs[key]);
            }
            res.render(config.templateDir + "/" + template + '/index', {
                title: subject.name,
                subject: subject,
                template: template,
                candidates: cs
            });
        });

    });
};

/**
 * 插入主题到DB
 * @param req
 * @param res
 */
exports.doAdd = function (req, res) {
    console.info('<<[doAddSub]begin');
    var subject = new Subject(req.body);
    // 如果设置为使用令牌，则生成令牌
    if (subject.token == 1) {
        subject.token = uuid.v4();
    }
    // 给主题赋值owner
    subject.owner = req.session.user.name;

    //日期属性处理
    var fmt = 'YYYY-MM-DD';
    var voteBegin = req.param['voteBegin'];
    var voteEnd = req.param['voteEnd'];
    var regBegin = req.param['regBegin'];
    var regEnd = req.param['regEnd'];
    voteBegin && (subject.voteBegin = moment(voteBegin, fmt));
    voteEnd && (subject.voteEnd = moment(voteEnd, fmt));
    regBegin && (subject.regBegin = moment(regBegin, fmt));
    regEnd && (subject.regEnd = moment(regEnd, fmt));

    subject.save(function (err) {
        if(err) throw err;
        res.redirect('/admin');
        console.info('[doAddSub]end>>');
    });

};

exports.list = function (req, res) {
    var page = req.param('page') > 0 ? req.param('page') : 0;
    var pageSize = 6;
    var options = {
        pageSize: pageSize,
        page: page
    };

    Subject.list(options, function (err, subjects) {
        if(err) throw err;
        Subject.count().exec(function (err, count) {
            if(err) throw err;
            res.render("admin/index", {
                title: "管理控制台",
                subjects: subjects,
                pages: count / pageSize,
                page: page
            });
        });
    });
};

/**
 * 首页 显示最新活动的首页
 * @param req
 * @param res
 */
exports.index = function (req, res) {
    Subject.findOne()
        .sort({createTime: '-1'})
        .exec(function (err, subject) {
            if(err) throw err;
            res.redirect("/subject/" + subject._id);
        });
};

