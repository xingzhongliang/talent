/**
 * 网站配置文件
 * @type {{}}
 */

var path = require('path');
var rootPath = path.normalize(__dirname + '/..');

module.exports = {
    db: 'mongodb://localhost:27017/talent', // 数据库连接字符串
    root: rootPath, // 系统根路径
    app: {
        name: 'JD.com' // 项目名字
        , needErpLogin : false // 是否需要用erp账号登录， 本地开发不能连通erp时使用false， 则输入任何用户名密码都能登录
        , pageSize : 10 // 默认的分页大小
        , pageNo : 0 // 默认页号
    },
    admins: ["bjlaichendong"], // 系统管理员erp列表 存到表里？
    isAdmin: function (userName) { // 判断一个erp是否是管理员
        return this.admins.toString().indexOf(userName) >= 0;
    }
};