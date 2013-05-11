/**
 * User: laichendong
 * Date: 13-5-11
 * Time: 下午12:15
 */
var mongoose = require("mongoose");
var Subject = mongoose.model("Subject");
var Group = mongoose.model("Group");

/**
 * 保存分组信息
 * @param req
 * @param res
 */
exports.save = function (req, res) {
    var group = new Group();
    var _id = req.query._id;
    _id && (group._id = _id);
    group.subject = req.query.subject;
    group.name = req.query.name;
    group.max = req.query.max;
    if (!_id) {
        group.save(function (err, gp) {
            if (err) {
                console.info(err);
            } else {
                res.set('Content-Type', 'text/plain');
                res.send({data: gp, i: 1});
            }
        });
    } else {
        Group.update({_id: _id}, {$set: {name: group.name, max: group.max}}, function (err, i) {
            if (err) {
                console.info(err);
            } else {
                res.set('Content-Type', 'text/plain');
                res.send({data: group, i: i});
            }
        });
    }
};