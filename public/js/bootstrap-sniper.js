/**
 *数字选择控件 - 基于bootstrap、jquery
 * lijiale
 * version 0.1
 * 仅支持input:text
 * 用法：$(''xx).sniper();
 */

(function($){
    $.fn.sniper = function() {
        return this.each(function(){
            var self = this;
            $(self).addClass('span1').wrap('<div class="input-prepend input-append"></div>')
                .after('<button class="btn" type="button"><i class="icon-plus"></i></button>')
                .before('<button class="btn" type="button"><i class="icon-minus"></i></button>');
            $(self).prev().click(function(){
                var val = parseInt(self.value);
                if(val != val) {
                    val = 0;
                }
                val--;
                $(self).val(val > 0 ? val : 0);
            });
            $(self).next().click(function(){
                var val = parseInt(self.value);
                if(val != val) {
                    val = 0;
                }
                $(self).val(++val);
            });

        });
    }
})(jQuery);