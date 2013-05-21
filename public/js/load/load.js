/**
 * 带loading图标提示的ajax方法
 * Created with IntelliJ IDEA.
 * User: lijiale
 * Date: 13-5-10
 * Time: 上午8:03
 * To change this template use File | Settings | File Templates.
 */

(function ($) {

    var def = {
        method: 'get',
        dataType: 'json'
    }
    $.importCSS('/load/css/load.css');
    $.fn.loading = function (url, data,opt, callback) {
        var $t = this;
        if (typeof  data == 'function') {
            callback = data;
        }else if(typeof  opt == 'function') {
            callback = opt;
        }
        $t.each(function () {
            var self = this, $self = $(this);
            var pos = $self.getPosAndSize();
            var div = document.createElement('div');
            var img = document.createElement('div');
            $(div).css({width: pos.width, height: pos.height}).addClass('load_div');
            $(img).addClass('img').html('&nbsp;').appendTo(div);
            $self.addCover({
                position: 'center',
                content: div,
                of:opt && opt.of ? opt.of : null,
                as:opt && opt.as ? opt.as: null
            }).showCover();
        });
        opt.hide && $t.hide();
        var param = {
            url: url,
            success: function (res) {
                callback && callback(res);
                $t.each(function () {
                    $(this).hideCover();
                });
            }
        };
        if(typeof data == 'object' || typeof data == 'string') {
            param.data = data;
        }
        if(typeof  opt == 'object') {
            opt = $.simpleMerge(def,opt);
            param.method = opt.method;
            param.dataType = opt.dataType;
        }
        $.ajax(param);

    };

})(jQuery);