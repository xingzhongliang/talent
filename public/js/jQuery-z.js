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
     * }
     * @return {*|null}
     */
    var co = '_CV_OPT_';
    $.fn.addCover = function (opt) {
        //default option
        var def = {
            position: 'bottom'
        };
        opt = merge(def, opt);
        return this.each(function () {
            var self = this, $self = $(this);
            var pos = $self.getPosAndSize();
            var $d = $(create('DIV')).css({
                position: 'absolute',
                display: 'block',
                maxWidth: '2560',
                maxHeight: '1440'
            }).append(opt.content);
            self == document.body && (opt.container = self);
            opt.container ? $d.appendTo(opt.container) : $d.insertAfter(self);
            var w = $d.get(0).offsetWidth;
            var h = $d.get(0).offsetHeight;
            $d.hide();
            var tp;
            console.info('top:' + pos.top);
            console.info('left:' + pos.left);
            console.info('width:' + pos.width);
            console.info('height:' + pos.height);
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
            $d.css({left: tp.left, top: tp.top});
            $self.data(opt.id ? co + opt.id : co, $d.get(0));
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
            url: getLocation().replace(FILE_NAME,model),
            async: false,
            dataType: 'script'
        };
        $.ajax(opt);
    }

})(jQuery);
