/**
 * scope controller
 * User: laichendong
 * Date: 13-5-10
 * Time: 下午5:04
 */
var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var Scope = mongoose.model("Scope");

exports.scope = function (req, res, next, id) {
    Scope.load(id, function (err, scope) {
        if (err) return next(err);
        if (!scope) return next('找不到数据，id： ' + id);
        req.scope = scope;
        next()
    });
};

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

/**
 * 删除
 * @param req
 * @param res
 */
exports.del = function (req, res) {
    var scope = req.scope;
    scope.remove(function (err, scope) {
        res.set('Content-Type', 'text/plain');
        if (err) {
            res.send({deleted: false});
        } else {
            res.send({deleted: true});
        }
    });
};