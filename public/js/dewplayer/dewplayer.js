function dewplayer(mp3){
    document.write('<object type="application/x-shockwave-flash" data="/js/dewplayer/dewplayer.swf" width="200" height="20" name="dewplayer"> <param name="wmode" value="transparent" /><param name="movie" value="/js/dewplayer/dewplayer.swf" /> <param name="flashvars" value="mp3='+mp3+'&amp;showtime=1" /> </object>');
}