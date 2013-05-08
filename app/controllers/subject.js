var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
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
//    new Subject({ "name": "达人秀", "comment": "为什么要用缩略图 缩略图（v1.4版本之前叫.media-grid）很适合将图片、视频、图片搜索结果、商品列表等展示为网格样式。他们可以是链接或纯粹的内容。 简单、灵活的标记 组成缩略图的标记很简单—ul包裹任意数量的li 元素即可。它同样很灵活，只需添加少量标记即可包裹你需要展示的任何内容。 使用栅格中的列尺寸 最后，缩略图组件使用现有的栅格系统中的类—例如.span2 或.span3—用以控制缩略图的尺寸。", "detail": "", "banner": "", "voteChance": 1, " canReg": true, "isPrivate": true, "token": "asdf", "owner": "bjlaichendong", "round": 1 }).create(function(){
//        res.render('admin/addSubject', { title: '添加主题' });
//    }); // 用来造数据
    res.render('admin/addSubject', { title: '添加主题' });
};

/**
 * 编辑，管理主题页面
 * @param req
 * @param res
 */
exports.edit = function (req, res) {
    var subject = req.subject;
    res.render('admin/addSubject', { title: '主题管理', subject: subject });
};

exports.show = function (req, res) {
    var subject = req.subject;
    res.render('index', { title: '主题管理', subject: subject });
}

exports.addSubjectOption = function (req, res) {
    res.render('addSubjectOption', { title: 'addSubjectOption' });
};