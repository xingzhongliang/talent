/**
 * group  组
 * group 是对candidate的一种组织（水平）维度，对应到员工来理解，就是职能，比如研发，测试等等
 * User: laichendong
 * Date: 13-5-7
 * Time: 下午3:09
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * @type {Schema}
 */
var GroupSchema = new Schema({
    name: String // 名称
    , subject: String // 属于哪个subject的
    , max: {type: Number, default: 9999} // 报名人数上限
    , createTime: {type: Date, default: Date.now} // 创建时间
    , yn: {type: Number, default: 1} // 是否可用
});

GroupSchema.statics = {
    load: function (id, cb) {
        this.findOne({ _id: id }).exec(cb);
    },

    findBySubjectId: function (sid, cb) {
        _list.call(this, {subject: sid, yn: 1}, cb);
    },

    list: function (conditon, cb) {
        _list.call(this, conditon, cb);
    },

    del: function (cb) {
        this.remove(cb)
    }
};

function _list(condition, cb) {
    this.find(condition)
        .sort({createTime: '1'})
        .exec(cb);
}

mongoose.model("Group", GroupSchema);