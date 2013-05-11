var fs = require('fs');
//var Canvas = require('canvas')
//  , Image = Canvas.Image;
require('./extend_fn.js');
exports.uploaddata = function(req,res){
	//if(req.method.toLowerCase() == 'post'){
	var typeArr = ['image/jpg','image/jpeg','image/png','image/pjpeg','image/bmp','image/x-png'];
	var erpName = 'xiaoxing';//shit

	if(req.query.ac == 'upavatarimg'){
		var rtn = '';
		var suc = '';
		var tmp_path = req.files.up_avatar.path;
		var target_path = './public/uploads/avatar/'+erpName+'.jpg';
		var file_size = req.files.up_avatar.size;
		var file_type = req.files.up_avatar.type;
		if(!typeArr.in_array(file_type)){
			rtn = "not allowed image type";
		}
		if(file_size>1048576){
			rtn = "your picture is too large";
		}
		fs.rename(tmp_path,target_path,function(err){
			//if(err) throw err;
			fs.unlink(tmp_path,function(err){
			}
			);
		}
		);
		if(rtn) suc='N';
		else {
			imgName = erpName+'.jpg';
			rtn = '/uploads/avatar/'+imgName;
			suc = 'Y';
		}
		res.send('{"suc":"'+suc+'","rtn":"'+rtn+'","imgname":"'+imgName+'"}');
	}



//	if(req.query.ac == 'cutavatarimg'){
//		var img = new Image;
//
//		img.onerror = function(err){
//		  throw err;
//		};
//
//		img.onload = function(){
//		  var width = 200;
//		  var height = 200;
//		  var canvas = new Canvas(width, height);
//		  var ctx = canvas.getContext('2d');
//
//		  ctx.imageSmoothingEnabled = true;
//		  ctx.drawImage(img, req.body.x, req.body.y, width, height,0,0,width,height);
//
//		  canvas.toBuffer(function(err, buf){
//		  	fs.writeFile('./public/uploads/avatar/avatar_'+req.body.imgname, buf, function(){
//				//console.log("abc");
//				fs.unlink(img.src,function(err){
//				}
//				);
//				res.send('{"suc":"Y","rtn":"/uploads/avatar/avatar_'+req.body.imgname+'"}');
//		  	});
//
//			if(err) res.send('{"suc":"N"}');
//		  });
//		};
//
//
//		img.src = './public/uploads/avatar/'+req.body.imgname;
//
//	}


	if(req.query.ac == 'uptalentimg'){
		var rtn = '';
		var suc = '';
		var talentName = erpName + Date.parse(new Date())+'.jpg';
		var tmp_path = req.files.up_talentimg.path;
		var target_path = './public/uploads/'+talentName;
		var file_size = req.files.up_talentimg.size;
		var file_type = req.files.up_talentimg.type;
		if(!typeArr.in_array(file_type)){
			rtn = "not allowed image type";
		}
		if(file_size>1048576){
			rtn = "your picture is too large";
		}
		fs.rename(tmp_path,target_path,function(err){
			//if(err) throw err;
			fs.unlink(tmp_path,function(err){
			}
			);
		}
		);
		if(rtn) suc='N';
		else {
			rtn = '/uploads/'+talentName;
			suc = 'Y';
		}
		res.send('{"suc":"'+suc+'","rtn":"'+rtn+'"}');
	}


	if(req.query.ac == 'upmusic'){
		var musicName = erpName + Date.parse(new Date())+'.mp3';
		var rtn = '';
		var suc = '';
		var tmp_path = req.files.up_music.path;
		var target_path = './public/uploads/'+musicName;
		var file_size = req.files.up_music.size;
		var file_type = req.files.up_music.type;
		if(file_type != 'audio/mpeg'){
			rtn = "just mp3 type";
		}
		if(file_size>10485760){//10 M
			rtn = "your mp3 is too large";
		}
		fs.rename(tmp_path,target_path,function(err){
			//if(err) throw err;
			fs.unlink(tmp_path,function(err){
			}
			);
		}
		);
		if(rtn) suc='N';
		else {
			rtn = '/uploads/'+musicName;
			suc = 'Y';
		}
		res.send('{"suc":"'+suc+'","rtn":"'+rtn+'"}');
	}


	if(req.query.ac == 'upvedio'){
		var rtn = '';
		var suc = '';
		var tmp_path = req.files.up_vedio.path;
		var target_path = './public/uploads/'+musicName;
		var file_size = req.files.up_vedio.size;
		var file_type = req.files.up_vedio.type;
		if(file_type == 'video/mp4')
			var postfix = 'mp4';
		var vedioName = erpName + Date.parse(new Date())+postfix;
		if(file_type != "video/mp4"){
			//rtn = "just mp4 type";
			rtn = file_type;
		}
		if(file_size>104857600){//10 M
			rtn = "your mp4 is too large";
		}
		fs.rename(tmp_path,target_path,function(err){
			//if(err) throw err;
			fs.unlink(tmp_path,function(err){
			}
			);
		}
		);
		if(rtn) suc='N';
		else {
			rtn = '/uploads/'+vedioName;
			suc = 'Y';
		}
		res.send('{"suc":"'+suc+'","rtn":"'+rtn+'"}');
	}



	if(req.query.ac == 'upall'){
		var intoDbData = {};
		var Candidate = mongoose.model("Candidate");
		var candi = new Candidate(intoDbData);
		candi.save(function(err,aaa){
			if(err){
				res.send('{"suc":"N","rtn":""}');
			}else{
				res.send('{"suc":"Y","rtn":""}');
			}
		});
	
	}

	if(req.query.ac == 'index'){
		//console.log("aaa");
		res.render("uploaddata");
	}


};
