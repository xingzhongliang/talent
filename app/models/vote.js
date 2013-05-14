/**
 * vote  投票记录
 * User: laichendong
 * Date: 13-5-7
 * Time: 下午3:19
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 投票
 * @type {Schema}
 */
var VoteSchema = new Schema({
    voter_erp: String  // 投票者的erp账号
    , voter_name: String // 投票者姓名
    , voter_department: String // 投票者部门
    , subject: String  // 活动的主题 方便统计
    , candidate: String // 投给了谁
    , round: String // 第几轮投票
    , time: {type: Date, default: Date.now} // 投票时间
});

VoteSchema.statics = {

    /**
     * 判断一个投票者是否对某个主题的当前轮投过票
     * @param voter 投票者erp
     * @param subject 主题
     * @param cb 如果投过，cb中的vote参数将是投票对象
     */
    voted: function (voter, subject, cb) {
        this.findOne({
            voter_erp: voter,
            subject: subject._id,
            round: subject.round
        }).exec(cb);
    }
};

mongoose.model("Vote", VoteSchema);