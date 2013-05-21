/**
 * 这是一个专门用来替换bootstrap 的渣渣popover的组件
 * Created with IntelliJ IDEA.
 * User: Jale
 * Date: 13-5-17
 * Time: 上午12:07
 * To change this template use File | Settings | File Templates.
 */

(function($){
    $.importCSS('/popover/css/popover.css');
    var def = {
        style:'z-popover', //z-popover | validate
        position : 'bottom',
        target : ''   // 要弹出的dom，必须是dom对象 ！！
    };

    $.fn.zpop = function(opt) {
        return this.each(function(){
            var $self = $(this);
            opt = $.simpleMerge(def, opt);
            var  w  = document.createElement('div');
            var  a  = document.createElement('div');
            var  c  = document.createElement('div');
            var  h  = document.createElement('h2');
            $(h).addClass(opt.style + '-title').text(opt.title ? opt.title : '');
            $(c).addClass(opt.style + '-content').append(opt.target);
            $(a).addClass('arrow');
            $(w).addClass(opt.style + ' fade in').css({display:'block'}).addClass(opt.position).append(a).append(h).append(c);
            $self.addCover({
                position:opt.position,
                floor:w
            });
        });
    }
})(jQuery);