/**
 * 管理控制台的controller
 * User: laichendong
 * Date: 13-4-30
 * Time: 下午2:11
 */
var mongoose = require("mongoose");
var config = require("../../config/config");

exports.index = function (req, res) {
    var Subject = mongoose.model("Subject");
    Subject.list({
        criteria : {}
        , pageSize : config.app.pageSize
        , pageNo : config.app.pageNo
    }, function (subjects){
        res.render("admin/index", {title: "管理控制台", subjects : subjects});
    });
};