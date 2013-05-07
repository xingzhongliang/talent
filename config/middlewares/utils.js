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

function utils (name) {
    return function (req, res, next) {
        res.locals.appName = name || 'App';
        res.locals.title = name || 'App';
        res.locals.req = req;
        res.locals.formatDate = formatDate;
        res.locals.formatDatetime = formatDatetime;
        res.locals.stripScript = stripScript;

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
 * Format date helper
 *
 * @param {Date} date
 * @return {String}
 * @api private
 */

function formatDate (date) {
    var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
    return monthNames[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear()
}

/**
 * Format date time helper
 *
 * @param {Date} date
 * @return {String}
 * @api private
 */

function formatDatetime (date) {
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

function stripScript (str) {
    return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}
