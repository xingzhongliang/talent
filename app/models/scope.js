/**
 * scop 域
 * scop 是对candidate的一种组织（垂直）维度，对应到员工来理解，就是部门，比如pop，大物流，网站组等等
 * User: laichendong
 * Date: 13-5-7
 * Time: 下午3:00
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/**
 * @type {Schema}
 */
var ScopeSchema = new Schema({
    subject: String // 属于哪个subject的
    , name: String // 名称
    , createTime: {type: Date, default: Date.now} // 日期
    , yn: {type: Number, default: 1} // 是否可用 1=可用、0=不可用
});

ScopeSchema.statics = {
    load: function (id, cb) {
        this.findOne({ _id: id }).exec(cb);
    },

    findBySubjectId: function (sid, cb) {
        _list.call(this, {subject: sid, yn: 1}, cb);
    },

    list: function (conditon, cb) {
        _list.call(this, conditon, cb);
    }

};

function _list(condition, cb) {
    this.find(condition)
        .sort({createTime: '-1'})
        .exec(cb);
}

mongoose.model("Scope", ScopeSchema);
