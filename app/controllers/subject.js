var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var moment = require("moment");
var sw = require('./util/schemaWrapper');
/**
 * 按Id查找主题，找到之后放到req里面
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.subject = function (req, res, next, id){
    Subject.load(id, function(err, subject) {
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
    res.render('admin/editSubject', { title: '主题管理', subject: subject });
};

exports.show = function (req, res) {
    var subject = req.subject;
    res.render('index', { title: '主题管理', subject: subject });
}


//将用户提交的主题数据插入到DB
exports.doAdd = function(req,res) {
    console.info('<<[doAddSub]begin');
    var subject = new Subject();
    sw.wrap(subject,req.body.sub);

    //日期属性处理
    var fmt = 'YYYY-MM-DD';
    var voteBegin = req.param['voteBegin'];
    var voteEnd = req.param['voteEnd'];
    var regBegin = req.param['regBegin'];
    var regEnd = req.param['regEnd'];
    voteBegin && (subject.voteBegin =  moment(voteBegin,fmt));
    voteEnd && (subject.voteEnd =  moment(voteEnd,fmt));
    regBegin && (subject.regBegin =  moment(regBegin,fmt));
    regEnd && (subject.regEnd =  moment(regEnd,fmt));

    subject.save(function(err){
        if(err) {
            console.log(err);
        }
    });
    res.redirect('/admin');
    console.info('[doAddSub]end>>');
};



exports.addSubjectOption = function (req, res) {
    res.render('addSubjectOption', { title: 'addSubjectOption' });
};