/**
 * 网站配置文件
 * @type {{}}
 */

var path = require('path')
    , rootPath = path.normalize(__dirname + '/..');
module.exports = {
    db: 'mongodb://localhost/talent',
    root: rootPath,
    app: {
        name: '京东达人秀'
    }
};