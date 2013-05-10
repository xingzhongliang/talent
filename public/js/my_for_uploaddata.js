var baseUrl = "http://127.0.0.1";

$(window).load(function () {
    var jcrop_api;
});

function initCrop() {
    jcrop_api = $.Jcrop('#viewimg_avatar', {
        aspectRatio: 1,
        onSelect: updateCoords
    });
}
function destroyCrop() {
    jcrop_api.destroy();
}
function updateCoords(c) {
    $('#x').val(c.x);
    $('#y').val(c.y);
    $('#w').val(c.w);
    $('#h').val(c.h);
};
function checkCoords() {
    var x = $("#x").val();
    var y = $("#y").val();
    var h = $("#h").val();
    var w = $("#w").val();
    var imgname = $("#imgname_avatar").val();
    $.ajax({
        url: baseUrl + '/uploaddata?ac=cutavatarimg',
        type: "POST",
        data: 'imgname=' + imgname + '&x=' + x + '&y=' + y + '&w=' + w + '&h=' + h,
        dataType: 'json',
        success: function (data) {
            if (data.suc == 'Y') {
                $("#btncutavatar").attr('disabled', true);
                alert('您的头像上传成功！');
                $("#viewimg_avatar").attr("src", data.rtn);
                destroyCrop();
            } else {
                alert(data.rtn);
                return false;
            }
        },
        error: function () {
            alert('您的网速不给力，请重试！');
            return false;
        }
    });
};

(function () {
    $("#btnupload_avatar").bind('click', function () {
        if (!$("#up_avatar").val()) {
            alert("请选择要上传的图片");
            return false;
        }
        $.ajaxFileUpload(
            {
                url: baseUrl + '/uploaddata?ac=upavatarimg',
                secureuri: false,
                fileElementId: 'up_avatar',
                dataType: 'json',
                success: function (data, status) {
                    if (data.suc == 'Y') {
                        $("#btnupload_avatar").attr('disabled', true);
                        $("#viewimg_avatar").attr('src', data.rtn).show();
                        $("#cutavatar").show();
                        $("#imgname_avatar").val(data.imgname);
                        $("#avatar").val(data.rtn);
                    } else if (data.suc == 'N') {
                        alert(data.rtn);
                    }
                },
                error: function () {
                    alert("网速不给力，请稍后重试");
                }
            }
        );
    });
})();

(function () {
    $("#btnupload_talentimg").bind('click', function () {
        if (!$("#up_talentimg").val()) {
            alert("请选择要上传的图片");
            return false;
        }
        $.ajaxFileUpload(
            {
                url: baseUrl + '/uploaddata?ac=uptalentimg',
                secureuri: false,
                fileElementId: 'up_talentimg',
                dataType: 'json',
                success: function (data, status) {
                    if (data.suc == 'Y') {
                        $("#btnupload_talentimg").attr('disabled', true);
                        $("#up_talentimg").val('');
                        $("#viewimg_talent").append('<img src="' + data.rtn + '"/>');
                        $("#witOfImg").val(data.rtn);
                    } else if (data.suc == 'N') {
                        alert(data.rtn);
                    }
                },
                error: function () {
                    alert("网速不给力，请稍后重试");
                }
            }
        );
    });
})();

(function () {
    $("#btnupload_music").bind('click', function () {
        if (!$("#up_music").val()) {
            alert("请选择要上传的音频");
            return false;
        }
        $.ajaxFileUpload(
            {
                url: baseUrl + '/uploaddata?ac=upmusic',
                secureuri: false,
                fileElementId: 'up_music',
                dataType: 'json',
                success: function (data, status) {
                    if (data.suc == 'Y') {
                        $("#btnupload_music").val("继续上传");
                        $("#up_music").val('');
                        $("#witOfAudio").val(data.rtn);
                        $("#view_music").append('<embed src="/js/CuMp3PlayerV1.swf?musicfile=' + data.rtn + '&musictitle=" width="446" height="68" quality="high" swLiveConnect=true name="CuPlayer" align="middle" allowScriptAccess="sameDomain" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" allowfullscreen="true"/></embed>');
                    } else if (data.suc == 'N') {
                        alert(data.rtn);
                    }
                },
                error: function () {
                    alert("网速不给力，请稍后重试");
                }
            }
        );
    });
})();

(function () {
    $("#btnupload_vedio").bind('click', function () {
        if (!$("#up_vedio").val()) {
            alert("请选择要上传的视频");
            return false;
        }
        $.ajaxFileUpload(
            {
                url: baseUrl + '/uploaddata?ac=upvedio',
                secureuri: false,
                fileElementId: 'up_vedio',
                dataType: 'json',
                success: function (data, status) {
                    if (data.suc == 'Y') {
                        $("#btnupload_vedio").val("继续上传");
                        $("#up_vedio").val('');
                        $("#witOfVideo").val(data.rtn);
                        $("#view_vedio").append('<embed src="/js/ckplayer/ckplayer.swf" flashvars="' + data.rtn + '" quality="high" width="480" height="400" align="middle" allowScriptAccess="always" allowFullscreen="true" type="application/x-shockwave-flash"></embed>');
                    } else if (data.suc == 'N') {
                        alert(data.rtn);
                    }
                },
                error: function () {
                    alert("网速不给力，请稍后重试");
                }
            }
        );
    });
})();

(function () {
    $("#btnupload_all").bind('click', function () {
        var messageArr = [
            {"name": "username", "message": "请输入您的姓名"},
            {"name": "scope", "message": "请选择您所在区"},
            {"name": "department", "message": "请填写您所在部门"},
            {"name": "avatar", "message": "请上传头像"},
            {"name": "introduce", "message": "请给自己签个名吧"}
        ]
        $.each(messageArr, function (key, val) {
            if (!$("#" + val.name).val()) {
                alert(val.message);
                return false;
            }
        });
        $.ajax(
            {
                type: "POST",
                url: baseUrl + '/uploaddata?ac=upall',
                dataType: 'json',
                data: 'name=' + $("#username").val() +
                    '&scope=' + $("#scope").val() +
                    '&department=' + $("#department").val() +
                    '&avatar=' + $("#avatar").val() +
                    '&introduce=' + $("#introduce").val() +
                    '&witOfText=' + $("#witOfText").val() +
                    '&witOfImg=' + $("#witOfImg").val() +
                    '&witOfAudio=' + $("#witOfAudio").val() +
                    '&witOfVideo=' + $("#witOfVideo").val(),
                success: function (data, status) {
                    if (data.suc == 'Y') {
                        alert("资料上传成功！");
                    } else if (data.suc == 'N') {
                        alert(data.rtn);
                    }
                },
                error: function () {
                    alert("网速不给力，请稍后重试");
                }
            }
        );
    });
})();
