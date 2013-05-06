/**
 * lijiale
 * 临时设计稿！！
 * 域和组需要重新拆分设计
 *
 * @type {*}
 */
var mongoose = require('mongoose')
    , Schema = mongoose.Schema;
/**
 * 主题
 * @type {*}
 */
var Subject = new Schema({
    title: String,
    scope: [      //域
        {
            name: String, // 域的名字 ，例如在达人秀中就应该是 “北京”、“沈阳”等
            group: [   //分类
                {
                    name: String, //分类名称 ，“大师级程序员”、“无名小卒”
                    maxSize: String, //option上限
                    option: [        //选项
                        {
                            name: String, //选项名称 ，“王xx”、“李xx”
                            type: String,  //1：txt、2：image+txt、3：detail
                            thumbnail: String, //缩略图路径
                            detail: String, //根据type类型 detail-url
                            userId: String,  //创建者ID
                            createTime: Date, // 创建时间
                            voteCount: String // 得票数
                        }
                    ]
                }
            ]
        }
    ],
    name: String  //活动名称
    , comment: String   //备注
    , template: String  //使用的模板
    , voteChance: String  // 每个人可以投票的次数
    , regChance: String  // 每个人可以报名的次数
    , voteStart: Date //  投票开始时间
    , voteEnd: Date // 投票结束时间
    , regStart: Date //  报名开始时间
    , regEnd: Date // 报名结束时间
    , openOpt: String // 是否开放option
    , isPrivate: String //  是否所有人可见
    , token: String // 如果token值不为空 则普通用户在新增option时需要令牌
    , userId: String // 创建者ID
    , createTime: Date //创建日期
    , round: String // 当前第几轮 默认1 可以重新开启新一轮投票
    , openUserComment: String //是否开启用户对主题及option-detail的评论功能
});


/**
 * 投票
 * @type {Schema}
 */
var Vote = new Schema({
    userId: String,  //用户ID
    subjectId: String,  //主题ID
    optionId: String, //选项ID
    round: String, //第几轮
    time: Date
});
/**
 * 选项详情
 * @type {Schema}
 */
var OptionDetail = new Schema({
    subjectId: String,
    optionId: String,
    name: String,  //名称
    remark: String,  //备注内容
    img: String,  //图片路径
    html: String,  //富文本 用于在详情主页详尽说明
    comment: [      //评论
        {
            userId: String,    //评论人
            userName: String,    //评论人名称
            content: String,   //内容
            time: Date    //日期
        }
    ]
});

/**
 * 模板
 * @type {Schema}
 */
var template = new Schema({
    isPrivate: String, //是否是私有的 只有管理员可以创建公用模板
    name: String,  // 模板名称
    skin: String, //皮肤,
    subParam: {}  // 主题参数
});
