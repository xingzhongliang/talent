var mongoose = require("mongoose");
var moment = require("moment");
var uuid = require("node-uuid");
var Subject = mongoose.model("Subject");
var Scope = mongoose.model("Scope");
var Group = mongoose.model("Group");
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
        if (!subject) return next('找不到该主题，主题ID： ' + id);
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
    Scope.findBySubjectId(subject._id, function (err, scopes) {
        !err && Group.findBySubjectId(subject._id, function (er, groups) {
            !er && res.render('admin/editSubject', { title: '主题管理', subject: subject, scopes: scopes, groups: groups });
        });
    });
};

exports.show = function (req, res) {
    var subject = req.subject;
    res.render('index', { title: subject.name, subject: subject });
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
        if (err) {
            console.log(err);
        }
        res.redirect('/admin');
        console.info('[doAddSub]end>>');
    });

};


exports.addSubjectOption = function (req, res) {
    res.render('addSubjectOption', { title: 'addSubjectOption' });
};

/**
 * 保存域的信息
 * @param req
 * @param res
 */
exports.saveScope = function (req, res) {
    var scope = new Scope();
    var _id = req.query._id;
    _id && (scope._id = _id);
    scope.subject = req.query.subject;
    scope.name = req.query.name;
    if (!_id) {
        scope.save(function (err, sc) {
            if (err) {
                console.info(err);
            } else {
                res.set('Content-Type', 'text/plain');
                res.send({data: sc, i: 1});
            }
        });
    } else {
        Scope.update({_id: _id}, {$set: {name: scope.name}}, function (err, i) {
            if (err) {
                console.info(err);
            } else {
                res.set('Content-Type', 'text/plain');
                res.send({data: scope, i: i});
            }
        });
    }
};

/**
 * 保存分组信息
 * @param req
 * @param res
 */
exports.saveGroup = function (req, res) {
    var group = new Group();
    var _id = req.query._id;
    _id && (group._id = _id);
    group.subject = req.query.subject;
    group.name = req.query.name;
    group.max = req.query.max;
    if (!_id) {
        group.save(function (err, gp) {
            if (err) {
                console.info(err);
            } else {
                res.set('Content-Type', 'text/plain');
                res.send({data: gp, i: 1});
            }
        });
    } else {
        Group.update({_id: _id}, {$set: {name: group.name, max: group.max}}, function (err, i) {
            if (err) {
                console.info(err);
            } else {
                res.set('Content-Type', 'text/plain');
                res.send({data: group, i: i});
            }
        });
    }
};