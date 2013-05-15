<?php
$d = isset($_GET['d']) ? (!preg_match("/^[0-9]+$/",$_GET['d']) ? 0 : intval($_GET['d'])) : 0;
echo ($d == 1) ? 'http://movie.ks.js.cn/flv/2011/11/8-1.flv' : 'http://movie.ks.js.cn/flv/2012/02/6-3.flv' ;
?>