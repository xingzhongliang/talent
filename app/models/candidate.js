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
    name: String // 姓名/名称
    , value: { type: String, required: true } // 用于标识candidate的值 候选者是人时为候选人的erpId，如果是其他，则由系统指定
    , subject: String // 属于哪个subject
    , scope: String // 属于哪个scope
    , group: String // 属于哪个group
    , department: String // 部门 candidate是人时提供
    , avatar: String // 头像 candidate是人时提供
    , introduce: String // 简介
    , witOfText: String // 才艺文字展示
    , witOfImg: String // 才艺图片展示
    , witOfAudio: String // 才艺音频展示
    , witOfVideo: String // 才艺视频展示
    , votes: Number // 得票数
});

/******************* 属性验证方法开始 ******************/


/******************* 属性验证方法结束 ******************/

/******************* 成员方法开始 ******************/
CandidateSchema.methods = {
    insert: function(callBack) {
        this.save(callBack);
    }
};
/******************* 成员方法结束 ******************/

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
    }

};

/******************* 静态方法结束 ******************/

mongoose.model("Candidate", CandidateSchema);