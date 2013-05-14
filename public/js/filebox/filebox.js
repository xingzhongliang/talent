/**
 * 文件上传组件
 * Created with IntelliJ IDEA.
 * User: Jale
 * Date: 13-5-12
 * Time: 上午10:48
 * To change this template use File | Settings | File Templates.
 */

(function ($) {
    $.importJS('swfupload/swfupload.js');
    $.importCSS('filebox/css/upload.css');

    var def = {
        type: 'img'
      ,set_result_handler:null
    }

    var fileType = {
        'img': '*.jpg;*.gif;*.png;*.jpeg;*.bmp'
        ,'video': '*.mp4'
        ,'music': '*.mp3'
    }

    var sw_def = {
        upload_url : "/svf",
        file_post_name : 'fn',
        flash_url : "/js/swfupload/swfupload.swf",
        flash9_url : "/js/swfupload/swfupload_fp9.swf",
        button_text_style : ".redText { color: #FF0000; }",
        button_text_left_padding : 0,
        button_text_top_padding : 0,
        button_action : SWFUpload.BUTTON_ACTION.SELECT_FILES,
        button_disabled : false,
        button_cursor : SWFUpload.CURSOR.HAND,
        button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,
        file_dialog_complete_handler : function(){this.startUpload()}

    }


    $.fn.filebox = function (opt) {
        return this.each(function () {
            var self = this;
            opt = $.simpleMerge(def, opt);
            var so = $.simpleMerge({}, sw_def);
            var c = document.createElement('div');
            var div = document.createElement('div');
            var liv = document.createElement('div');
            var img = document.createElement('div');
            var btn = document.createElement('div');
            var btn2 = document.createElement('div');
            $(c).addClass('filebox_container').css({width:opt.width,height:opt.height});
            $(div).css({width:opt.width,height:opt.height}).addClass('filebox_div_' + (opt.bgType ? opt. bgType : opt.type));
            $(btn).css({width:opt.width,height:opt.height}).appendTo(div);
            $(img).css({width:opt.width,height:opt.height}).addClass('filebox_img').append('<div class="wrapper"></div>');
            $(liv).addClass('filebox_liv').append('<div class="bgd"></div>').find('div').css({width:opt.width,height:opt.height,lineHeight:opt.height + 'px'});
            $(btn2).addClass('cancel_btn').html('<a href="javascript:;">x</a>');
            $(btn2).find('a').click(function(){
                $(img).hide();
                $(liv).hide();
            })
            so.file_types = fileType[opt.type];   //set file types
            so.button_width = opt.width;
            so.button_height = opt.height;
            so.button_placeholder = btn;
            so.upload_start_handler = function() {
                $(liv).show();
                $(img).hide();
            }
            so.upload_success_handler = function(f,data,res) {
                if(res) {
                    eval('data =' + data);
                    if(opt.set_result_handler) {
                        opt.set_result_handler(f,data,res);
                    }else if(opt.type == 'img' || opt.type == 'video'){
                        $(img).show().find('img').attr('src',data.path).css({maxHeight:opt.height,maxWidth:opt.width});
                    }
                }
                opt.callback && opt.callback(f,data,res);
                $(liv).hide();
            }
            so.upload_progress_handler  = function(file,c,total) {
                var rate = c/total * 100;
                $(liv).show().find('div').html(rate.toFixed(1) + '%');
            }
            $(img).find('div').css({width:opt.width,height:opt.height}).append(btn2).append('<img src="" class="img">');
            $(c).append(div).append(liv).append(img);
            $(self).hide().data('imgBox',c).before(c);
            new SWFUpload(so);

        });
    };

})(jQuery);
