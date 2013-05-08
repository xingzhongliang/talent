/**
 * 工具类，将request对象和一些工具方法放到了res.local里，方便jade中引用
 * User: laichendong
 * Date: 13-5-5
 * Time: 下午7:32
 */

/**
 * Module dependencies.
 */

var url = require('url')
    , qs = require('querystring');

/**
 * Helpers method
 *
 * @param {String} name
 * @return {Function}
 * @api public
 */

function utils(name) {
    return function (req, res, next) {
        res.locals.appName = name || 'App';
        res.locals.title = name || 'App';
        res.locals.req = req;
        res.locals.formatDate = formatDate;
        res.locals.formatDatetime = formatDatetime;
        res.locals.stripScript = stripScript;
        res.locals.createPagination = createPagination(req);
        res.locals.cut = cut;

        if (typeof req.flash !== 'undefined') {
            res.locals.info = req.flash('info');
            res.locals.errors = req.flash('errors');
            res.locals.success = req.flash('success');
            res.locals.warning = req.flash('warning');
        }

        next();
    }
}

module.exports = utils;

/**
 * Pagination helper
 *
 * @param {Number} pages
 * @param {Number} page
 * @return {String}
 * @api private
 */

function createPagination(req) {
    return function createPagination(pages, page) {
        var params = qs.parse(url.parse(req.url).query)
        var str = ''

        params.page = 0
        var clas = page == 0 ? "active" : "no"
        str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">首页</a></li>'
        for (var p = 0; p < pages; p++) {
            params.page = p
            clas = page == p ? "active" : "no"
            str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">' + (p + 1) + '</a></li>'
        }
        params.page = --p
        clas = page == params.page ? "active" : "no"
        str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">尾页</a></li>'

        return str
    }
}

/**
 * Format date helper
 *
 * @param {Date} date
 * @return {String}
 * @api private
 */

function formatDate(date) {
    var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
    return monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear()
}

/**
 * Format date time helper
 *
 * @param {Date} date
 * @return {String}
 * @api private
 */

function formatDatetime(date) {
    var hour = date.getHours();
    var minutes = date.getMinutes() < 10
        ? '0' + date.getMinutes().toString()
        : date.getMinutes();

    return formatDate(date) + ' ' + hour + ':' + minutes;
}

/**
 * Strip script tags
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function stripScript(str) {
    return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

/**
 * 截取字符串
 * @param str
 * @param maxLenght
 * @return {*}
 */
function cut(str, maxLenght) {
    if(!str){
        return "";
    }
    if (str.length < maxLenght) {
        return str;
    } else {
        return str.substr(0, maxLenght) + "...";
    }
}