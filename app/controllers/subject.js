/*
 * addSubject page.
 */
exports.addSubject = function (req, res) {
    res.render('admin/addSubject', { title: '添加主题' });
};

exports.addSubjectOption = function (req, res) {
    res.render('addSubjectOption', { title: 'addSubjectOption' });
};