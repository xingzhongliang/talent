var mongoose = require("mongoose");
var moment = require("moment");
var uuid = require("node-uuid");
var Subject = mongoose.model("Subject");
var Candidate = mongoose.model("Candidate");
var Vote = mongoose.model("Vote");
var util = require("./util/util");
var env = process.env.NODE_ENV || "development";
var config = require("../../config/config")[env];
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
    res.render('subject/add', { title: '添加主题' });
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
        res.render('subject/edit', { title: '主题管理', subject: subject, scopes: scopes, groups: groups });
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
            if (err) throw err;
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
    } else {
        subject.token = "";
    }
    // 给主题赋值owner
    subject.owner = req.session.user.erpId;

    //日期属性处理
    var fmt = 'YYYY-MM-DD';
    var voteBegin = req.param['voteBegin'];
    var voteEnd = req.param['voteEnd'];
    var regBegin = req.param['regBegin'];
    var regEnd = req.param['regEnd'];
    voteBegin && (subject.voteStart = moment(voteBegin, fmt));
    voteEnd && (subject.voteEnd = moment(voteEnd, fmt));
    regBegin && (subject.regStart = moment(regBegin, fmt));
    regEnd && (subject.regEnd = moment(regEnd, fmt));

    subject.save(function (err) {
        if (err) throw err;
        res.redirect('/admin');
        console.info('[doAddSub]end>>');
    });

};

/**
 * MODIFY
 * @param req
 * @param res
 */
exports.doEdit = function (req, res) {
    var sub = req.body.sub;
    var erpId = req.session.user.erpId;
    var subInDb = req.subject;
    if (!subInDb) {                         //Subject check
        return res.send({code: -1})
    }
    if (subInDb.owner != erpId && !config.isAdmin(erpId)) {   //User check,Admin can modify any subject
        return res.send({code: -2})
    }
    // 如果设置为使用令牌，则生成令牌
    if (sub.token == 1) {
        sub.token = uuid.v4();
    } else {
        sub.token = "";    //else set token to null
    }

    Subject.update({_id: subInDb._id},
        {$set: {
            token: sub.token,
            voteStart: sub.voteStart,
            voteEnd: sub.voteEnd,
            regStart: sub.regStart,
            regEnd: sub.regEnd,
            isPublic: sub.isPublic ? true : false,
            canReg: sub.canReg ? true : false
        }}, function (err) {
            if (err) {
                console.error(err);
                throw err;
            }
            res.send({code: 1});
        });
};

/**
 * 修改主题介绍页
 * @param req
 * @param res
 */
exports.doEditDetail = function (req, res) {
    var sub = req.body.sub;
    var erpId = req.session.user.erpId;
    var subInDb = req.subject;
    if (!subInDb) {                         //Subject check
        throw new Error("主题不存在！");
    }
    if (subInDb.owner != erpId && !config.isAdmin(erpId)) {   //User check,Admin can modify any subject
        throw new Error("您不是主题的创建者，不允许修改这个主题！");
    }
    Subject.update({_id: subInDb._id}, {
        $set: {
            detail: sub.detail
        }
    }, function (err) {
        if (err) {
            throw err;
        }
        res.redirect("/subject/" + subInDb._id + "/edit#introManager")
    });
};

/**
 * 改变主题的置顶状态
 * @param req
 * @param res
 */
exports.doFixTop = function (req, res) {
    var erpId = req.session.user.erpId;
    var sub = req.subject;
    if (!sub) {                         //Subject check
        res.send({code: -1})
    }
    if (sub.owner != erpId && !config.isAdmin(erpId)) {   //User check,Admin can modify any subject
        res.send({code: -2})
    }

    sub.fixTop = !sub.fixTop;

    Subject.update({_id: sub._id},
        {$set: {
            fixTop: sub.fixTop
        }}, function (err) {
            if (err) {
                console.error(err);
                throw err;
            }
            res.send({code: 1});
        });

};

/**
 * 更新banner图片
 * @param req
 * @param res
 */
exports.chgBanner = function (req, res) {
    var erpId = req.session.user.erpId;
    var sub = req.subject;
    if (!sub) {                         //Subject check
        res.send({code: -1})
    }
    if (sub.owner != erpId && !config.isAdmin(erpId)) {   //User check,Admin can modify any subject
        res.send({code: -2})
    }

    var banner = req.param('banner');

    Subject.update({_id: sub._id},
        {$set: {
            banner: banner
        }}, function (err) {
            if (err) {
                console.error(err);
                throw err;
            }
            res.send({code: 1});
        });

};

/**
 * 管理控制台首页
 * @param req
 * @param res
 */
exports.list = function (req, res) {
    dashboard(function (dashboard) {
        var kw = req.param('kw');
        var st = req.param('st');
        var owner = req.param('owner');

        var page = req.param('page') > 0 ? req.param('page') : 0;
        var pageSize = 6;
        var options = {
            pageSize: pageSize,
            page: page
        };
        var reg;
        if (kw) {
            var r = '';
            for (var i = 0; i < kw.length; i++) {
                var c = kw.charAt(i);
                c && c.trim() && (r += ('.*' + c));
            }
            reg = new RegExp(r + '.*', 'i');
        }
        var sort = {};
        switch (st) {
            case '1':
                sort.createTime = '-1';
                break;
            case '2':
                sort.createTime = '1';
                break;
            case '3':
                sort.votes = '-1';
                break;
            case '4':
                sort.votes = '1';
                break;
            default :
                sort.createTime = '-1';
        }
        options.sort = sort;
        options.criteria = {};
        reg && (options.criteria.name = reg);
        owner && owner.trim() && (options.criteria.owner = owner.trim());

        Subject.list(options, function (err, subjects) {
            if (err) throw err;
            Subject.count(options.criteria).exec(function (err, count) {
                if (err) throw err;
                res.render("admin/index", {
                    title: "管理控制台",
                    subjects: subjects,
                    kw: kw,
                    st: st,
                    owner: owner,
                    pages: count / pageSize,
                    page: page,
                    dashboard: dashboard
                });
            });
        });
    });
};

/**
 * 系统首页
 * @param req
 * @param res
 */
exports.index = function (req, res) {
    var page = req.param('page') > 0 ? req.param('page') : 0;
    var kw = req.param('kw');
    var st = req.param('st');
    var pageSize = 6;
    kw && (kw = kw.trim());
    var options = {
        pageSize: pageSize,
        page: page
    };
    options.criteria = {
        isPublic: true
    };
    var reg;
    if (kw) {
        var r = '';
        for (var i = 0; i < kw.length; i++) {
            var c = kw.charAt(i);
            c && c.trim() && (r += ('.*' + c));
        }
        reg = new RegExp(r + '.*', 'i');
    }
    var sort = {};
    switch (st) {
        case '1':
            sort.createTime = '-1';
            break;
        case '2':
            sort.createTime = '1';
            break;
        case '3':
            sort.votes = '-1';
            break;
        case '4':
            sort.votes = '1';
            break;
        default :
            sort.createTime = '-1';
    }
    options.sort = sort;
    reg && (options.criteria.name = reg);
    Subject.find({isPublic: true, fixTop: true})
        .sort({createTime: '-1'})
        .limit(3)
        .exec(function (er, tops) {
            if (er) throw er;
            Subject.list(options, function (err, subjects) {
                if (err) throw err;
                Subject.count().exec(function (err, count) {
                    if (err) throw err;
                    res.render("index", {
                        title: "表决吧，骚年！",
                        list: subjects,
                        tops: tops,
                        kw: kw,
                        st: st,
                        pages: count / pageSize,
                        page: page
                    });
                });
            });
        });
};

/**
 * 主题介绍页
 * @param req
 * @param res
 */
exports.intro = function (req, res) {
    var subject = req.subject;
    var template = subject.viewOpt.templateName || "default";
    res.render(config.templateDir + "/" + template + '/intro', {
        title: subject.name,
        subject: subject,
        template: template
    });
};

/**
 * 查询仪表板数据，数据包括主题数，选项数，投票数
 * @param cb 回调函数
 */
var dashboard = function (cb) {
    var summary = {};
    // 主题数
    Subject.count({yn: 1}).exec(function (err, count) {
        if (err) throw err;
        summary.numSubject = count;
        // 总选项数
        Candidate.count({}).exec(function (err, count) {
            if (err) throw err;
            summary.numCandidate = count;
            // 总投票数
            Vote.count({}).exec(function (err, count) {
                if (err) throw err;
                summary.numVote = count;
                cb(summary);
            });
        });
    });
};
