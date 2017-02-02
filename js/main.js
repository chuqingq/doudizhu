/**
 * @author theowang
 */

/**
 * UI类
 * 需要jQuery支持
 * 主要是跟view层相关界面操作
 */
var UI = {};
/**
 * 显示主体界面
 * 【注意】！！！！真实对战环境，user信息不是全部都存在本地的，否则会被作弊看牌哦
 * @param {Object} userArray 用户数组 [{name:'user0',pokers:[],isDizhu:true},{},{}]
 * @param {Object} dipaiArray 底牌数组
 * @param {Object} curIndex 当前用户索引
 */
UI.display = function(userArray,dipaiArray,curIndex){
	console.log('UI.display: ', userArray, dipaiArray, curIndex);
	if(userArray[curIndex] && userArray[curIndex].pokers){
		this.showMePoker(userArray[curIndex].pokers);	
	}else{
		throw new Error('UI.display:userArray 为空，或者没有pokers');
	}
	
	this.addDiPai(dipaiArray);
}

/**
 * 获取poker的DOM
 * @param {Object} card
 * <div class="poker spoker">
        <div class="p-content meihua poker4">
            <p class='paimian'></p>
            <p class="huase"></p>
        </div>
    </div>
 */
UI.getPokerDOM = function(card,isSmall){
	// console.log('UI.getPokerDOM: ', card, isSmall);
	isSmall  = isSmall || false;
	var value = AI.getPai(card),
	   $node,
	   type = AI.getHuaStr(card);
	isSmall = isSmall?'poker spoker':'poker';
	$node = $('<div class="'+isSmall+'" poker="'+card+'"></div>');
	$node.html('<div class="p-content '+type+' poker'+value+'" ><p class="paimian"></p><p class="huase"></p></div>');
	return $node;
}

/**
 * 获取地主的dom
 * @param {Object} userIndex
 * @param {Object} num
 */
UI.getDizhuDOM = function(name,userIndex,num){
	console.log('UI.getDizhuDOM: ', name, userIndex, num);
	return this.getUserDOM(!0,name,userIndex,'male',num);
}

UI.clsObj = {
    '不出':'pass',
	'提示':'tips',
	'开始':'start',
	'出牌':'play',
	'重选':'reselect',
	'不叫':'gamble0',
	'3分':'gamble3',
	'2分':'gamble2',
	'1分':'gamble1'
}

/**
 * 获取bubble
 * <div class="bubble">
                                <div class="text pass"></div>
                            </div>
 */
UI.getBubleDOM = function(text){
	console.log('UI.getBubleDOM: ', text);
	var cls = this.clsObj[text];
	return $('<div class="bubble" title="'+text+'"><div class="text '+cls+'"><span></span><span></span></div></div>');
}

/**
 * 显示用户
 * @param  {[type]} users [description]
 * @return {[type]}       [description]
 */
UI.showUsers = function(users,curUserIndex){
	console.log('UI.showUsers: ', users, curUserIndex);
	users[curUserIndex].nodeID = '#myProfile';
	UI.doShowUsers(users[curUserIndex],curUserIndex,'#myProfile');
	//users.splice(curUserIndex,1);
	var arr = [
		[1,2],
		[2,0],
		[0,1]
	];
	var ids = ['#rightUser','#leftUser'],
		userId;
	arr = arr[curUserIndex];

	for(var i = 0;i<3;i++){
		userId = arr[i]
		if(users[userId]){
			users[userId].nodeID = ids[i];
			UI.doShowUsers(users[userId],userId,ids[i]);
		}
		
	}
}

UI.doShowUsers = function(a,i,id){
	console.log('UI.doShowUsers: ', a, i, id);
	var len = a.pokerNum,
		name = a.name,
		sex = a.sex,
		isDizhu = a.isDizhu,
		$node;
	$node = UI.getUserDOM(isDizhu,name,i,sex,len);
	
	$node.appendTo(id);

}
/**
 * 获取buttonDOM节点
 * @param  {[type]} cls [description]
 * @return {[type]}     [description]
 */
UI.getButtonDOM = function(text){
	console.log('UI.getButtonDOM: ', text);
	var cls = this.clsObj[text];
	return $('<div class="button" title="'+text+'"><div class="text '+cls+'"><span></span><span></span></div></div>');
	
}

/**
 * 获取用户头像信息
 * <div class="user">
        <div class="img">
            <div class="dizhu"></div>
        </div>
        <div class="pokerNum">
            <div class="goldNum3"></div>
            <div class="goldNum2"></div>
        </div>
    </div>
    
    <div class="user hightlight">
                        <div class="img">
                            <div class="female"></div>
                        </div>
                        <div class="pokerNum">
                            <div class="goldNum3"></div>
                            <div class="goldNum2"></div>
                        </div>
                    </div>
 * @param {Object} isDizhu
 * @param {String} name 用户名字
 * @param {Object} userIndex
 * @param {Object} sex
 */
UI.getUserDOM = function(isDizhu,name,userIndex,sex,num){
	console.log('UI.getUserDOM: ', isDizhu,name,userIndex,sex,num);
	if(isDizhu){
		num = num || 20;
		sex = 'dizhu';
	}else{
		num = num || 17;
		sex = sex || 'male';
	}
	
	var id = 'userID'+userIndex;
	var $node = $('<div id="'+id+'" class="user"></div>');
	var numStr = this.getNumStr(num);
	$node.html('<div class="clock"><p>10</p></div><p class="name">'+name+'</p><div class="img"><div class="'+sex+'"></div></div><div class="pokerNum">'+numStr+'</div>');
	return $node;
}

/**
 * 获取数字字符串
 * @param {Object} num
 */
UI.getNumStr = function(num){
	// console.log('UI.getNumStr: ', num);
	num = '00'+num;
	num = num.slice(-2);
	num = num.split('');
	return '<div class="goldNum'+num[0]+'"></div><div class="goldNum'+num[1]+'"></div>';
}

UI.addButtons = function(buttons){
	console.log('UI.addButtons: ', buttons);
	if(Tool.isString(buttons)){
		buttons = [buttons];
	}
	var $node;
	buttons.forEach(function(text){
		$node = UI.getButtonDOM(text);
		$node.appendTo('#myButtons');
	});
}

/**
 * 获取扣牌的DOM
 */
UI.getCoverDOM = function(){
	console.log('UI.getCoverDOM: ');
	return $('<div class="cover"></div>');
}

/**
 * 地主胜利啦
 */
UI.win = function(){
	console.log('UI.win: ');
	alert('地主 win！！！');
}

/**
 * 地主失败啦
 */
UI.lose = function(){
	console.log('UI.lose: ');
	alert('地主 lose！！！');
}

/**
 * 添加底牌
 */
UI.addDiPai = function(arrDipai){
	console.log('UI.addDiPai: ', arrDipai);
	if(Tool.isArray(arrDipai)){
		var self = this;
		arrDipai.forEach(function(a){
			self.getPokerDOM(a,!0).appendTo('#dipai');
		});
		
	}
}

/**
 * 添加覆盖的底牌
 */
UI.addCoverDiPai = function(){
	console.log('UI.addCoverDiPai: ');
}

/**
 * 更新界面
 * @param {Object} cards 当前用户数组
 * @param {Object} arrUserPokerNum 其他用户poker数量
 */
UI.update = function(cards,arrUserPokerNum){
	console.log('UI.update: ',cards,arrUserPokerNum);
}

/**
 * 更新分数
 * @param {Object} score
 * @param {Object} userIndex
 */
UI.updatePokerNum = function(num,userIndex){
	// console.log('UI.updatePokerNum: ',num,userIndex);
	var numStr = this.getNumStr(num);
	$('#userID'+userIndex+' .pokerNum').html(numStr);
}

/**
 * 更新当前用户的牌
 * @param {Object} cards
 */
UI.updateMe = function(cards){
	console.log('UI.updateMe: ',cards);
}

/**
 * 大出牌显示
 * @param {Object} cards
 */
UI.showMePoker = function(cards){
	console.log('UI.showMePoker: ',cards);
	var arr = AI.sort(cards),
		len,every,
		$node,
		self = this;
// arr = arr.concat([105,106,107]);
	len = arr.length;

	every = Math.ceil(740/len);
	$('#myPokers').empty();

	arr.forEach(function(a,i){
		$node = self.getPokerDOM(a);
		//此处有没有优化？？？
		$node.css({zIndex:(100-i),right:every*(i+1)}).appendTo('#myPokers');
	});
}

UI.do出牌 = function(cards){
	// console.log('UI.do出牌: ',curUser.index, cards);
	var id = curUser.nodeID + 'Content';
	var len;
	$('.pokerContainer').empty();
	if(Tool.isArray(cards) && (len = cards.length)){
		if(id.indexOf('#')!==0){
			id = '#'+id;
		}
		var self = this,
			temp = 0,
			obj,
			rOrL = 'left',
			every = 25;
		if(id==='#myProfileContent'){
			temp = 350 - ((len-1)*every+84)/2;
			temp = temp<0?0:temp;
			// console.log(temp);
		}else if(id==='#rightUserContent'){
			rOrL = 'right';
		}

		// $(id).empty();
		cards.forEach(function(a,i){
			len++;
			obj = {zIndex:100+len};
			obj[rOrL] = i*every+temp
			self.getPokerDOM(a).css(obj).appendTo(id);
		});
	}

	curPoker = cards; // 记录这次出的牌
	curPokerUserIndex = curUser.index;

	// 更新自己的牌和数量、确定是否显示菜单
	var cardStr = cards.join(',');
	curUser.pokers = curUser.pokers.filter(function(a){
		return cardStr.indexOf(a)===-1;
	});
	this.updatePokerNum(curUser.pokers.length,curUser.index);
	if (curUser.index === 1) {
		this.showMePoker(curUser.pokers);
	}
	// this.setNextUser();
	if (curUser.index === 1) {
		this.buttonHide();
	} else if (curUser.index === 0) {
		this.buttonShow();
	}
}

/**
 * 选择牌面
 * 牌面提高
 * @param {Object} card
 */
UI.selectPoker = function(cards){
	console.log('UI.selectPoker: ',cards);
	if(!Tool.isArray(cards)){
		cards = [cards];
	}
}

/**
 * 取消选择牌面
 * @param {Object} card
 */
UI.unSelectPoker = function(cards){
	console.log('UI.unSelectPoker: ',cards);
	if(!Tool.isArray(cards)){
		cards = [cards];
	}	
}

/**
 * 显示其他用户的牌
 * @param {Object} userIndex
 * @param {Object} cards
 */
UI.showOtherPoker = function(userIndex,cards){
	console.log('UI.showOtherPoker: ',userIndex,cards);
	cards = AI.sort(cards);
	console.log(arguments);
}

/**
 * 显示提示
 * @param  {[type]} tips [description]
 * @return {[type]}      [description]
 */
UI.showTips = function(tips){
	console.log('UI.showTips: ', tips);
	var $t = $('#tips').html(tips).css({visibility:'visible'});
	setTimeout(function(){
		$t.css({visibility:'hidden'});
		$t = null;
	},5E3);
}

/**
 * 设置当前用户
 * @param {Object} userIndex
 */
UI.setCurUser = function(userIndex){
	console.log('UI.setCurUser: ', userIndex);
	// if(!userIndex){
	// 	throw new Error('UI.setCurUser:参数错误，没有用户索引');
	// 	return false;
	// }
	// console.log('#userID='+userIndex);
	$('.hightlight').removeClass('hightlight');
	UI.clearTimer();

	// 如果需要ai处理，则设置超时时间是3秒
	var timeout = (curUser.index === I.index) ? 3: 3; // TODO 用户超时是30秒，电脑是3秒。
	// console.log('timeout: ', timeout);

    var $node = $('#userID'+userIndex).addClass('hightlight').find('.clock').show().find('p').html(timeout);
    timer = setInterval(function(){
    	// console.log('setInterval(): ');
    	var time = $node.html();
    	// console.log('setInterval(): ', time);
    	time--;
    	if(time===0){
    		console.log('timeout，需要机器人出牌');
    		UI.clearTimer();
    		
    		/*var res = */UI.电脑出牌(userIndex);
    		// if (!res) {
    		// 	return;
    		// }
    		// UI.setNextUser();

    		return;
    	}
    	$node.html(time);
    },1e3);
    console.log('timer: ', timer);
}

UI.clearTimer = function(){
	console.log('UI.clearTimer: ', timer);
	$('.clock').hide();
	timer && clearInterval(timer);
}

/**
 * 显示出牌时间
 * @param {Object} userIndex
 */
UI.showClock = function(userIndex){
	console.log('UI.showClock: ');
}

/**
 * 事件绑定
 * @return {[type]} [description]
 */
UI.bindEvent = function(){
	console.log('UI.bindEvent: ');
	$('#myPokers').delegate('.poker','click',this.evtSelect);
	$('#myButtons').delegate('.button','click',this.evtButton);
}

/**
 * 按钮事件
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
UI.evtButton = function(e){
	console.log('UI.evtButton: ', e);
	var $t = $(this),
		text = this.title;
	if($t.hasClass('disabled')){
		return;
	}
	UI[text]&&UI[text]();
}

/**
 * 按钮事件处理
 * @return {[type]} [description]
 */
UI.不出 = function(){
	console.log('UI.不出: ');
	this.setNextUser();
	this.buttonHide();
}

/**
 * button隐藏
 * 
 * @return {[type]} [description]
 */
UI.buttonHide = function(){
	// console.log('UI.buttonHide: ');
	$('#myButtons .button').addClass('disabled');
}
UI.buttonShow = function(){
	// console.log('UI.buttonShow: ');
	$('#myButtons .button').removeClass('disabled');
}

UI.提示 = function(){
	var cards = AI.auto(I.pokers,curPoker);
	console.log('UI.提示: ', I.pokers,curPoker,cards);
	//console.log(curUser.pokers,cards);
	this.重选();
	if(!cards){
		this.showTips('没有大过桌面上牌的牌');
		return;
	}
	
	cards.forEach(function(a){
		var selector = '.poker[poker="'+a+'"]';
		$(selector).css({bottom:20}).attr('selected',true);
	});
	this.selectPoker(cards);
}

UI.重选 = function(){
	console.log('UI.重选: ');
	$('#myPokers > .poker[selected="true"]').css({bottom:0}).removeAttr('selected');
}

// 用户出牌
UI.出牌 = function(){
	console.log('UI.出牌: ');
	var cards = this.getSelectedPoker();
	if(cards.length===0){
		this.showTips('请选择要出的牌');
		return;
	}
	if(!AI.isRight(cards,curPoker)){
		this.showTips('不符合出牌规则');
		return;
	}

	curPoker = cards; // chuqq
	curPokerUserIndex = curUser.index;
	//过滤出来已经出的牌，然后重新绘制用户牌面
	var cardStr = cards.join(',');
	I.pokers = I.pokers.filter(function(a){
		return cardStr.indexOf(a)===-1;
	});
	//更新牌数
	this.updatePokerNum(I.pokers.length,I.index);
	//出牌
	this.do出牌(cards,'#myProfileContent');
	//this.updateMe
	this.showMePoker(I.pokers);
	this.setNextUser();
	this.buttonHide();
}

// 电脑出牌
UI.电脑出牌 = function(cIndex){
	// console.log('UI.电脑出牌: ', cIndex);
	var cards; // 要出的牌
	// 如果上次是自己出的，这次随意发牌
	if (curPokerUserIndex === curUser.index) {
		cards = AI.get发牌(curUser.pokers);
	}
	// 如果不是自己出的，则需要AI计算
	else {
		cards = AI.auto(curUser.pokers, curPoker);
		console.log('AI.auto(): ', curUser.index, curUser.pokers, curPoker, cards);
	}
	// 如果出牌，才需要更新牌、剩余数量、curPoker
	if (cards) {
		UI.do出牌(cards,curUser.nodeID+'Content');
		var cardStr = cards.join(',');
		curUser.pokers = curUser.pokers.filter(function(a){
			return cardStr.indexOf(a)===-1;// TODO 返回值？
		});
		this.updatePokerNum(curUser.pokers.length,curUser.index);
		if (curUser.pokers.length === 0) {
			if (curUser.index === 0) {
				UI.win();
			} else {
				UI.lose();
			}
    		// UI.clearTimer();
    		return;
		}
	}
	
	// this.showMePoker(I.pokers);
	// this.setNextUser();
	if (cIndex === 1) {
		this.buttonHide();
	} else if (cIndex === 0) {
		this.buttonShow();
	}

	this.setNextUser();
}

/**
 * 从dom中获取选择的poker
 * @return {[type]} [description]
 */
UI.getSelectedPoker = function(){
	console.log('UI.getSelectedPoker: ');
	var back = [],$nodes = $('#myPokers > .poker[selected="true"]');
	$nodes.each(function(i,a){
		back.push(parseInt($nodes.eq(i).attr('poker'),10));
	});
	return back;
}

/**
 * 用户点击牌面选中事件
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
UI.evtSelect = function(e){
	console.log('UI.evtSelect: ', e);
	var $t = $(this),
		card = parseInt($t.attr('poker'),10),
		attr = $t.attr('selected');
	if(attr){
		//不选择
		$t.css({bottom:0}).removeAttr('selected');
		UI.unSelectPoker(card);
	}else{
		//选择
		$t.css({bottom:20}).attr('selected',true);
		UI.selectPoker(card);
	}
}

/**
 * 设置下一位出牌者
 */
UI.setNextUser = function(){
	// console.log('UI.setNextUser: ', curUser.index);
	var cIndex = curUser.index;
	cIndex = ++cIndex>2?0:cIndex;
	curUser = users[cIndex];
	// 如果下面该用户出牌，则enable button
	if (cIndex === 1) {
		this.buttonShow();
	}
	this.setCurUser(cIndex);
}

/**
 * 音效部分
 */
var Music = function(){
	console.log('Music: ');
}
Music.prototype.musics = {};

;(function(window){
	console.log('start: ');
	var pokers = new Poker,
		timeOut = 30E3,//出牌时间
		// curUser,//当前出牌用户
		dizhuName,//地主名称
		dizhuIndex,//地主索引
		users = [{name:'user0',index:0},{name:'user1',index:1},{name:'user2',index:2}],//用户数组
		dipai = [],//底牌数组
		userLength = 3,//用户多少
		radomPoker =pokers.getRandomPokers();
	   
	dipai = radomPoker.splice(0,3);
	var tLen = userLength;
	while(tLen--){
		users[tLen].pokers = radomPoker.splice(0,17);
		users[tLen].sex = 'male';
		users[tLen].pokerNum = 17;
	}
	window.curUser = users[0];
	users[0].isDizhu = !0;

	
	UI.showUsers(users,1);
	UI.display(users,dipai,1);
	UI.bindEvent();
	UI.addButtons(['不出','重选','提示','出牌']);
	var fapai = AI.get发牌(curUser.pokers);
	console.log('start 2 :', users,dipai,fapai);

	UI.do出牌(fapai/*,curUser.nodeID+'Content'*/);

	window.users = users;
	window.curPoker = fapai;
	curPokerUserIndex = curUser.index;
	// window.curUser = curUser;
	window.timer = null;
	window.I = users[1];//当前用户的数组
	//window.myPokers = user[1].pokers;//当前用户的牌
	UI.setNextUser();
}(window));
