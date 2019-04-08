window.gameFunctions = window.gameFunctions || {};
window.gameFunctions.gameOverride = function(){
	this.override = true;
	
	// ZOOM
	
	var baseCameraTargetZoom = this[obfuscate.camera][obfuscate.targetZoom];
	this[obfuscate.camera].__defineSetter__(obfuscate.targetZoom, function(val){
		baseCameraTargetZoom = val;
	});
	this[obfuscate.camera].__defineGetter__(obfuscate.targetZoom, function(){
		if(window.gameVars && window.menu && window.menu.UserSetting.look.zoomEnabled)
			return window.gameVars.ZoomLevel;
		
		return baseCameraTargetZoom;
	});
	
	var baseZoomFast = this[obfuscate.activePlayer].zoomFast;
	this[obfuscate.activePlayer].__defineSetter__("zoomFast", function(val){
		baseZoomFast = val;
	});
	this[obfuscate.activePlayer].__defineGetter__("zoomFast", function(){
		if(window.menu && window.menu.UserSetting.look.zoomEnabled)
			return true;
		
		return baseZoomFast;
	});
	// this[obfuscate.activePlayer][obfuscate.localData].inventory.soda = 1;
	// console.log(this[obfuscate.activePlayer][obfuscate.localData].inventory);
	// INPUT
	
	var inpt = this[obfuscate.input];
	window.deadPlayers = new Set();
	// this[obfuscate.input].mouseButton = !1;
	// this[obfuscate.input].mouseButtonOld = !1;
	// this[obfuscate.input].rightMouseButton = !1;
	// this[obfuscate.input].rightMouseButtonOld = !1;
	// console.log(inpt);
	
	var processInput = function(bind, down){
		
		if(window.gameVars.Input.GlobalHookCallback) {
			if(bind.code == 27)  {
				window.gameVars.Input.GlobalHookCallback.call(this, {code: 0, shift: false, ctrl: false, alt: false});
			} else if(((bind.code == 16) || (bind.code == 17) || (bind.code == 18)) &&
				(window.gameVars.Input.Keyboard.AnythingElsePressed == 0)) {
				if(down)
					return
				if(bind.code == 16) bind.shift = false;
				if(bind.code == 17) bind.ctrl = false;
				if(bind.code == 18) bind.alt = false;
				window.gameVars.Input.GlobalHookCallback.call(this, bind);
			} else if(down){
				window.gameVars.Input.GlobalHookCallback.call(this, bind);
			}
			
			return;
		}
		
		// always pass Esc
		if(bind.code == 27) return keyboardEvent(27, down);
		
		var opt = window.menu.UserSetting.binds;
		
		if(checkBind(opt.autoAim, bind)) {
			window.gameVars.Input.Cheat.AutoAimPressed = down;
		}else if(checkBind(opt.switchMainWeapon, bind)) {
			window.gameVars.Input.Cheat.SwitchWeaponFirst = down;
		}else if(checkBind(opt.zoomIn, bind)) {
			window.gameVars.Input.Cheat.ZoomDelta += 1;
		}else if(checkBind(opt.zoomOut, bind)) {
			window.gameVars.Input.Cheat.ZoomDelta -= 1;
		}else if(checkBind(opt.displayNames, bind)) {
			window.gameVars.Input.Cheat.ShowNamesPressed = down;
		// }else if(checkBind(opt.streamerMode, bind)) {
			
		}else if(checkBind(opt.goUp, bind)) {
			keyboardEvent(87, down);
		}else if(checkBind(opt.goLeft, bind)) {
			keyboardEvent(65, down);
		}else if(checkBind(opt.goDown, bind)) {
			keyboardEvent(83, down);
		}else if(checkBind(opt.goRight, bind)) {
			keyboardEvent(68, down);
		}else if(checkBind(opt.shoot, bind)) {
			mouseButtonEvent(0, down);
		}else if(checkBind(opt.reload, bind)) {
			keyboardEvent(82, down);
		}else if(checkBind(opt.swapWeapSlots, bind)) {
			keyboardEvent(84, down);
		}else if(checkBind(opt.interact, bind)) {
			keyboardEvent(70, down);
		}else if(checkBind(opt.cancelAction, bind)) {
			keyboardEvent(88, down);
		}else if(checkBind(opt.teamPing, bind)) {
			triggerPing(down);
		}else if(checkBind(opt.emotes, bind)) {
			triggerEmote(down);
		}else if(checkBind(opt.toggleMap, bind)) {
			keyboardEvent(77, down);
		}else if(checkBind(opt.toggleMiniMap, bind)) {
			keyboardEvent(86, down);
		}else if(checkBind(opt.equipLast, bind)) {
			keyboardEvent(81, down);
		}else if(checkBind(opt.equipNext, bind)) {
			mouseWheelEvent(1);
		}else if(checkBind(opt.equipPrev, bind)) {
			mouseWheelEvent(-1);
		}else if(checkBind(opt.equipWeapon1, bind)) {
			keyboardEvent(49, down);
		}else if(checkBind(opt.equipWeapon2, bind)) {
			keyboardEvent(50, down);
		}else if(checkBind(opt.equipWeapon3, bind)) {
			keyboardEvent(51, down);
		}else if(checkBind(opt.equipWeapon4, bind)) {
			keyboardEvent(52, down);
		}else if(checkBind(opt.useMedical7, bind)) {
			keyboardEvent(55, down);
		}else if(checkBind(opt.useMedical8, bind)) {
			keyboardEvent(56, down);
		}else if(checkBind(opt.useMedical9, bind)) {
			keyboardEvent(57, down);
		}else if(checkBind(opt.useMedical0, bind)) {
			keyboardEvent(48, down);
		}
	}
	
	var checkBind = function(ref, bind){
		try {
			return ref.code == bind.code &&
			!(ref.shift && !bind.shift) &&
			!(ref.ctrl && !bind.ctrl) &&
			!(ref.alt && !bind.alt);
		} catch (err) {
			return false;
		}
	}

	
	document.addEventListener('mousedown', function(e) {
		// console.log(e.button);	
		if((e.button == 2) || (e.button == 1) || (window.gameVars.Input.GlobalHookCallback && (e.button == 0))){
			processInput({code: e.button * -1 - 1, shift: e.shiftKey, ctrl: e.ctrlKey, alt: e.altKey}, true);
		}
		if(window.gameVars && window.gameVars.Menu)
			e.stopPropagation();
		if(e.button == 0) {
			inpt.mouseButton = true;
		}
		if(e.button == 1) {
			e.preventDefault();
			e.stopPropagation();
		}
	});

	document.addEventListener('mouseup', function(e) {
		if (e.button == 0) {
			inpt.mouseButton = false;
		} else if (e.button == 2 || e.button == 1) {
			processInput({code: e.button * -1 - 1, shift: e.shiftKey, ctrl: e.ctrlKey, alt: e.altKey}, false);
		}
	});

	
	var keyboardEvent = function(code, down){
		// console.log(down);
		down ? onKeyDownBase.call(inpt, {keyCode: code}) : onKeyUpBase.call(inpt, {keyCode: code});
	}
	
	var mouseButtonEvent = function(buttonCode, down){
		down ? onMouseDownBase.call(inpt, {button: buttonCode}) : onMouseUpBase.call(inpt, {button: buttonCode});
		if(buttonCode == 0) {
			window.gameVars.Input.Cheat.FirePressed = down;
		}
	}
	
	var mouseWheelEvent = function(delta){
		onMouseWheelBase.call(inpt, {deltaY: delta});
	}
	
	var triggerEmote = function(down) {
		if(window.Pings && window.Pings.EmoteTrigger)
			window.Pings.EmoteTrigger(down)
	}
	
	var triggerPing = function(down) {
		if(window.Pings && window.Pings.PingTrigger)
			window.Pings.PingTrigger(down)
	}
	
	// keyboard
	
	var onKeyDownBase = function (e) {
        this.keys[e.keyCode] = !0,
        this.shiftKey |= e.shiftKey
    }
	// console.log(onKeyDownBase);
	this[obfuscate.input].onKeyDown = function(e){
		// console.log("Key down!");
		processInput({code: e.keyCode, shift: e.shiftKey, ctrl: e.ctrlKey, alt: e.altKey}, true);
		if(e.keyCode == 16) return window.gameVars.Input.Keyboard.ShiftPressed = true;
		if(e.keyCode == 17) return window.gameVars.Input.Keyboard.CtrlPressed = true;
		if(e.keyCode == 18) return window.gameVars.Input.Keyboard.AltPressed = true;
		window.gameVars.Input.Keyboard.AnythingElsePressed += 1;
	};
	var onKeyUpBase = function (e) {
		delete this.keys[e.keyCode]
	};
	this[obfuscate.input].onKeyUp = function(e){
		processInput({code: e.keyCode, shift: e.shiftKey, ctrl: e.ctrlKey, alt: e.altKey}, false);
		if(e.keyCode == 16) return window.gameVars.Input.Keyboard.ShiftPressed = false;
		if(e.keyCode == 17) return window.gameVars.Input.Keyboard.CtrlPressed = false;
		if(e.keyCode == 18) return window.gameVars.Input.Keyboard.AltPressed = false;
		window.gameVars.Input.Keyboard.AnythingElsePressed -= 1;
		if(window.gameVars.Input.Keyboard.AnythingElsePressed < 0)
			window.gameVars.Input.Keyboard.AnythingElsePressed = 0;
	};
	
	window.addEventListener("focus", function(event) 
	{
		window.gameVars.Input.Keyboard.ShiftPressed = false;
		window.gameVars.Input.Keyboard.CtrlPressed = false;
		window.gameVars.Input.Keyboard.AltPressed = false;
		window.gameVars.Input.Keyboard.AnythingElsePressed = 0;
	}, false);
	
	// mouse
	
	var onMouseMoveBase = this[obfuscate.input].onMouseMove;
	this[obfuscate.input].onMouseMove = function(e){
		if(window.gameVars){
			window.gameVars.Input.Mouse.Pos.x = e.clientX;
			window.gameVars.Input.Mouse.Pos.y = e.clientY;
			
			if(window.gameVars.Input.Mouse.AimActive) {
				// e.clientX = window.gameVars.Input.Mouse.AimPos.x;
				// e.clientY = window.gameVars.Input.Mouse.AimPos.y;
				e = {
					clientX: window.gameVars.Input.Mouse.AimPos.x,
					clientY: window.gameVars.Input.Mouse.AimPos.y
				}
			}
		}
		
		onMouseMoveBase.call(inpt, e);
	};
	var onMouseDownBase = function(e) {
        this.mouseButton = this.mouseButton || 0 === e.button,
        this.rightMouseButton = this.rightMouseButton || 2 === e.button
	};
	// console.log(onMouseDownBase);
	onMouseDownBase = function(e){
		processInput({code: e.button * -1 - 1, shift: e.shiftKey, ctrl: e.ctrlKey, alt: e.altKey}, true);
	};
	var onMouseUpBase = function (e) {
        this.mouseButton = 0 !== e.button && this.mouseButton,
        this.rightMouseButton = 2 !== e.button && this.rightMouseButton
	};
	onMouseUpBase = function(e){
		processInput({code: e.button * -1 - 1, shift: e.shiftKey, ctrl: e.ctrlKey, alt: e.altKey}, false);
	};
	var onMouseWheelBase = this[obfuscate.input].onMouseWheel;
	if (window.menu.UserSetting.look.zoomEnabled) {
		this[obfuscate.input].onMouseWheel = function(e){
			e.stopPropagation();
			if(window.gameVars && window.gameVars.Menu && !(window.gameVars.Input.GlobalHookCallback))
				return;
			processInput({
				code: e.deltaY < 0 ? -4 : -5, 
				shift: window.gameVars.Input.Keyboard.ShiftPressed,
				ctrl: window.gameVars.Input.Keyboard.CtrlPressed,
				alt: window.gameVars.Input.Keyboard.AltPressed
			}, true);
		}
	} else {
		this[obfuscate.input].onMouseWheel = onMouseWheelBase;
	}
	
	var inputKeyPressedBase = this[obfuscate.input][obfuscate.keyPressed];
	// console.log(inputKeyPressedBase);
	this[obfuscate.input][obfuscate.keyPressed] = function(e){
		if(window.gameVars)
		{
			if(window.gameVars.Input.Cheat.RepeatInteraction && e == 70)
				return true;
		}
		
		return inputKeyPressedBase.call(inpt, e);
	};

	var mousePressedFunc = function () {
		return !this.mouseButtonOld && this.mouseButton
	}
	
	var inputMousePressedBase = this[obfuscate.input][obfuscate.mouseDown];
	this[obfuscate.input][obfuscate.mouseDown] = function(){
		if(window.gameVars && window.gameVars.Input.Cheat.RepeatFire)
			return false;
		
		return inputMousePressedBase.call(inpt);
	};
	var zHelper = function (e) {
		return void 0 !== this.keys[e]
	}
	var mouseDownFunc = function (e) {
		return this.keysOld[e] && !this.zHelper(e)
	}
	
	var inputMouseDownBase = this[obfuscate.input][obfuscate.mousePressed];
	this[obfuscate.input][obfuscate.mousePressed] = function(){
		if(window.gameVars && window.gameVars.Input.Cheat.RepeatFire)
			return true;
		
		return inputMouseDownBase.call(inpt);
	};
	
}
