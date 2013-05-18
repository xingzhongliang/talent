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
var Scope = mongoose.model("Scope");
var Group = mongoose.model("Group");
/**
 * 主题
 * @type {*}
 */
var SubjectSchema = new Schema({
    name: String  // 活动名称
    , comment: String   // 备注
    , detail: String // 活动详细说明 html富文本
    , banner: String  // banner图片地址
    , canReg: {type: Boolean, default: true} // 是否开放报名，报名是指user可以变成candidate
    , regChance: {type: Number, default: 1}  // 每个人可以报名的次数 默认1次
    , voteChance: {type: Number, default: 1}  // 每个人可以投票的次数 默认1次
    , voteStart: Date // 投票开始时间
    , voteEnd: Date // 投票结束时间
    , regStart: Date //  报名开始时间
    , regEnd: Date // 报名结束时间
    , isPrivate: {type: Boolean, default: true} //  是否所有人可见
    , token: String // 如果token值不为空 则user成为candidate时需要token
    , owner: String // 创建者erp账号
    , createTime: {type: Date, default: Date.now} //创建日期
    , round: {type: Number, default: 1} // 当前第几轮 默认1次 可以重新开启新一轮投票
    , topStartTime:Date  // 置顶开始时间
    , topEndTime:Date  // 置顶结束时间
    , yn: {type: Number, default: 1}  //是否可用
    , viewOpt: { // 页面展示选项
        templateName: String // 使用模板名称，隐含指定了模板路径
        , showType: {type: Number, default: 3}  // 候选项在前台的展示方式1、文本；2、图片；3、详情页
        , candidateIsEmployee: {type: Boolean, default: true}  // 选项是否为京东员工
        , newCandidatePage: { // 新增选项页面相关配置
            actionLabel: {type: String, default: "报名"} // 新增选项动作名称
            , scopeLabel: {type: String, default: "地区"} // 选项所属域表单label
            , groupLabel: {type: String, default: "分组"} // 选项所属组表单label
            , titleLabel: {type: String, default: "姓名"} // 选项标题表单label
            , imgLabel: {type: String, default: "头像"} // 选项图片表单label
            , descriptionLabel: {type: String, default: "简介"} // 选项详细介绍表单label
            , detailLegend: {type: String, default: "才艺展示"} // 选项详情的表单legend
            , actionBtnLabel: {type: String, default: "提交报名"} // 新增选项动作按钮名称
        }, actionBtnLabel: {type: String, default: "投票"} // 前台用户交互按钮名称
    }
});

SubjectSchema.statics = {
    load: function (id, cb) {
        this.findOne({ _id: id }).exec(cb);
    },

    list: function (options, cb) {
        var criteria = options.criteria || {};
        this.find(criteria)
            .sort({createTime: '-1'})
            .limit(options.pageSize)
            .skip(options.pageSize * options.page)
            .exec(cb);
    },

    /**
     * 查询主题下的所有scope和group
     * @param id
     * @param cb
     * @private
     */
    scopesAndGroups: function (id, cb) {
        Scope.findBySubjectId(id, function (err, scopes) {
            // 查询主题下的组
            Group.findBySubjectId(id, function (err, groups) {
                cb.call(this, scopes, groups, err);
            });
        });
    }

};

SubjectSchema.methods = {
    create: function (cb) {
        this.save(cb);
    }
};

mongoose.model("Subject", SubjectSchema);



