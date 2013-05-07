/*
 * addSubject page.
 */

var mongoose = require("mongoose");
var sw = require('./util/schemaWrapper')
var Subject = mongoose.model("Subject");
//进入主题添加页面
exports.addSubject = function (req, res) {
    res.render('admin/addSubject', { title: '添加主题' });
};
//将用户提交的主题数据插入到DB
exports.doAddSub = function(req,res) {
    console.info('<<[doAddSub]begin');
    var subject = new Subject();
    sw.wrap(subject,req.body.sub);
    subject.save();
    res.redirect('/admin/addSub');
    console.info('[doAddSub]end>>');
};

exports.addSubjectOption = function (req, res) {
    res.render('addSubjectOption', { title: 'addSubjectOption' });
};