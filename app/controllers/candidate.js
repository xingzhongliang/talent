/**
 * 候选人controller
 * User: laichendong
 * Date: 13-5-5
 * Time: 下午1:10
 */
var mongoose = require("mongoose");
var Candidate = mongoose.model("Candidate");
var Subject = mongoose.model("Subject");
var Group = mongoose.model("Group");
var Scope = mongoose.model("Scope");
var Vote = mongoose.model("Vote");
var config = require("../../config/config");
var uuid = require("node-uuid");
var fs = require("fs");

/**
 * 按照选项id查找选项
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.candidate = function (req, res, next, id) {
    Candidate.load(id, function (err, candidate) {
        if (err) return next(err);
        if (!candidate) return next('找不到该选项，选项值： ' + id);
        req.candidate = candidate;
        next()
    });
};

/**
 * 新候选人
 * @param req
 * @param res
 */
exports.add = function (req, res) {
    var subject = req.subject;
    // 查询主题下的域和组
    Subject.scopesAndGroups(subject._id, function (scopes, groups) {
        subject.scopes = scopes;
        subject.groups = groups;
        res.render("candidate/add", {subject: subject});
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

    var witOfAudio = req.body.witOfAudio;
    var witOfImg = req.body.witOfImg;
    var witOfVideo = req.body.witOfVideo;
    witOfAudio && witOfAudio.trim() && (candidate.witOfAudio = witOfAudio.split(','));
    witOfImg && witOfImg.trim() && (candidate.witOfImg = witOfImg.split(','));
    witOfVideo && witOfVideo.trim() && (candidate.witOfAudio = witOfVideo.split(','));
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
    var pageSize = req.param('pageSize') || config.app.pageSize;
    var subject = req.subject;
    // 查询主题下的域和组
    Subject.scopesAndGroups(subject._id, function (scopes, groups) {
        subject.scopes = scopes;
        subject.groups = groups;
        var options = {
            pageSize: pageSize,
            page: page,
            criteria: {subject: subject._id}
        };
        Candidate.list(options, function (err, candidates) {
            if (err) throw err;
            Candidate.count(options.criteria).exec(function (err, count) {
                res.render("candidate/list", {
                    title: "选项管理 - " + subject.name,
                    subject: subject,
                    candidates: candidates,
                    pages: count / pageSize,
                    page: page
                });
            });
        });
    });

};

/**
 * 选项前台查看页面
 * @param req
 * @param res
 */
exports.show = function (req, res) {
    var candidate = req.candidate;
    Subject.load(candidate.subject, function (err, subject) {
        Scope.load(candidate.scope, function (err, scope) {
            Group.load(candidate.group, function (err, group) {
                var template = subject.viewOpt.templateName || "default";
                res.render("templates/" + template + '/detail', {
                    title: req.candidate.name,
                    template: template,
                    subject: subject,
                    candidate: candidate,
                    scope: scope,
                    group: group
                });
            })
        });
    });

};

/**
 * 删除选项
 * @param req
 * @param res
 */
exports.del = function (req, res) {
    var candidate = req.candidate;
    // 删除文件
    if (candidate.avatar) {
        fs.unlink(config.uploadDir + candidate.avatar, null);
    }
    candidate.del(function (err, c) {
        if (err) throw err;
        res.redirect("back");
    });

};

/**
 * 前台频道页
 * @param req
 * @param res
 */
exports.channel = function (req, res) {
    var groupId = req.param("g_id");
    var scopeId = req.param("s_id");
    var page = req.param('page') > 0 ? req.param('page') : 0;
    var pageSize = req.param('pageSize') || 18;
    var subject = req.subject;
    var template = subject.viewOpt.templateName || "default";
    var options = {
        pageSize: pageSize,
        page: page,
        criteria: {
            subject: subject._id,
            scope: scopeId,
            group: groupId
        }
    };
    // 查询主题下的域和组
    Scope.load(scopeId, function (err, scope) {
        if (err) throw err;
        Group.load(groupId, function (err, group) {
            Candidate.list(options, function (err, candidates) {
                if (err) throw err;
                Candidate.count(options.criteria).exec(function (err, count) {
                    res.render("templates/" + template + '/list', {
                        title: group.name + " - " + scope.name,
                        subject: subject,
                        template: template,
                        candidates: candidates,
                        scope: scope,
                        group: group,
                        pages: count / pageSize,
                        page: page
                    });
                });
            });
        });
    });
};

/**
 * 投票动作
 * @param req
 * @param res
 */
exports.vote = function (req, res) {
    // 是否来自登录页
    var fromLogin = /\/login$/.test(req.get("Referer").toString());
    var voter = req.session.user;
    var candidate = req.candidate;
    // 检查是否参与过本主题的本轮投票
    Subject.load(candidate.subject, function (err, subject) {
        Vote.voted(voter.erpId, subject, function (err, vote) {
            if (err) throw err;
            if (vote) {
                // 投过，给出提示
                req.flash("errors", "重复投票");
                if (fromLogin) {
                    res.redirect("/subject/" + candidate.subject);
                } else {
                    res.redirect("back");
                }
            } else {
                vote = new Vote({
                    voter_erp: voter.erpId, voter_name: voter.name, voter_department: voter.department, subject: candidate.subject, candidate: candidate._id, round: subject.round
                });
                vote.save(function (err) {
                    Candidate.update({_id: candidate._id}, {$inc: { votes: 1}}, function (err, i) {
                        if (err) {
                            req.flash("errors", "服务器错误");
                            if (fromLogin) {
                                res.redirect("/subject/" + candidate.subject);
                            } else {
                                res.redirect("back");
                            }
                        } else {
                            req.flash("info", "投票成功");
                            if (fromLogin) {
                                res.redirect("/subject/" + candidate.subject);
                            } else {
                                res.redirect("back");
                            }
                        }
                    });
                });
            }
        });
    });

};



