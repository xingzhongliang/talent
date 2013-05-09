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
    var pageSize = req.param['pageSize'] || config.app.pageSize;
    var pageNo = req.param['pageNo'] || config.app.pageNo;
    res.locals.pageSize = pageSize;
    res.locals.pageNo = pageNo;
    Subject.list({
        criteria : {}
        , pageSize : pageSize
        , pageNo : pageNo
    }, function (err,subjects){
        if(err) {
            console.info(err);
        }else{
            res.render("admin/index", {title: "管理控制台", subjects : subjects});
        }
    });
};