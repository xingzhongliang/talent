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
    , moment = require('moment')
    , config = require("../config");

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
        res.locals.fmt = fmt;
        res.locals.fmt2 = fmt2;
        res.locals.config = config;
        res.locals.scopeName = _name;
        res.locals.groupName = _name;
        res.locals.isActive = isActive;

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
        try {
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
        } catch (err) {
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
    return fmt2(date, 'YYYY-MM-DD');
}

/**
 * 将日期格式化为指定的格式
 * @param date
 * @param fmt
 * @returns {*}
 */
function fmt2(date, fmt) {
    try {
        if (!date || !fmt) {
            throw new Error('date or format string  is undefined');
        }
        return moment(date).format(fmt);
    } catch (err) {
        return '';
    }
}

function _name(id, arr) {
    try {
        for (var i = 0; i < arr.length; i++) {
            if (id == arr[i]._id) {
                return arr[i].name;
            }
        }
    } catch (err) {
        return '';
    }
}

/**
 * 判断导航是否要高亮
 * @param navPath
 * @param url
 */
function isActive(navPath, url) {
    if (url.indexOf(navPath) >= 0) {
        return "active";
    } else if (navPath == "/admin" && url.indexOf("/subject") >= 0) {
        return "active";
    } else {
        return "";
    }
}