/**
 * 候选人controller
 * User: laichendong
 * Date: 13-5-5
 * Time: 下午1:10
 */
var mongoose = require("mongoose");
var Candidate = mongoose.model("Candidate");

/**
 * 新候选人
 * @param req
 * @param res
 */
exports.new = function (req, res) {
    var candidate = new Candidate({
        erpId : "bjlaichendong"
    });
    candidate.insert(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }

    });
};
