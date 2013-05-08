/**
 * 工具类，将request对象和一些工具方法放到了res.local里，方便jade中引用
 * 工具类方法一定要捕获异常
 * User: laichendong
 * Date: 13-5-5
 * Time: 下午7:32
 */

/**
 * Module dependencies.
 */

var url = require('url')
    , qs = require('querystring')
    , moment = require('moment');

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
        res.locals.createPagination = createPagination;
        res.locals.cut = cut;
        res.locals.fmt = fmt;
        res.locals.fmt2 = fmt2;

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
 * @return {function}
 * @api private
 */

function createPagination(req) {
    return function createPagination(pageSize, pageNo) {
        try {
            var params = qs.parse(url.parse(req.url).query)
            var str = ''

            params.page = 0
            var clas = pageNo == 0 ? "active" : "no"
            str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">First</a></li>'
            for (var p = 1; p < pageSize; p++) {
                params.page = p
                clas = pageNo == p ? "active" : "no"
                str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">' + p + '</a></li>'
            }
            params.page = --p
            clas = pageNo == params.page ? "active" : "no"
            str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">Last</a></li>'

            return str
        }catch(err) {
            return '';
        }
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
    try {
        if (str.length < maxLenght) {
            return str;
        } else {
            return str.substr(0, maxLenght) + "...";
        }
    } catch (err) {
        return '';
    }
}

/**
 * 以yyyy-MM-dd格式格式化日期
 * @param date
 * @returns {*}
 */
function fmt(date) {
    return fmt2(date,'YYYY-MM-DD');
}

/**
 * 将日期格式化为指定的格式
 * @param date
 * @param fmt
 * @returns {*}
 */
function fmt2(date,fmt) {
    try {
        if(!date || !fmt) {
            throw new Error('date or format string  is undefined');
        }
        return moment(date).format(fmt);
    } catch (err) {
        return '';
    }
}