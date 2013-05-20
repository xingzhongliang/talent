/**
 * jQuery功能强化
 * Created with IntelliJ IDEA.
 * User: lijiale
 * Date: 13-5-9
 * Time: 下午9:22
 * To change this template use File | Settings | File Templates.
 */

(function ($) {

    var FILE_NAME = 'jQuery-z.js';
    /**
     * 获取元素位置及尺寸信息 不支持链式操作
     * @return {*}
     */
    $.fn.getPosAndSize = function () {
        var el = this.get(0);
        return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
            width: el.offsetWidth, height: el.offsetHeight
        }, this.offset());
    };


    /**
     * 在指定位置添加一个元素  盗版自bootstrap
     * option = {
     *     position :  left | right | top | bottom | center
     *     ,content :  text | html | dom
     *     ,container : dom
     *     ,pla :  {x,y} 采用相对定位 以当前元素的位置为基准做偏移
     *     ,zIndex :  999
     *     ,click :  function
     * }
     * @return {*|null}
     */
    var co = '_CV_OPT_';
    $.fn.addCover = function (opt) {
        //default option
        var def = {
            position: 'bottom',
            floor: null
//            ,of:{left..top}  offset
        };
        opt = merge(def, opt);
        return this.each(function () {
            var self = this, $self = $(this);
            var pos = $self.getPosAndSize();
            var $d = opt.floor ? $(opt.floor) : $(create('DIV')).css({
                position: 'absolute',
                display: 'block',
                maxWidth: '2560',
                maxHeight: '1440',
                zIndex: 1010
            });
            !opt.floor && $d.append(opt.content);
            self == document.body && (opt.container = self);
            opt.container ? $d.appendTo(opt.container) : $d.insertAfter(self);
            var w = $d.get(0).offsetWidth;
            var h = $d.get(0).offsetHeight;
            $d.hide();
            var tp;
//            console.info('top:' + pos.top);
//            console.info('left:' + pos.left);
//            console.info('width:' + pos.width);
//            console.info('height:' + pos.height);
            var l = 0, t = 0;
            if (!opt.container) {
                var p = self;
                while (p.parentNode && p.parentNode != document.body) {
                    p = p.parentNode;
                    if ($(p).css('position') == 'absolute') {
                        console.info($(p).offset());
                        var of = $(p).offset();
                        l += of.left;
                        t += of.top;
                    }
                }
            }

//            if(opt.as) {
//                opt.as.width && (pos.width += opt.as.width);
//                opt.as.height && (pos.height += opt.as.height);
//            }

            if (opt.pla) {
                tp = {left: pos.left + opt.pla.x, top: pos.top + opt.pla.y};
            } else {
                switch (opt.position) {
                    case 'bottom':
                        console.info('bottom');
                        tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - w / 2};
                        break;
                    case 'top':
                        console.info('top');
                        tp = {top: pos.top - h, left: pos.left + pos.width / 2 - w / 2};
                        break;
                    case 'left':
                        console.info('left');
                        tp = {top: pos.top + pos.height / 2 - h / 2, left: pos.left - w};
                        break;
                    case 'right':
                        console.info('right');
                        tp = {top: pos.top + pos.height / 2 - h / 2, left: pos.left + pos.width};
                        break;
                    case 'center':
                        console.info('center');
                        tp = {top: pos.top + pos.height / 2 - h / 2, left: pos.left + pos.width / 2 - w / 2};
                        break;
                }
            }
            if (opt.of) {
                opt.of.left && (tp.left += opt.of.left);
                opt.of.top && (tp.top += opt.of.top);

            }
//            $d.css({left: tp.left, top: tp.top});
            $d.css({left: tp.left - l, top: tp.top - t});
            $self.data(opt.id ? co + opt.id : co, $d.get(0));
            if (opt.click) {
                $d.click(opt.click);
            }
        });
    };

    /**
     * 显示cover
     * @param id
     * @return {*|null}
     */
    $.fn.showCover = function (id) {
        return this.each(function () {
            var it = $(this).data(id ? co + id : co);
            it && $(it).show();
        });
    };

    /**
     * 隐藏cover
     * @param id
     * @return {*|null}
     */
    $.fn.hideCover = function (id) {
        return this.each(function () {
            var it = $(this).data(id ? co + id : co);
            it && $(it).hide();
        });
    };


    /**
     * 合并两个对象的属性  忽略父类的属性
     * @param o1
     * @param o2
     */
    $.simpleMerge = merge;

    function merge(o1, o2) {
        var o = {};
        wrap(o, o1);
        wrap(o, o2);
        return o;
    }

    /**
     * 将o2的所有属性复制到o1
     * @param o1
     * @param o2
     */
    $.simpleWrap = wrap;

    function wrap(o1, o2) {
        try {
            for (var p in o2) {
                if (o2.hasOwnProperty(p)) {
                    o1[p] = o2[p];
                }
            }
        } catch (err) {
            //do nothing
        }
    }

    /**
     * 创建dom
     * @param dom
     * @return {HTMLElement}
     */
    function create(dom) {
        return document.createElement(dom);
    }


    /**
     * 获取location
     * @return {*|Function|Function|Function|Function|string|String|Request.src|String|String|String|String|String|src|src|src|src|src}
     */
    function getLocation() {
        var s = document.getElementsByTagName("script");
        for (var i = s.length; i > 0; i--) {
            if (s[i - 1].src.indexOf(FILE_NAME) != -1) {
                return s[i - 1].src;
            }
        }
    }

    /**
     * 从当前目录加载css
     * @param model
     */
    $.importCSS = function (model) {
        if (model.indexOf('http') == -1) {
            model = getLocation().replace(FILE_NAME, model);
        }
        var dom = document.createElement("link");
        dom.setAttribute("type", "text/css");
        dom.setAttribute("rel", "stylesheet");
        dom.setAttribute("href", model);
        var heads = document.getElementsByTagName("head");
        if (heads.length) {
            heads[0].appendChild(dom);
        } else {
            document.documentElement.appendChild(dom);
        }
    };

    /**
     * 从当前目录加载JS
     * @param model
     */
    $.importJS = function (model) {
        var opt = {
            method: 'get',
            url: getLocation().replace(FILE_NAME, model),
            async: false,
            dataType: 'script'
        };
        $.ajax(opt);
    };


    /**
     * 断言工具
     * @type {{}}
     */
    $.assert = assert;
    var assert = {

        isNotNull: function (obj, msg) {
            if (!obj && obj !== '') {
                throw new Error(msg || 'Null error');
            }
        },

        isAvailable: function (obj, msg) {
            if (!obj) {
                throw  new Error(msg || 'Not available error');
            }
        },

        isNotEmpty: function (obj, msg) {
            if (typeof obj == "boolean") return;
            if (!obj || ($.type(obj) == 'string' && !$.trim(obj))
                || ($.type(obj) == 'array' && !obj.length)
                || ($.type(obj) == 'obj' && $.isEmptyObject(obj))
                || ($.type(obj) == 'obj' && $.isEmptyObject(obj))) {
                throw new Error(msg || 'Empty error')
            }
        }
    };

})(jQuery);

//Add placeholder support for IE
function _ph_support() {
    return 'placeholder' in document.createElement('input');
}

$(function () {
    if (!_ph_support()) {
        $('select,textarea,input[type!="button"][type!="submit"][type!="reset"]').each(function () {
            var self = this, $self = $(this);
            var txt = $self.attr('placeholder'), val = $self.val();
            if (txt) {
                var h = $self.height();
                $self.addCover({
                    content: '<span style="color:gray;font-size:14px">' + txt +'</span>',
                    pla: {x: 10, y: (h-14)/2},
                    click: function () {
                        $(this).hide();
                        window.setTimeout(function () {
                            self.focus()
                        }, 100);
                    }
                }).focus(function () {
                        $(this).hideCover();
                    }).blur(function () {
                        var val = $(this).val();
                        val && (val = $.trim(val));
                        !val && $(this).showCover();
                    });
                !val && $self.showCover();
            }

        });
    }
});
