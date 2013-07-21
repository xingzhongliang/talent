/**
 * 快速修改表单值插件
 * 依赖validate.js 、bootstrap
 * Created with IntelliJ IDEA.
 * User: Jale
 * Date: 13-5-10
 * Time: 下午6:19
 * To change this template use File | Settings | File Templates.
 */

(function($){

    /**
     * 快速修改页面元素的值
     * @param callback
     * @returns {*}
     */
    var def = {
//        fields : [{name:'',value:'',v:''}],
        position:'center'
    }
    $.fn.fastModify = function(opt) {
        opt = $.simpleMerge(opt,def);
        $.assert.isNotEmpty(opt.fields,'Can not found fields');

        var self = this.get(0);
        var div = document.createElement('div');
        for(var i in opt.fields) {

        }
        return this;
    }

}) (jQuery);
