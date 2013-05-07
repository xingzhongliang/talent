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
    , time: Date // 投票时间
});

mongoose.model("Vote", VoteSchema);