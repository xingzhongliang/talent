/**
 * 站点主题
 * 一个主题就是一个活动，比如“京东达人秀活动”或“code hack day”活动
 * 新建一个主题时，默认会相应的新建一个属于他的scope和group
 *
 * User: lijiale, laichendong
 * @type {*}
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/**
 * 主题
 * @type {*}
 */
var SubjectSchema = new Schema({
    name: String  // 活动名称
    , comment: String   // 备注
    , detail: String // 活动详细说明 html富文本
    , banner: String  // banner图片地址
    , voteChance: {type: Number, default: 1}  // 每个人可以投票的次数 默认1次
    , voteStart: Date // 投票开始时间
    , voteEnd: Date // 投票结束时间
    , regStart: Date //  报名开始时间
    , regEnd: Date // 报名结束时间
    , canReg: {type: Boolean, default: true} // 是否开放报名，报名是指user可以变成candidate
    , isPrivate: Boolean //  是否所有人可见
    , token: String // 如果token值不为空 则user成为candidate时需要token
    , owner: String // 创建者erp账号
    , createTime: Date //创建日期
    , round: {type: Number, default: 1} // 当前第几轮 默认1次 可以重新开启新一轮投票
});

SubjectSchema.statics = {
    load: function (id, cb) {
        this.findOne({ _id: id }).exec(cb);
    },

    list: function (options, cb) {
        var criteria = options.criteria || {};
        this.find(criteria)
            .limit(options.pageSize)
            .skip(options.pageSize * options.page)
            .exec(cb);
    }

};

SubjectSchema.methods = {
    create : function(cb){
        this.save(cb);
    }
};

mongoose.model("Subject", SubjectSchema);



