'use strict';
let images={};
images.背景=new Image();images.背景.src=imgBase.背景;
images.忆雨=new Image();images.忆雨.src=imgBase.忆雨;
images.托盘=new Image();images.托盘.src=imgBase.托盘;
images.正常=new Image();images.正常.src=imgBase.正常;
images.右偏=new Image();images.右偏.src=imgBase.右偏;
images.左偏=new Image();images.左偏.src=imgBase.左偏;
images.灭火器=new Image();images.灭火器.src=imgBase.灭火器;
images.吹灭火器=new Image();images.吹灭火器.src=imgBase.吹灭火器;
const WIDTH=1280;
const HEIGHT=720;
let Game;
Game=function(){
	let thisGame=this;
	let canvas;
	let ctx;
	let type;
	let mouse;
	let lastPaintTime;
	thisGame.init=function(){
		canvas=document.getElementById('canvas');
		canvas.width=window.outerWidth;
		canvas.height=window.outerHeight;
		ctx=canvas.getContext('2d');
		type={
			入场:5,
			位置:0,
			状态:0,
			显示状态:0,
			显示时间:0,
			忆雨:false,
			typeA:false,
			typeD:false,
			win:false,
			出场:0
		}
		window.onmousedown=function(event){
			mouse={x:event.clientX,y:event.clientY};
		}
		window.onmousemove=function(event){
			if(mouse==null)return;
			type.typeA=type.typeD=false;
			if(event.clientX-mouse.x>window.outerWidth/8){
				type.typeD=true;
			}else if(event.clientX-mouse.x<-window.outerWidth/8){
				type.typeA=true;
			}
		}
		window.onmouseup=function(){
			type.typeA=type.typeD=false;
			mouse=null;
		}
		window.addEventListener('touchstart',function(e){window.onmousedown(e.changedTouches[0]);});
		window.addEventListener('touchmove',function(e){window.onmousemove(e.changedTouches[0]);});
		window.addEventListener('touchend',function(e){window.onmouseup(e.changedTouches[0]);});
		lastPaintTime=new Date().getTime();
		return thisGame;
	}
	thisGame.act=function(time){
		if(type.入场>0){
			type.入场-=time/1000;
			if(type.入场<0)type.入场=0;
		}else{
			time=Math.min(100,time);
			if(type.win){
				type.显示状态=2;
				type.出场+=time/3000;
				if(type.出场>1)type.出场=1;
				return;
			}
			if(type.typeA){
				if(type.状态!=-1){
					type.状态=-1;
					type.显示状态=-1;
					type.显示时间=0;
				}
				type.位置-=time/15;
			}else if(type.typeD){
				if(type.状态!=1){
					type.状态=1;
					type.显示状态=1;
					type.显示时间=0;
				}
				type.位置+=time/15;
			}
			type.显示时间+=time;
			if(type.显示时间>400){
				type.显示时间-=400;
				if(type.显示状态==type.状态){
					type.显示状态=0;
				}else{
					type.显示状态=type.状态;
				}
			}
			if(type.位置<-440){
				type.位置=-440;
				type.显示状态=2;
				if(type.忆雨)type.win=true;
				type.显示时间=-600;
			}
			if(type.位置>+380){
				type.位置=+380;
				type.忆雨=true;
			}
		}
	}
	let transCom;
	thisGame.trans=function(){
		transCom={
			width:window.outerWidth,
			height:window.outerHeight
		};
		canvas.width=transCom.width;
		canvas.height=transCom.height;
		if(transCom.width/WIDTH>transCom.height/HEIGHT){
			ctx.translate((transCom.width-transCom.height/HEIGHT*WIDTH)/2,0);
			ctx.scale(transCom.height/HEIGHT,transCom.height/HEIGHT);
		}else{
			ctx.translate(0,(transCom.height-transCom.width/WIDTH*HEIGHT)/2);
			ctx.scale(transCom.width/WIDTH,transCom.width/WIDTH);
		}
	}
	thisGame.untrans=function(){
		if(transCom.width/WIDTH>transCom.height/HEIGHT){
			let len=(transCom.width-transCom.height/HEIGHT*WIDTH)/2;
			ctx.scale(HEIGHT/transCom.height,HEIGHT/transCom.height);
			ctx.translate(-len,0);
			ctx.fillStyle='black';
			ctx.fillRect(0,0,len,transCom.height);
			ctx.fillRect(transCom.width-len,0,len,transCom.height);
		}else{
			let len=(transCom.height-transCom.width/WIDTH*HEIGHT)/2
			ctx.scale(WIDTH/transCom.width,WIDTH/transCom.width);
			ctx.translate(0,-len);
			ctx.fillStyle='black';
			ctx.fillRect(0,0,transCom.width,len);
			ctx.fillRect(0,transCom.height-len,transCom.width,len);
		}
		transCom=null;
	}
	thisGame.paint=function(){
		let thisPaintTime=new Date().getTime();
		let deltaTime=thisPaintTime-lastPaintTime;
		thisGame.act(deltaTime);
		thisGame.trans();
		ctx.drawImage(images.背景,0,0);
		if(type.入场>0){
			ctx.drawImage(images.托盘,0,type.入场*40);
			ctx.drawImage(images.正常,0,type.入场*40);
		}else{
			ctx.drawImage(images.托盘,0,0);
			if(type.显示状态==0){
				ctx.drawImage(images.正常,type.位置,0);
			}else if(type.显示状态==-1){
				ctx.drawImage(images.左偏,type.位置,0);
			}else if(type.显示状态==1){
				ctx.drawImage(images.右偏,type.位置,0);
			}
			if(type.显示状态==2){
				ctx.drawImage(images.吹灭火器,0,0);
			}else{
				ctx.drawImage(images.灭火器,0,0);
			}
			if(type.忆雨){
				ctx.drawImage(images.忆雨,0,0);
			}
			if(type.win){
				ctx.fillStyle='rgb(0,0,0,'+type.出场+')';
				ctx.fillRect(0,0,WIDTH,HEIGHT);
			}
		}
		thisGame.untrans();
		lastPaintTime=thisPaintTime;
	}
}
function anim(game){
	game.paint();
	setTimeout(function(){
		anim(game);
	},20);
}
window.onload=function(){
	anim(new Game().init());
}