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
});

mongoose.model("Scope", ScopeSchema);