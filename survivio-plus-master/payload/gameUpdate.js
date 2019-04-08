window.gameFunctions = window.gameFunctions || {};
window.gameFunctions.gameSendMessage = function(messageCode, messageData){
	if(!window.gameVars)
		return;
	if(messageCode == 13)
		window.gameVars.Game.LastTimeDropItem = window.performance.now();
}

window.gameFunctions.gameSrocessGameUpdate = function(mesg){
	
	var red = { r: 255, g: 0, b: 0 };
	var green = { r: 0, g: 180, b: 0 };
	
	function nthroot(x, n) {
		try {
			var negate = n % 2 == 1 && x < 0;
			if(negate)
				x = -x;
			var possible = Math.pow(x, 1 / n);
			n = Math.pow(possible, n);
			if(Math.abs(x - n) < 1 && (x > 0 == n > 0))
				return negate ? -possible : possible;
		} catch(e){}
	}
	
	function getColor(color1, color2, weight) {
		var w1 = weight;
		var w2 = 1 - w1;
		var rgb = {
			r: Math.round(color1.r * w1 + color2.r * w2),
			g: Math.round(color1.g * w1 + color2.g * w2),
			b: Math.round(color1.b * w1 + color2.b * w2)
		};
		return rgb;
	}
	
	function getWeight(value, min, max) {
		if (value <= min) return 0;
		if (value >= max) return 1;
		return (value - min) / (max - min);
	}
	
	function colorToString(color) {
		return 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', 1.0)';
	}
	
	function getMean(array) {
		return array.length > 0 ?array.reduce((acc, val) => acc + val) / array.length : 1000;
	}
	
	var perf = window.gameVars.Perfomance;
	var LATinertia = 0.2;
	var LATResultsCount = 5;
	
	var ping = (new Date).getTime() - this.seqSendTime;
	
	if (mesg.ack == this.seq && this.seqInFlight) {
		this.seqInFlight = false;
		this.pings.push(ping);
	
		while (this.pings.length > LATResultsCount) {
			this.pings.shift();
		}
	}
	
	// update LAT counter
		
	var LAT = getMean(this.pings);
	
	if(perf.lastLAT) {
		LAT = LAT * (1 - LATinertia) + perf.lastLAT * LATinertia;
	}

	perf.lastLAT = LAT;
		
	var LATCol = getColor(red, green, getWeight(LAT, 10, 200));
	
	if(window.gameVars && window.gameVars.UI && window.gameVars.UI.LATText) {
		window.gameVars.UI.LATText.text("LAT: " + Math.round(LAT));
		window.gameVars.UI.LATText.css('color', colorToString(LATCol));
	}

	// update LAG counter
	
	var minLag = Math.min.apply(null, this.pings);
	var maxLag = Math.max.apply(null, this.pings);
		
	var currLag = maxLag - minLag;
	
	var LAGinertia = 0.2;
	
	var minCountingLag = 20;
	var maxCountingLag = 100 - minCountingLag;
	
	var minCountingLatLag = 150;
	var maxCountingLatLag = 250 - minCountingLatLag;
	
	var newDevLAG = (currLag - minCountingLag) / maxCountingLag;
	var newLatLAG = this.seqInFlight ? (ping - minCountingLatLag) / maxCountingLatLag : 0.0;
	
	var newLAG = Math.max(newDevLAG, newLatLAG);
	
	newLAG = newLAG < 0.01 ? 0.01 : newLAG > 0.99 ? 0.99 : newLAG;
	
	newLAG = (newLAG - 0.5) * 2;
	newLAG = nthroot(newLAG, 3);
	newLAG = newLAG / 2 + 0.5;
	
	newLAG = newLAG < 0.1 ? 0 : newLAG > 0.9 ? 1.0 : newLAG;
	
	if(perf.lastLAG) {
		newLAG = newLAG * (1 - LAGinertia) + perf.lastLAG * LAGinertia;
	}
	
	perf.lastLAG = newLAG;
	
	if(window.gameVars && window.gameVars.UI && window.gameVars.UI.LAGText)
		window.gameVars.UI.LAGText.fadeTo(0, newLAG);
}
	
window.gameFunctions.gameUpdate = function(){
	
	if(!window.menu || !window.menu.UserSetting)
		return;
	
	// Local functions
	
	var getDistance = function(p1, p2) {
		var dx = p2.x - p1.x, dy = p2.y - p1.y;
		return Math.sqrt( dx*dx + dy*dy );
	};

	var getSecondsElapsed = function(time) {
		return (window.performance.now() - time) / 1000;
	};

	var getTimeElapsed = function(time) {
		return (window.performance.now() - time);
	};

	var pressButton = function(keyCode) {
		var keys = game.he.input.keys;

		if(!keys[keyCode]) {
			setTimeout(function() {
				keys[keyCode] = true;
				setTimeout(function() {
					delete keys[keyCode];
				}, 50);
			}, 50);
		}
	};

	var interactionTypes = {
		Obstacle: 2,
		Loot: 3
	};

	var detectEnimies = function() {
		if(!game[obfuscate.playerBarn][obfuscate.playerInfo][game[obfuscate.activeId]]) return [];
		var selfId = game[obfuscate.activeId];
		var selfTeamId = game[obfuscate.playerBarn][obfuscate.playerInfo][game[obfuscate.activeId]].teamId;
		var objectIds = Object.keys(game[obfuscate.objectCreator].idToObj);
		var playerIds = Object.keys(game[obfuscate.playerBarn][obfuscate.playerInfo]);

		var allPlayers = game[obfuscate.playerBarn][obfuscate.playerInfo];
		var firstPlayerId = Object.keys(allPlayers)[0];
		// console.log("allPlayers: ", allPlayers);
		// console.log("firstPlayerID: ", firstPlayerId);
		// console.log("objectIds: ", objectIds);


		var firstPlayerObj = game[obfuscate.objectCreator].idToObj[firstPlayerId];
		// console.log(firstPlayerObj);
		var allPlayerDict = {};
		for (let p in allPlayers) {
			let team = allPlayers[p].teamId;
			if (!allPlayerDict[team]) {
				allPlayerDict[team] = [];
			}
			let teamPlayer = allPlayers[p].name;
			// let teammateData = game[obfuscate.objectCreator].idToObj[allPlayers[p].playerId];
			// if (teammateData) {
			// 	// console.log(allPlayers[p].name + " is defined!");
			// }
			allPlayerDict[team].push(teamPlayer);
		}
		// console.log(allPlayerDict);
		// $("#ui-game-tab-keybinds").html(allPlayerDict);
		if(window.gameVars.Game.updateTeamTab){
			window.gameVars.Game.updateTeamTab = false;


			$("#ui-game-tab-keybinds").html("");
			$("#ui-game-tab-keybinds").css("overflow-y", "scroll");
			var killfeedText = $("#ui-killfeed-0 > div").html();
			// console.log(window.deadPlayers);
			if(killfeedText.indexOf("killed") !== -1) {
				let deadPlayerText = killfeedText.split("killed ")[1];
				if (deadPlayerText) {
					window.deadPlayers.add(deadPlayerText.split("with")[0].trim());
				}
			}

			var allPlayersStr = "";
			for (let team in allPlayerDict) {
				if( allPlayerDict[team].length > 1 ) {
					for (let p = 0; p < allPlayerDict[team].length; p++) {
						let thisPlayer = allPlayerDict[team][p];
						if (window.deadPlayers.has(thisPlayer)) {
							allPlayerDict[team][p] = `<span style="color: red;">${allPlayerDict[team][p]}</span>`;
						}
					}
					allPlayersStr = allPlayerDict[team].join(', ');
				} else {
					if (window.deadPlayers.has(allPlayerDict[team][0])) {
						allPlayerDict[team][0] = `<span style="color: red;">${allPlayerDict[team][0]}</span>`;
					}
					allPlayersStr = allPlayerDict[team][0];
				}
				$("#ui-game-tab-keybinds").append(`<p><strong>TEAM ${team}:</strong> ${allPlayersStr}</p>`);
			}
		}
		
		var isTeammate = function(plrId, plrObj) {
			var isTmmt = game[obfuscate.playerBarn][obfuscate.playerInfo][plrId].teamId == selfTeamId;
			plrObj.teammate = isTmmt;
			return isTmmt;
		}

		return playerIds
			.filter(function(id) {
				var playerObject = game[obfuscate.objectCreator].idToObj[id];
				return playerObject && 
				(!isTeammate(id, playerObject)) &&
				(!playerObject[obfuscate.netData].dead) && 
				(!playerObject[obfuscate.netData].downed) &&
				id != selfId;})
			.map(function(id) {
				return game[obfuscate.objectCreator].idToObj[id];
		});
	}
	
	var playerPosListCount = 5;
	var playerLastRelevantTime = 0.19;

	var processPlayerSpeed = function(player, inertia) {
		if(!player)
			return;
		
		var curPosData = {
			pos: player.pos,
			time: window.performance.now(),
		};
		
		if(!player.posData || getSecondsElapsed(player.posData[0].time) > playerLastRelevantTime)
		{
			player.posData = [curPosData];
			player.prediction = {x:0.0, y:0.0};
			player.speed = 0.0;
			player.distance = 0.0;
			player.direction = null;
			
			return;
		}
		
		var lastPosData = player.posData[0];
		
		var distance = getDistance(curPosData.pos, lastPosData.pos);
		
		if(distance > 0.0001)
		{
			player.direction = {
					x: (curPosData.pos.x - lastPosData.pos.x) / distance,
					y: (curPosData.pos.y - lastPosData.pos.y) / distance
				}
		}
		else
		{
			player.direction = null;
		}
		
		var speed = distance / getSecondsElapsed(lastPosData.time);
		
		if(player.speed)
			speed = (speed * (1.0 - inertia)) + (player.speed * inertia);
		
		player.speed = speed;
		player.distance = distance;
		player.posData.push(curPosData);
		
		while (player.posData.length > playerPosListCount) {
			player.posData.shift();
		}
	};
	
	var processEnemy = function(enemy) {
		if(!enemy)
			return;
		
		processPlayerSpeed(enemy, window.menu.UserSetting.shoot.autoAimSpeedInertia);
		
		if(!curBullet)
		{
			enemy.range = 0.0;
			enemy.prediction = {x:0.0, y:0.0};
			return;
		}
		
		var bulletReachTime = getDistance(curPlayer.pos, enemy.pos) / curBullet.speed
		
		if(window.menu.UserSetting.shoot.autoAimPingCorrectionEnabled)
			bulletReachTime += window.gameVars.Perfomance.lastLAT / 2000;
		
		var range = bulletReachTime * enemy.speed;
		
		var prediction = {
				x: 0,
				y: 0
			};
		
		if(enemy.direction)
		{
			prediction = {
				x: enemy.direction.x * range,
				y: enemy.direction.y * range
			}
		}
		
		var predInert = window.menu.UserSetting.shoot.autoAimPredictionInertia;
		
		prediction.x = prediction.x * (1.0 - predInert) + enemy.prediction.x * predInert;
		prediction.y = prediction.y * (1.0 - predInert) + enemy.prediction.y * predInert;
		
		enemy.prediction = prediction;
		enemy.range = range;
	};
	
	var runTimer = function (timerText, timerTime) {
		if(!game[obfuscate.pieTimer] || (game[obfuscate.pieTimer].timerTimeout && getSecondsElapsed(game[obfuscate.pieTimer].timerTimeout) < 0.1))
			return;
		// console.log("Calling functions.");
		game[obfuscate.pieTimer][obfuscate.free]();
		game[obfuscate.pieTimer][obfuscate.init](() => {stopTimer()}, timerTime, timerText, false);
	};

	var stopTimer = function() {
		if(!game[obfuscate.pieTimer])
			return;
		
		game[obfuscate.pieTimer][obfuscate.free]();
		
		game[obfuscate.pieTimer].timerBackground._tint = 16777215;
		game[obfuscate.pieTimer].outerCircle._tint = 16777215;
		game[obfuscate.pieTimer].counterText._tint = 16777215;
		game[obfuscate.pieTimer].labelText._tint = 16777215;
		
		game[obfuscate.pieTimer].timerTimeout = performance.now();
	};
	
	var getLootRange = function(loot) {
		// console.log("Loot range", getDistance(loot.pos, curPlayer.pos) - items[loot.name].rad - gameData.player.radius);
		return getDistance(loot.pos, curPlayer.pos) - items[loot.name].rad - gameData.player.radius;
	}

	var needToLoot = function() {
					
		var loot = game[obfuscate.lootBarn][obfuscate.closestLoot];
		// console.log("Loot pool:", game[obfuscate.lootBarn][obfuscate.lootPool]);
		// console.log("Closest loot:", game[obfuscate.lootBarn][obfuscate.closestLoot])
		var gunsSafeDistance = window.menu.UserSetting.loot.autolootSafeDistance;
		
		if(!loot) {			
			return false;
		}
			
		
		var needGuns = !invWeapon1 || !invWeapon2;
		
		var gunsNearBy = game[obfuscate.lootBarn][obfuscate.lootPool][obfuscate.pool].filter((l) => l.active && getLootRange(l) < gunsSafeDistance && gunNames.includes(l.name));
		
		var isSafeToPickup = !gunNames.includes(curPlayer.weapType);
		
		var lootIsDual = 
			(invWeapon1 && invWeapon1.dualWieldType && invWeapon1.id == loot.name) || 
			(invWeapon2 && invWeapon2.dualWieldType && invWeapon2.id == loot.name);
		
		
		var dualOnlyInRange = gunsNearBy.every((g) =>
			(invWeapon1 && invWeapon1.dualWieldType && invWeapon1.id == g.name) || 
			(invWeapon2 && invWeapon2.dualWieldType && invWeapon2.id == g.name));
		
		if(!isSafeToPickup && !needGuns && gunsNearBy.length > 0 && !dualOnlyInRange)
			return;
		
		if(loot.name.includes('pan')) return true;
		else if(loot.name.includes('katana')) return true;
		else if(loot.name.includes('stonehammer')) return true;
		else if(loot.name.includes('woodaxe')) return true;

		if(gunNames.includes(loot.name)) {
			if(needGuns || lootIsDual)
				return true;
		}		
		
		else if(loot.name.includes('backpack') && loot.name > game[obfuscate.activePlayer][obfuscate.netData].backpack) return true;
		else if(loot.name.includes('chest') && loot.name > game[obfuscate.activePlayer][obfuscate.netData].chest) return true;
		else if(loot.name.includes('helmet') && loot.name > game[obfuscate.activePlayer][obfuscate.netData].helmet) return true;
		else if(game[obfuscate.activePlayer][obfuscate.localData].inventory.hasOwnProperty(loot.name)){
			var backpackLvls = parseInt(game[obfuscate.activePlayer][obfuscate.netData].backpack.match(/\d/g).join(""));
				
			var max = gameData.bagSizes[loot.name][backpackLvls];
			var cur = game[obfuscate.activePlayer][obfuscate.localData].inventory[loot.name];
				
			if(cur < max)
				return true;
		}
		
		return false;
	};
	
	// Local variables
	
	var game = this;
	// console.log(game);
	if(!window.gameVars)
		return;
	
	var state = window.gameVars.Game;
	var gameData = state.GameData;
	
	if(!gameData)
		return;
	
	var items = gameData.items;
	var mapScale = 16.25;
	
	var autoFireGuns =  ["frag", "fists", "flare_gun", "mk12", "mp220", "m870", "sv98", "awc", "m39", "mosin", "smoke", "saiga", "m9", "m9_dual", "ot38", "ot38_dual", "deagle", "deagle_dual", "spas12", "garand", "karambit_rugged", "karambit_prismatic",
		"bayonet_rugged", "bayonet_woodland", "huntsman_rugged", "huntsman_burnished", "woodaxe", "hook", "pan", "karambit_drowned", "woodaxe_bloody", "m4a1", "bowie_vintage", "bowie_frontier", "usas", "mirv", "bar", "fireaxe", "m1911", "m1911_dual", "m1a1", "m1100",
			     "katana", "scorpion", "stonehammer", "model94", "snowball", "ots38_dual", "ots38", "katana_rusted", "kukri_trad", "an94", "machete_taiga", "m1014", "katana_orchid", "strobe", "naginata", "potato", "flare_gun_dual"
	];
	var grenadeTimerWarning = 1.05;
	
	var guns = [];
	var gunNames = [];
	for (var itm in items){
		var itmType = items[itm].type;
		if(itmType == "gun")
		{
			items[itm].id = itm;
			guns.push(items[itm])
			gunNames.push(itm)
		}
	}
	
	var curPlayer = game[obfuscate.activePlayer];

	if(!curPlayer)
		return;
	
	var curWeapon = null;
	// console.log(gameData);
	for(var k in gameData.items){
		if (k.toString().includes(curPlayer.weapType))
			curWeapon = gameData.items[k];
	}
	
	var curBullet = null;
	if(curWeapon)
		for(var k in gameData.bullets){
			if (k.toString().includes(curWeapon.bulletType))
			{
				curBullet = gameData.bullets[k];
			}
		}
  
	var invWeapon1Name = curPlayer[obfuscate.localData].weapons["0"].name;
	var invWeapon2Name = curPlayer[obfuscate.localData].weapons["1"].name;

	// console.log(curPlayer[obfuscate.localData].weapons["0"]);
	// console.log(curWeapon);

	var fullAmmoGuns = {"mp5": 30, "mac10": 32, "ump9": 30, "vector": 33, "famas": 25, "hk416": 30, "m4a1": 30, "mk12": 20, "m249": 100, "qbb97": 75, "ak47": 30, "scar": 20, 
		"dp28": 60, "bar": 20, "mosin": 5, "sv98": 10, "awc": 5, "m39": 20, "garand": 8, "m870": 5, "saiga": 5, "spas12": 9, "m9": 15, "m9_dual": 30, "m93r": 20,
		"m93r_dual": 40, "glock": 17, "glock_dual": 34, "ot38": 5, "ot38_dual": 10, "deagle": 7, "deagle_dual": 14
	}
	
	var invWeapon1 = invWeapon1Name == "" ? null : guns.find((g) => g.id == invWeapon1Name);
	var invWeapon2 = invWeapon2Name == "" ? null : guns.find((g) => g.id == invWeapon2Name);
	
	processPlayerSpeed(curPlayer, 0.1);
	
	curPlayer.moving = curPlayer.speed > 0.01;

	// Switch weapons
	var pressOne = function() {
		if(!game[obfuscate.input].keys["49"]) {
			setTimeout(function() {
				game[obfuscate.input].keys["49"] = true;
				setTimeout(function() {
					delete game[obfuscate.input].keys["49"]
				}, 100);
			}, 50);
		}
	}

	var pressTwo = function() {
		if(!game[obfuscate.input].keys["50"]) {
			setTimeout(function() {
				game[obfuscate.input].keys["50"] = true;
				setTimeout(function() {
					delete game[obfuscate.input].keys["50"]
				}, 100);
			}, 50);
		}
	}

	var pressReload = function () {
		if(!game[obfuscate.input].keys["82"]) {
			setTimeout(function () {
				game[obfuscate.input].keys["82"] = true;
				setTimeout(function () {
					delete game[obfuscate.input].keys["82"]
				}, 100);
			}, 50);
		}
	}

	var autoReloadGuns = function () {
		for (let gunName in fullAmmoGuns) {
			if (curWeapon.id == gunName && (curWeapon.id == invWeapon1Name && curPlayer[obfuscate.localData].weapons["0"].ammo < fullAmmoGuns[gunName])) {
				pressReload();
			} else if (curWeapon.id == gunName && (curWeapon.id == invWeapon2Name && curPlayer[obfuscate.localData].weapons["1"].ammo < fullAmmoGuns[gunName])) {
				pressReload();
			}
		}	
	}

	var weaponSwitcher = function() {
		if (curPlayer.curWeapIdx) {
			pressOne();
			return;
		}

		if (!curPlayer.curWeapIdx) {
			pressTwo();
			return;
		}		
	}

	if(window.gameVars.Input.Cheat.SwitchWeaponFirst) {
		weaponSwitcher();
	}

	if(window.menu.UserSetting.shoot.autoReloadEnabled) {
		autoReloadGuns();
	}
	// Laser
	
	var laser = state.Laser;
	
	if(curBullet)
	{
		laser.active = true;
		laser.range = curBullet.distance * mapScale;
		laser.direction = Math.atan2(curPlayer[obfuscate.netData].dir.x, curPlayer[obfuscate.netData].dir.y) - Math.PI / 2;
		laser.angle = (curWeapon.shotSpread + (curPlayer.moving ? curWeapon.moveSpread : 0.0)) * 0.01745329252 / 2;
	}
	else
	{
		laser.active = false;
	}
	
	// Zoom

	var currentZoom = window.gameVars.ZoomLevel;
	
	currentZoom *= 1.0 + window.menu.UserSetting.look.zoomSpeed / 50 * window.gameVars.Input.Cheat.GetZoomDelta();
	currentZoom = currentZoom < 0.1 ? 0.1 : currentZoom > 1.0 ? 1.0 : currentZoom;
	
	if(!window.gameVars.Menu && window.menu.UserSetting.look.zoomEnabled)
		window.gameVars.ZoomLevel = currentZoom;
	
	// Detect enimies
	
	var enimies = detectEnimies();

	enimies.forEach(processEnemy);
	window.gameVars.Game.Enimies = enimies;
	// for (let i = 0; i < enimies.length; i++) {
	// 	var enemyText = enimies[i].nameText.text;
	// 	console.log(enemyText + " " + enimies[i].bleedTicker);
	// }
	// console.log(curPlayer.U.health);

	// Update enemy lines
	
	window.gameVars.Game.EnemyLines.points = enimies
		.filter((enemy) => !enemy.teammate)
		.map((enemy) => {
			return {
				x: (enemy.pos.x - curPlayer.pos.x) * mapScale,
				y: (curPlayer.pos.y - enemy.pos.y) * mapScale
			};
		});
	
	// Update autoaim
	var target = null;
	
	// console.log(curPlayer.q.dead); \
	var alwaysOn = window.menu.UserSetting.shoot.autoAimAlwaysOnEnabled;
	if(alwaysOn) {
		window.gameVars.Input.Cheat.AutoAimPressed = !game.spectating;
	}

	window.gameVars.Input.Cheat.ShowNamesPressed = true;
	// console.log("Update: Auto aim pressed " + window.gameVars.Input.Cheat.AutoAimPressed);
	// console.log(window.gameVars.Input.Cheat.AutoAimPressed);
	if(window.menu.UserSetting.shoot.autoAimEnabled && window.gameVars.Input.Cheat.AutoAimPressed && enimies.length != 0)
	// if(window.menu.UserSetting.shoot.autoAimEnabled && window.gameVars.Input.Cheat.AutoAimPressed)
	{


		var mousePos = game[obfuscate.camera].O(window.gameVars.Input.Mouse.Pos);
		// console.log(mousePos);


		var mouseVec =
		{
			x: mousePos.x - curPlayer.pos.x,
			y: mousePos.y - curPlayer.pos.y
		};
		
		var enemiesInSight = enimies.filter((enemy) =>
			{
				if(!window.menu.UserSetting.shoot.autoAimRestirctionEnabled)
					return true;
					
				var enemyDir =
				{
					x: enemy.pos.x - curPlayer.pos.x,
					y: enemy.pos.y - curPlayer.pos.y
				};
				
				var enemyDistance = getDistance(enemy.pos, curPlayer.pos);
				
				var angleDif = Math.abs(Math.atan2(enemyDir.y, enemyDir.x) - Math.atan2(mouseVec.y, mouseVec.x));
				
				return angleDif < window.menu.UserSetting.shoot.autoAimRestirctionAngle * 0.0174533 || enemyDistance <  window.menu.UserSetting.shoot.autoAimRestrictionCloseRange;
			});
		
		if(enemiesInSight.length > 0)
			target = enemiesInSight
				.reduce((e1, e2) => (getDistance(mousePos, e1.pos) < getDistance(mousePos, e2.pos)) ? e1 : e2);
	}
	
	window.gameVars.Game.Target = target;
	
	(function() {
		if(!target)
		{
			window.gameVars.Input.Mouse.AimActive = false;
			return;
		}
		
		var pos = target.pos;
		var prediction = target.prediction ? target.prediction : {x:0, y:0};
		
		window.gameVars.Input.Mouse.AimActive = true;
		window.gameVars.Input.Mouse.AimPos = game[obfuscate.camera].pointToScreen({x: pos.x + prediction.x, y: pos.y + prediction.y});
	})();
	
	// Grenade timer
	// console.log(game[obfuscate.input]);
	// console.log(game[obfuscate.input].mouseButton);
	if(window.menu.UserSetting.shoot.fragGrenadeTimerEnabled && curPlayer.weapType == "frag" && !game[obfuscate.pieTimer][obfuscate.activeTimer] && game[obfuscate.input].mouseButton) {
		runTimer("FRAG", 4.0);
	}	
	if(window.menu.UserSetting.shoot.fragGrenadeTimerEnabled && curPlayer.weapType == "mirv" && !game[obfuscate.pieTimer][obfuscate.activeTimer] && game[obfuscate.input].mouseButton) {
		runTimer("MIRV", 4.0);
	}



	if(game[obfuscate.pieTimer][obfuscate.activeTimer]  && game[obfuscate.pieTimer].clientData.label == "FRAG")
	{
		if(!game[obfuscate.input].mouseButton)
		{	

			stopTimer();
			return;
		}
		
		if(game[obfuscate.pieTimer].clientData.duration - game[obfuscate.pieTimer].clientData.elapsed < grenadeTimerWarning)
		{
			game[obfuscate.pieTimer].timerBackground._tint = 0xff0000;
			game[obfuscate.pieTimer].outerCircle._tint = 0xff0000;
			game[obfuscate.pieTimer].counterText._tint = 0xff0000;
			game[obfuscate.pieTimer].labelText._tint = 0xff0000;
		}
	}

	if(game[obfuscate.pieTimer][obfuscate.activeTimer]  && game[obfuscate.pieTimer].clientData.label == "MIRV")
	{
		if(!game[obfuscate.input].mouseButton)
		{	

			stopTimer();
			return;
		}
		
		if(game[obfuscate.pieTimer].clientData.duration - game[obfuscate.pieTimer].clientData.elapsed < grenadeTimerWarning)
		{
			game[obfuscate.pieTimer].timerBackground._tint = 0xff0000;
			game[obfuscate.pieTimer].outerCircle._tint = 0xff0000;
			game[obfuscate.pieTimer].counterText._tint = 0xff0000;
			game[obfuscate.pieTimer].labelText._tint = 0xff0000;
		}
	}
	// console.log(needToLoot());
	
	// Bump fire
	// console.log(autoFireGuns.includes(curPlayer.weapType));
	// console.log(game[obfuscate.input]);
	window.gameVars.Input.Cheat.RepeatFire = !window.gameVars.Menu && window.menu.UserSetting.shoot.bumpFireEnabled && game[obfuscate.input].mouseButton && autoFireGuns.includes(curPlayer.weapType);
	// console.log(window.gameVars.Input.Cheat.RepeatFire);
	
	// Auto loot	
	window.gameVars.Input.Cheat.RepeatInteraction = window.menu.UserSetting.loot.autolootEnabled && (getSecondsElapsed(state.LastTimeDropItem) > window.menu.UserSetting.loot.autolootDropDelay) && needToLoot();
	var pressF = function () {
		if(!game[obfuscate.input].keys["70"]) {
			setTimeout(function() {
				game[obfuscate.input].keys["70"] = true;
				setTimeout(function() {
					delete game[obfuscate.input].keys["70"]
				}, 90);
			}, 0);
		}
	}

	if(window.gameVars.Input.Cheat.RepeatInteraction) {
		pressF();
	}
}
