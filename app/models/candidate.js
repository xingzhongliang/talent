/**
 * User: laichendong
 * Date: 13-5-4
 * Time: 下午7:41
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/**
 * 候选人
 * @type {Schema}
 */
var CandidateSchema = new Schema({
    // 姓名
    name: String
    // ERP ID
    , erpId: { type: String, required: true, index: { unique: true } }
    // 部门
    , department: String
    // 所在地
    , area: { type: String, index: true }
    // 所属投票主题
    , subject: { type: String, index: true }
    // 头像
    , avatar: String
    // 简介
    , introduce: String
    // 才艺文字展示
    , witOfText: String
    // 才艺图片展示
    , witOfImg: String
    // 才艺音频展示
    , witOfAudio: String
    // 才艺视频展示
    , witOfVideo: String
    // 得票数
    , votes: Number
});

/******************* 属性验证方法开始 ******************/

/**
 * 验证erpId不为空
 */
CandidateSchema.path("erpId").validate(function (erpId) {
    return erpId.length > 0;
}, "候选人的erpId不能为空");

/******************* 属性验证方法结束 ******************/

/******************* 静态方法开始 ******************/

CandidateSchema.statics = {
    /**
     * 根据erpId获取单个候选人的信息
     * @param erpId 候选人的erpId
     * @param callBack 获取后的回调函数
     */
    load: function (erpId, callBack) {
        this.findOne({"erpId": erpId}).exec(callBack);
    },

    /**
     * 按条件获取候选人列表
     * @param options 查找候选人的选项，json对象，包含以下几个属性：
     * criteria : 查询条件，将直接作用于mongo的find函数
     * pageSize : 分页的页面大小
     * pageNo : 分页的页号， 页号从0开始
     * @param callBack 获取候选人列表后的回调函数
     */
    list: function (options, callBack) {
        var criteria = options.criteria || {};
        this.find(criteria)
            .limit(options.pageSize)
            .skip(options.pageSize * options.pageNo)
            .exec(callBack);
    },

    /**
     * 向mongo中插入一个候选人
     * @param candidate 候选人
     * @param callBack 插入后回调的回调函数
     */
    insert: function (candidate, callBack) {
    }
};

/******************* 静态方法结束 ******************/

mongoose.model("Candidate", CandidateSchema);