/**
 * 表单验证js
 * Created with IntelliJ IDEA.
 * User: lijiale
 * Date: 13-5-8
 * Time: 下午3:36
 * To change this template use File | Settings | File Templates.
 */
(function ($) {

    var JConsole = {} , debug = false;
    var SUPP = 'select,textarea,input[type!="button"][type!="submit"][type!="reset"]';
    var VT = '_validate_T_';
    var VC = '_validate_C_';
    var VE = '_validate_E_';
    var VR = '_validate_R_';
    JConsole.info = function (msg) {
        debug && console.info(msg);
    };
    JConsole.error = function (msg) {
        debug && console.error(msg);
    };
    var opt = {
        lazy: false,
        event: 'change',
        observer: true,
        strict: true,
        showTip: false,
        forbidden: false,
        cache: true  //启用如果发现对象的值没有变化，将会直接返回上次的验证结果，当这个对象的验证结果依赖别的表单域时，请设置为false
    };

    var rule = {
        'default': '@val', //如果this.value == @val 那么验证结果必定为真,
        'require': '@name不能为空',
        'length': '@name长度须在@lower至@greater之间',
        'email': '@name不是电子邮箱格式',
        'number': '@name不是数字',
        'decimal': '@name不是数字',
        'idCard': '@name必须是身份证号码',
        'mobile': '@name不是手机号码',
        'telephone': '@name不是固定电话或手机号码',
        'postCode': '@name不是邮编',
        'bankCardNo': '@name不是正确的银行卡号',
        'vehicleLicense': '@name不是车牌号码',
        'account': '@name只能包含字母、数字@ext并以字母开头',
        'keyword': '@name关键字只能包含汉字、数字，必须以汉字开头'
    };
    var handler = {
        'require': _req,
        'length': _len,
        'email': /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
        'number': _num,
        'idCard': /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
        'mobile': /^(13[0-9]|15[0|1|3|6|7|8|9]|18[1|6|7|8|9])\d{8}$/,
        'telephone': /(^(0[0-9]{2,3}-)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?$)|(^(13[0-9]|15[0|1|3|6|7|8|9]|18[8|9])\d{8}$)/,
        'postCode': /^[a-zA-Z0-9 ]{3,12}$/,
        'decimal': _decimal,
        'bankCardNo': /^[0-9]{19}$/,
        //'vehicleLicense':/^[\u4E00-\u9FA5]([0-9A-Z]{6})|([0-9A-Z]{5}[\u4E00-\u9FA5]{1})$/,
        'vehicleLicense': /^[\u4E00-\u9FA5][A-Z][0-9A-Z]{5}$/,
        'account': /^\w+[\d\w]*$/,
        'keyword': /^[\u4E00-\u9FA5][0-9\u4E00-\u9FA5]+$/
    };


    function _check() {
        var result = {r: true}, self = this, $self = $(self);
        try {
            var val = $self.val();
            var defVal = self[VT]['default'];
            if ((!self[VT]['require'] && !val) || (val && defVal && val == defVal)) {
                JConsole.info('<...skip all validate...>');
                self[VR] = {r: true, val: val};
                return self[VR];
            }
            if (opt.cache && self[VR] && self[VR].val == val) {          //return the latest result
                return self[VR];
            }
            JConsole.info('execute check :');
            result.val = val;
            for (var r in self[VT]) {
                if (!self[VT].hasOwnProperty(r)) {
                    continue;
                }
                if (r != 'sub') {
                    if (self[VE] && self[VE][r]) {
                        JConsole.info('execute custom check:' + r);
                        JConsole.info(typeof self[VE][r]);
                        result = self[VE][r].call(this);
                        JConsole.info('custom check over');
                    } else {
                        if (typeof handler[r] == 'object') {
                            result.r = handler[r].test(val);
                            !result.r && (result.msg = _msgHandler(rule[r], self));
                        } else if (handler[r]) {
                            result = handler[r](self, self[VT][r]);
                        }
                    }
                } else {
                    JConsole.info('call join func....');
                    for (var i in self[VT][r]) {
                        if (self[VT][r].hasOwnProperty(i)) {
                            result = self[VT][r][i].call(this);
                            if (!result.r) {
                                break;
                            }
                        }
                    }
                }
                if (!result.r) {
                    break;
                }
            }
            self[VR] = result;
            _showMsg(self, result);
            return result.r;
        } catch (err) {
            JConsole.error(err);
            return {r: false, msg: 'validator error'};
        }
    }

    function _vali(rules) {
        var result = {};
        for(var rule in rules) {
            if(rules.hasOwnProperty(rule)) {
                if (typeof handler[rule] == 'object') {
                    result.r = handler[rule].test(val);
                    !result.r && (result.msg = _msgHandler(rule[rule], this));
                } else if (handler[rule]) {
                    result = handler[rule](this, rules[rule]);
                }
                if(!result.r) {
                    return result;
                }
            }
        }
        return result;
    }

    /**
     * 表单验证初始化
     * @param setting
     * @return {*|null}
     */
    $.fn.validateInit = function (setting) {
        return this.each(function () {
            var self = this, $self = $(self);
            JConsole.info('validateInit....');
            if (self.tagName != 'FORM') {
                throw new Error('Invalid Element :' + self.attr('tagName'));
            }
            opt = $.extend({}, opt, setting);
            $self.bind('submit',
                function () {
                    return opt.forbidden || $(this).validate(true);
                }).find(SUPP).each(function () {
                    _init.call(this);
                });
        });
    };

    function _init() {
        var self = this, $self = $(self);
        var v = $self.attr('v');
        if (!v) return false;
        JConsole.info('Init...' + v);
        v && (self[VT] = _param(v));
        JConsole.info('handler bind...' + this.tagName);
        this[VC] = false;
        if (self.tagName == 'SELECT') {
            $self.change(_check);
        } else if (self.type != 'text' && this.type != 'password' && self.tagName != 'TEXTAREA') {
            $self.bind('click', _check);
        } else {
            $self.bind(opt.event, _check);
        }
        $self.blur(_check);
        return true;
    }


    function _param(v) {
        var arr = v.split(';');
        var rule = {};
        for (var i in arr) {
            if (!arr.hasOwnProperty(i) || !$.trim(arr[i])) {
                continue;
            }
            var arg = arr[i].split(':');
            rule[arg[0]] = arg.length > 1 ? arg[1] : true;
        }
        return rule;
    }


    $.fn.validateJoin = function (handler, ru) {
        return this.each(function () {
            var self = this;
            if (self && self.tagName) {
                rule = ru ? ru : 'sub';
                self[VT] && ( _init.call(self));
                if (!ru) {
                    self[VT][rule] && (self[VT][rule] = []);
                    self[VT][rule].push(handler);
                } else {
                    !self[VE] && (self[VE] = {});
                    self[VE][ru] = handler;
                }
            }
        });
    };

    /**
     * 注意这个方法不支持jQuery的链式操作
     * @param rule
     */
    $.fn.validate = function (rule) {
        var result = true;
        this.each(function () {
            var self = this, $self = $(self);
            if (self.tagName != 'FORM') {
                //validate single
                return rule ? self[VT][rule] ? self[VT][rule].call(self) : _vali.call(self,_param(rule)) : _check.call(self);
            } else {
                //validate form
                $self.find(SUPP).each(function () {
                    this[VT] && _check.call(this);
                }).each(function(){
                    var it = this;
                    if(it[VT] && !it[VR].r) {
                        result = false;
                        window.setTimeout(function(){console.info(it);$(it).focus()},100);
                    }
                    return result;
                });
                return result;
            }
        });
        return result;
    };


    function _req(dom) {
        JConsole.info('>>>>>>req::');
        var r = {r: false, msg: _msgHandler(rule['require'], dom)}, val = dom.value;
        if (dom.tagName == 'SELECT') {
            val = $(dom).find('option:selected').attr('value');
        }
        JConsole.info(dom.tagName);
        JConsole.info(val);
        if (dom.type == 'radio' || dom.type == 'checkbox') {
            $('input[name="' + dom.name + '"]:checked').length == 0 ? (r.r = false) : (r.r = true);
        } else if (val && $.trim(val) != '') {
            r.r = true;
        }
        return r;
    }

    function _len(dom, param) {
        var r = {r: false, msg: _msgHandler(rule['length'], dom)}, val = dom.value;
        var lower, greater;
        if (param.indexOf(',') == -1) {
            lower = 0;
            greater = parseInt(param, 10);
        } else {
            var temp = param.split(',');
            lower = parseInt(temp[0], 10);
            greater = parseInt(temp[1], 10);
        }
        if (lower == greater) {
            r.msg = '长度必须是' + lower + '位';
        } else {
            r.msg = r.msg.replace('@lower', lower).replace('@greater', greater);
        }
        var l = val.length ? val.length : 0;
        if (l >= lower && l <= greater) {
            r.r = true;
        }
        return r;
    }

    function _decimal(dom, param) {
        var r = {r: true, msg: _msgHandler(rule['decimal'], dom)}, val = dom.value, mc;
        var max, min, n, reg = "^[+-]?\\d+(\\.\\d{1,n})?$", d_reg = /^[+-]?\d+(\.\d+)?$/;
        if (typeof param != 'boolean') {
            var args = param.split(',');
            args.length == 3 ? (n = args[0], max = args[1], min = args[2]) : args.length == 2 ? (n = args[0], max = args[1]) : n = args[0];
            if (d_reg.test(val)) {
                d_reg = n > 0 ? new RegExp(reg.replace('n', n)) : new RegExp("^[0-9]*[1-9][0-9]*$");
                (n = n > 0 ? n : 0) && (mc = 10 ^ n);
                d_reg.test(val) ? (val && _compare(val, max) > 0 ? (r = {r: false, msg: '不能大于' + max })
                    : ( _compare(val, min) < 0 && (r = {r: false, msg: '不能小于' + min})))
                    : (r = {r: false, msg: (n > 0 ? '小数位数不得多于' + n + '位' : '必须是整数')});
                JConsole.info(val);
                JConsole.info(max);
                JConsole.info(min)
            } else {
                r = {r: false, msg: '非法的数字格式'};
            }
        } else {
            !d_reg.test(val) && (r.r = false )
        }
        return r;
    }

    function _compare(v1, v2) {
        JConsole.info('compare:' + v1 + ',' + v2);
        var f1 = v1.indexOf('-'), f2 = v2.indexOf('-'), f, r;
        f1 != -1 && f2 == -1 ? (r = -1) : (f1 == -1 && f2 != -1) ? (r = 1) : (r = 0);
        f1 != -1 && (v1 = v1.replace('-', ''), f = true);
        f2 != -1 ? (v2 = v2.replace('-', '')) : (f = false);
        var a1 = jQuery.trim(v1).split('.'), a2 = jQuery.trim(v2).split('.');
        r == 0 && (a1[0].length > a2[0].length ? (r = 1) : (a1[0].length < a2[0].length) ? (r = -1) : (r = checkQueue(a1[0], a2[0])));
        r == 0 && (r = checkQueue(a1[1], a2[1]));
        function checkQueue(q1, q2) {
            q1 = q1 && q1 != '' ? q1 : '0', q2 = q2 && q2 != '' ? q2 : '0';
            var len = Math.max(q1.length, q2.length);
            for (var i = len - 1; i >= 0; i--) {
                if (q1.charAt(i) > q2.charAt(i) && q1.charAt(i) != '0') {
                    return 1;
                } else if (q1.charAt(i) < q2.charAt(i) && q2.charAt(i) != '0') {
                    return -1;
                }
            }
            return 0;
        }

        return f ? (r > 0 ? r = -1 : r < 0 ? r = 1 : r ) : r;
    }

    function _num(dom, param) {
        var r = {r: true, msg: _msgHandler(rule['number'], dom)}, val = dom.value;
        var max, min, reg = /^\d+$/;
        !reg.test(val) && (r.r = false);
        if (typeof param != 'boolean' && r.r) {
            var args = param.split(',');
            args.length == 2 ? (max = args[0], min = args[1]) : (max = args[0]);
            parseInt(val, 10) > parseInt(max, 10) ? (r.r = false, r.msg = '不能大于' + max)
                : (min && parseInt(val, 10) < parseInt(min, 10) ? (r.r = false, r.msg = '不能小于' + min) : (r.r = true));
        }
        return r;
    }

    function _msgHandler(msg, dom) {
        var n = dom.title ? dom.title : '';
        if (msg.indexOf('@name') != -1) {
            msg = msg.replace('@name', n);
        }
        return msg;
    }

    function validate_fail(obj,r) {
        var div = document.createElement('div');
       $(div).css({padding:'5px',width:'150',height:'auto'}).html(r.msg);
        $(obj).zpop({
            position:'left'
            ,target:div
            ,style:'validate-popover'
        }).focus(_show).blur(_hide).parents('.control-group').addClass('error');
    }

    function _show() {
        $(this).showCover();
    }
    function _hide() {
        $(this).hideCover();
    }

    function success(r) {
        $(this).unbind('focus',_show).unbind('blur',_hide).removeCover().parents('.control-group').removeClass('error');
    }

    function _showMsg(obj, result) {
        JConsole.info(result.r +':' + result.msg);
        if (!result.r) {
            validate_fail(obj, result);
        } else {
            success.call(obj, result);
        }
    }

    $.fn.formSerialize = function () {
        this.find('input[name="sbmt_timestamp"]').length == 0 && this.append('<input name="sbmt_timestamp" type="hidden"/>');
        this.find('input[name="sbmt_timestamp"]').val(new Date().getTime());
        return this.serialize();
    }

})(jQuery);