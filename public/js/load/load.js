/**
 * 带loading图标提示的ajax方法
 * Created with IntelliJ IDEA.
 * User: lijiale
 * Date: 13-5-10
 * Time: 上午8:03
 * To change this template use File | Settings | File Templates.
 */

(function ($) {

    $.importCSS('/load/css/load.css');
    $.fn.loading = function (url, data, callback) {
        var $t = this;
        if (typeof  data == 'function') {
            callback = data;
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
                content: div
            }).showCover();
        });
        var opt = {
            url: url,
            method: 'get',
            dataType: 'json',
            success: function (res) {
                callback && callback(res);
                $t.each(function () {
                    $(this).hideCover();
                });
            }
        };
        if(typeof data == 'object') {
            opt.data = data;
        }
        $.ajax(opt);

    };

})(jQuery);