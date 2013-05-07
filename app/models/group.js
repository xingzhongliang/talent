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
    subject: String // 属于哪个subject的
    , name: String // 名称
});

mongoose.model("Group", GroupSchema);