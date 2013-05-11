/**
 * scope controller
 * User: laichendong
 * Date: 13-5-10
 * Time: 下午5:04
 */
var mongoose = require("mongoose");
var moment = require("moment");
var uuid = require("node-uuid");
var Subject = mongoose.model("Subject");
var Scope = mongoose.model("Scope");

/**
 * 保存域的信息
 * @param req
 * @param res
 */
exports.save = function (req, res) {
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