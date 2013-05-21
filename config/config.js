/**
 * 网站配置文件
 * @type {{}}
 */

var path = require('path');
var rootPath = path.normalize(__dirname + '/..');

module.exports = {
    // 研发环境配置
    development: {
        db: 'mongodb://192.168.192.126/talent', // 数据库连接字符串
        root: rootPath, // 系统根路径
        uploadDir: 'D:\\TEMP', // 文件上传的目录 ： 不能放在应用目录下面 防止应用更新时被误删
        templateDir: rootPath + '\\templates', // 模板文件夹
        app: {
            domain: "127.0.0.1:3000" //项目域名，也充当url前缀
            , name: 'Genius Bar' // 项目名字
            , needErpLogin: false // 是否需要用erp账号登录， 本地开发不能连通erp时使用false， 则输入任何用户名密码都能登录
            , pageSize: 10 // 默认的分页大小
            , page: 0 // 默认页号
        },
        admins: ['bjlaichendong', 'ghost'], // 系统管理员erp列表 存到表里？
        isAdmin: function (userName) { // 判断一个erp是否是管理员
            for (var i = 0; i < this.admins.length; i++) {
                if (userName == this.admins[i]) return true;
            }
            return false;
        }
    },

    // 测试环境配置
    test: {
        db: 'mongodb://192.168.192.126/talent', // 数据库连接字符串
        root: rootPath, // 系统根路径
        uploadDir: '/root/temp/uploads', // 文件上传的目录 ： 不能放在应用目录下面 防止应用更新时被误删
        templateDir: rootPath + '/templates', // 模板文件夹
        app: {
            domain: "genius.jd.com:3000" //项目域名，也充当url前缀
            , name: 'Genius Bar' // 项目名字
            , needErpLogin: false // 是否需要用erp账号登录， 本地开发不能连通erp时使用false， 则输入任何用户名密码都能登录
            , pageSize: 10 // 默认的分页大小
            , page: 0 // 默认页号
        },
        admins: ['bjlaichendong', 'ghost'], // 系统管理员erp列表 存到表里？
        isAdmin: function (userName) { // 判断一个erp是否是管理员
            for (var i = 0; i < this.admins.length; i++) {
                if (userName == this.admins[i]) return true;
            }
            return false;
        }
    },

    // 生产环境配置
    production: {
        db: 'mongodb://192.168.192.126/talent', // 数据库连接字符串
        root: rootPath, // 系统根路径
        uploadDir: '/root/temp/uploads', // 文件上传的目录 ： 不能放在应用目录下面 防止应用更新时被误删
        templateDir: rootPath + '/templates', // 模板文件夹
        app: {
            domain: "genius.jd.com:3000" //项目域名，也充当url前缀
            , name: 'Genius Bar' // 项目名字
            , needErpLogin: false // 是否需要用erp账号登录， 本地开发不能连通erp时使用false， 则输入任何用户名密码都能登录
            , pageSize: 10 // 默认的分页大小
            , page: 0 // 默认页号
        },
        admins: ['bjlaichendong', 'ghost'], // 系统管理员erp列表 存到表里？
        isAdmin: function (userName) { // 判断一个erp是否是管理员
            for (var i = 0; i < this.admins.length; i++) {
                if (userName == this.admins[i]) return true;
            }
            return false;
        }
    }
};