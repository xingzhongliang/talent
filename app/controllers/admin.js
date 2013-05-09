/**
 * 管理控制台的controller
 * User: laichendong
 * Date: 13-4-30
 * Time: 下午2:11
 */
var mongoose = require("mongoose");
var config = require("../../config/config");

exports.index = function (req, res) {
    var page = req.param('page') > 0 ? req.param('page') : 0;
    var pageSize = 6;
    var options = {
        pageSize: pageSize,
        page: page
    };

    var Subject = mongoose.model("Subject");
    Subject.list(options, function (err, subjects) {
        if (err) return res.status(500).render('500', {title: "500", error: err.stack });
        Subject.count().exec(function (err, count) {
            res.render("admin/index", {
                title: "管理控制台",
                subjects: subjects,
                pages: count / pageSize,
                page: page
            });
        });
    });
};