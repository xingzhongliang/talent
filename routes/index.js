/**
 * URL映射配置
 * @type {*}
 */
//权限控制
var auth = require('./auth.js');

 //1、引入各个controller文件
var login = require('../controller/login.js');
var addSub = require('../controller/addSubject.js');

//2、controller--view映射
module.exports = function (app) {
    //首页
    app.get('/', function (req, res) {
        res.render('index', {
            title: '首页'
        });
    });

    //登陆页 - 无权限控制
    app.get('/login', login);

    //管理员添加活动主题 - 有权限控制
    app.post('/addSubject',auth);
    app.post('/addSubject',addSub);



}