/*
 * addSubject page.
 */

var mongoose = require("mongoose");
var moment = require("moment");
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

//管理页面
exports.edit = function(req,res) {
    console.info(req.params._id);
    Subject.findById(req.params._id,function(err,subject){
        if(!err) {
            res.render('admin/editSubject',{title:'主题管理',subject:subject});
        }
    });
}


exports.addSubjectOption = function (req, res) {
    res.render('addSubjectOption', { title: 'addSubjectOption' });
};