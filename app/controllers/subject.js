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
    var subject = req.body.sub;
    var erpId = req.session.user.erpId;
    var sub = req.subject;
    if (!sub) {                         //Subject check
        return res.send({code: -1})
    }
    if (sub.owner != erpId && !config.isAdmin(erpId)) {   //User check,Admin can modify any subject
        return res.send({code: -2})
    }
    // 如果设置为使用令牌，则生成令牌
    if (subject.token == 1) {
        subject.token = uuid.v4();
    } else {
        subject.token = 0;    //else set token to null
    }

    Subject.update({_id: sub._id},
        {$set: {
            token: subject.token,
            voteStart: req.body['voteStart'],
            voteEnd: req.body['voteEnd'],
            regStart: req.body['regStart'],
            regEnd: req.body['regEnd'],
            voteChance: subject.voteChance,
            regChance: subject.regChance,
            isPublic: subject.isPublic ? true : false,
            canReg: subject.canReg ? true : false
        }}, function (err) {
            if (err) {
                console.error(err);
                throw err;
            }
            res.send({code: 1});
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


exports.list = function (req, res) {
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
        Subject.count().exec(function (err, count) {
            if (err) throw err;
            res.render("admin/index", {
                title: "管理控制台",
                subjects: subjects,
                kw:kw,
                st:st,
                owner:owner,
                pages: count / pageSize,
                page: page
            });
        });
    });
};

/**
 * 首页
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

