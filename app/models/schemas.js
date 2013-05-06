///**
// * mongoose 的schema
// * User: laichendong
// * Date: 13-4-26
// * Time: 下午8:47
// */
//var mongoose = require('mongoose')
//    , Schema = mongoose.Schema;
///**
// * 站点
// * @type {*}
// */
//var Site = new Schema({
//    // 网站标题/活动主题 eg：京东达人秀
//    title: String
//    // 地区列表 eg: 北京，成都……
//    , areas: [String]
//    // 投票主题 eg：舞比动人，大师级程序员
//    , subjects: [String]
//    // banner 图片地址
//    , banner: String
//    // 公告
//    , notice: String
//});
//
///**
// * 上传令牌
// * @type {*}
// */
//var Token = new Schema({
//    // token的key
//    key: { type: String, required: true, index: { unique: true } }
//    // 创建时间
//    , createTime: {type: Date, default: Date.now}
//    // 过期时间 默认10天以后
//    , expires: {type: Date, default: function () {
//        var d = new Date();
//        d.setDate(d.getDate() + 10);
//        return d;
//    }}
//});
//
//
///**
// * 投票
// * @type {Schema}
// */
//var Vote = new Schema({
//    // 投票者erp
//    voter_erp: String
//    // 投票者姓名
//    , voter_name: String
//    // 投票者所在部门
//    , voter_department: String
//    // 投给的候选人
//    , candidate: [Candidate]
//    // 投票时间
//    , time: Date
//});