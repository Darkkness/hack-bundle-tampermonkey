var barrelRedColor = false;
var red_barrel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQCAYAAADnRuK4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiNjc0Y2YwMS00NzdiLTAwNDYtYjk4MS01MmRmNjQ3YTVjOTEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkZCRkQ2RjdGMEIxMTFFODgwQzFDOEZENDY1NUUwMTAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkZCRkQ2RjZGMEIxMTFFODgwQzFDOEZENDY1NUUwMTAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTU0OTVhZDQtOTg2NC1lMjQ2LTg4YjctYzc3OGNlZTIxYzBiIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MGVkMjlhZTQtZjBhZi0xMWU4LWI2M2Mt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';

window.gameFunctions = window.gameFunctions || {};
window.gameFunctions.gameRender = function(){
	
	if(!window.menu || !window.menu.UserSetting)
		return;
	
	var game = this;
	var targetTexture = window.gameVars.Textures.targetTexture;
	var roundTexture = window.gameVars.Textures.roundTexture;

	if(!targetTexture || !targetTexture.baseTexture ||
		!roundTexture || !roundTexture.baseTexture)
		return;

	var updateObstacleAlpha = function(obstacle) {
		if(!obstacle || !obstacle.img)
			return;
		
		var alpha = 1.0;
		
		var setting = window.menu.UserSetting.look;
		
		if(obstacle.img.includes("map-tree"))
			alpha = setting.ceilingAlphaEnabled ? setting.obstaclesAlphaTreeLevel : 1.0;
		if(obstacle.img.includes("map-tree-04"))
			alpha = 1.0;
		if(obstacle.img.includes("map-bush"))
			alpha = setting.ceilingAlphaEnabled ? setting.obstaclesAlphaBushLevel : 0.97;
		if(obstacle.img.includes("map-table"))
			alpha = setting.ceilingAlphaEnabled ? setting.obstaclesAlphaTableLevel : 1.0;

		obstacle.sprite.alpha = alpha;
	}

	var updateBuildingCeilingAplha = function(building) {
		if(!building || !building.ceiling)
			return;
		
		var setting = window.menu.UserSetting.look;

		if(!setting.ceilingAlphaEnabled)
			return;
		// console.log("All sprites start");
		// for (let i = 0; i < building.sprites.length; i++) {
		// 	console.log(building.sprites[i].sprite.texture.baseTexture);
		// }
		// console.log("All sprites done");
		// console.log(building.sprites[0].sprite);

		building.sprites
			.map((s) => s.sprite)
			// .filter((s) => s.texture.baseTexture.imageUrl.includes("ceiling"))
			.filter((s) => (s._texture.textureCacheIds[0]) ? s._texture.textureCacheIds[0].includes("ceiling") : false)
			// .forEach((s) => console.log(s.texture.baseTexture.imageUrl))
			.forEach((s) => s.alpha = setting.ceilingAlphaLevel);
	}
	
	var updateSmokeAplha = function(smoke) {
		if(!smoke || !smoke.particle || !smoke.particle.sprite)
			return;
		
		var setting = window.menu.UserSetting.look;

		if(!setting.smokeAlphaEnabled)
			return;
		
		smoke.particle.sprite.alpha *= setting.smokeAlphaLevel;
	}
	// console.log("Console logging something!");
	// console.log(game[obfuscate.smokeBarn]);
	game[obfuscate.smokeBarn][obfuscate.smokePool][obfuscate.pool].forEach(updateSmokeAplha);
	game[obfuscate.map][obfuscate.obstaclePool][obfuscate.pool].forEach(updateObstacleAlpha);
	game[obfuscate.map][obfuscate.buildingPool][obfuscate.pool].forEach(updateBuildingCeilingAplha);

	var updateTargetIndicator = function(player) {
		if(!player || !player.prediction)
			return;
		
		var targetIndicator = player.targetIndicator;
		
		if(!targetIndicator)
		{
			targetIndicator = window.PIXI.Sprite.from(targetTexture);
			targetIndicator.visible = false;
			targetIndicator.scale.x = 0.7;
			targetIndicator.scale.y = 0.7;
			targetIndicator.tint = 16711680;
			targetIndicator.alpha = window.menu.UserSetting.look.targetIndicatorEnabled ? 0.4 : 0.0;
			player.container.addChild(targetIndicator);
			player.targetIndicator = targetIndicator;
		}
		
		if(!targetIndicator)
			return;
		
		targetIndicator.position.x = targetIndicator.width * -0.5 + player.prediction.x;
		targetIndicator.position.y = targetIndicator.height * -0.5 + player.prediction.y;
		
		targetIndicator.visible = player == window.gameVars.Game.Target;
	}
	
	var updateLaser = function() {
		// check this function with console logs.
		if(!game[obfuscate.activePlayer] || !game[obfuscate.activePlayer].container)
			return;
		
		var laser = window.gameVars.Game.Laser;
		
		var draw = laser.draw;
		
		if(!draw)
		{
			draw = new window.PIXI.Graphics();
			
			laser.draw = draw;
			game[obfuscate.activePlayer].container.addChild(draw);
			game[obfuscate.activePlayer].container.setChildIndex(draw, 0);
		}
		
		if(!draw.graphicsData)
			return;
		draw.clear();
		
		if(!laser.active || !window.menu.UserSetting.shoot.lasersightEnabled) 
			return;
		
		var center = {x: 0, y: 0}
		var radius = laser.range;
		var angleFrom = laser.direction - laser.angle;
		var angleTo = laser.direction + laser.angle;
		
		angleFrom = angleFrom > Math.PI * 2 ? angleFrom - Math.PI * 2 : angleFrom < 0 ? angleFrom + Math.PI * 2 : angleFrom;
		angleTo = angleTo > Math.PI * 2 ? angleTo - Math.PI * 2 : angleTo < 0 ? angleTo + Math.PI * 2 : angleTo;
		
		draw.beginFill( 0xff0000, 0.1 );
		draw.moveTo(center.x,center.y);
		draw.arc(center.x, center.y, radius, angleFrom, angleTo);
		draw.lineTo(center.x, center.y);
		draw.endFill();
	}
	
	var updateEnemyLines = function() {
		if(!game[obfuscate.activePlayer] || !game[obfuscate.activePlayer].container)
			return;
		
		var enemyLines = window.gameVars.Game.EnemyLines;
		
		var points = enemyLines.points
		var draw = enemyLines.draw;
		
		if(!points)
			return;
	
		if(!draw)
		{
			draw = new window.PIXI.Graphics();
			
			enemyLines.draw = draw;
			game[obfuscate.activePlayer].container.addChild(draw);
			game[obfuscate.activePlayer].container.setChildIndex(draw, 0);
		}
		
		if(!draw.graphicsData)
			return;
		
		draw.clear();
		
		if(!window.menu.UserSetting.look.enemyLinesEnabled)
			return;
		
		draw.beginFill();
		draw.lineStyle(2, 0x68B0E8);
		
		points.forEach(function(pnt) {
			draw.moveTo(0, 0);
			draw.lineTo(pnt.x, pnt.y);
		});
		
		draw.endFill();
	}
	
	var updateNames = function(player) {
		// if(!player || !player.nameText || player.teammate)
		// 	return;
		
		var nameText = player.nameText;
		
		if(window.gameVars.Input.Cheat.ShowNamesPressed)
		{
			nameText.visible = true;
			if(player.teammate) {
				nameText.tint = 0x00b2ff;
			} else {
				nameText.tint = 0xffd700;
			}
			nameText.scale.set(1, 1);
		}
	}

	var updateCustomCursor = function() {
		var cursor = window.menu.UserSetting.look.customCursorLevel;
		// if (cursor == 1) {
		// 	$('#game-area-wrapper').css('cursor', 'url(http://cdn.ogario.ovh/static/img/cursors/cursor_06.cur), default');
		// } else {
		// 	$('#game-area-wrapper').css('cursor', 'crosshair');
		// }
		switch (cursor) {
			case 1:
				$("#game-area-wrapper").css('cursor', 'url(http://cdn.ogario.ovh/static/img/cursors/cursor_01.cur), default');
				break;
			case 2:
				$('#game-area-wrapper').css('cursor', 'url(http://cdn.ogario.ovh/static/img/cursors/cursor_06.cur), default');
				break;
			case 3:
				$("#game-area-wrapper").css('cursor', 'url(http://cur.cursors-4u.net/cursors/cur-11/cur1054.cur), default');
				break;
			case 4:
				$("#game-area-wrapper").css('cursor', 'url(http://cur.cursors-4u.net/games/gam-11/gam1088.cur), default');
				break;
			case 5:
				$("#game-area-wrapper").css('cursor', 'url(http://ani.cursors-4u.net/cursors/cur-12/cur1080.cur), default');
				break;
			case 6:
				$("#game-area-wrapper").css('cursor', 'url(http://cur.cursors-4u.net/cursors/cur-1/cur5.cur), default');
				break;
			case 7:
				$("#game-area-wrapper").css('cursor', 'url(http://cur.cursors-4u.net/games/gam-14/gam1384.cur), default');
				break;
			case 8:
				$("#game-area-wrapper").css('cursor', 'url(http://cur.cursors-4u.net/cursors/cur-2/cur120.cur), default');
				break;
			case 9:
				$("#game-area-wrapper").css('cursor', 'url(http://cur.cursors-4u.net/games/gam-14/gam1394.cur), default');
				break;
			case 10:
				$("#game-area-wrapper").css('cursor', 'url(http://cur.cursors-4u.net/user/use-1/use153.cur), default');
				break;
			default:
				$('#game-area-wrapper').css('cursor', 'crosshair');
		}
	}
	
	var updateBarrelsColor = function() {
		if(barrelRedColor != window.menu.UserSetting.look.barrelRedRecolorEnabled){
			barrelRedColor = window.menu.UserSetting.look.barrelRedRecolorEnabled;
			if(barrelRedColor){
				window.gameVars.Game.model["Defs"].barrel_01.img.sprite = red_barrel;
			} else {
				window.gameVars.Game.model["Defs"].barrel_01.img.sprite = "map-barrel-01.img";
			}
		}
	}
	
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
	
	try {
		//game.playerBarn.playerPool.pool
		//game.activePlayer
		var players = game[obfuscate.playerBarn][obfuscate.playerPool][obfuscate.pool].filter(p => p.__id != game[obfuscate.activePlayer].__id); 
		//check the above
		players.forEach(updateTargetIndicator);
		players.forEach(updateNames);
		updateLaser();
		updateEnemyLines();
		updateCustomCursor();
		updateBarrelsColor();
		// console.log(game[obfuscate.map][obfuscate.obstaclePool].creator.__type);
		// $(".ui-stats-header-title").html("You suck.");
	}
	catch(error)
	{
		console.log(error)
	}
	
	// counters
	
	var red = { r: 255, g: 0, b: 0 };
	var green = { r: 0, g: 180, b: 0 };
	
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
	
	function getMedian(array) {
		
		var values = array.slice();
		
		values.sort( function(a,b) {return a - b;} );

		var half = Math.floor(values.length/2);

		if(values.length % 2)
			return values[half];
		else
			return (values[half-1] + values[half]) / 2.0;
	}
	
	// FPS counter
	
	var perf = window.gameVars.Perfomance;
	var FPSinertia = 0.1;
	var FPSResultsCount = 15;
	
	var curFPS = 0;
	
	if(perf.lastTimeFPS) {
		var elapsed = window.performance.now() - perf.lastTimeFPS;
		curFPS = 1000 / elapsed;
	}
	
	perf.lastTimeFPS = window.performance.now();
	
	var FPSList = perf.lastFPSList;
	
	FPSList.push(curFPS);
	
	while (FPSList.length > FPSResultsCount) {
		FPSList.shift();
	}
	
	var FPS = getMedian(FPSList);
	
	if(perf.lastFPS) {
		FPS = FPS * (1 - FPSinertia) + perf.lastFPS * FPSinertia;
	}

	perf.lastFPS = FPS;
		
	var FPSCol = getColor(green, red, getWeight(FPS, 5, 40));
	
	if(window.gameVars && window.gameVars.UI && window.gameVars.UI.FPSText) {
		window.gameVars.UI.FPSText.text("FPS: " + Math.round(FPS));
		window.gameVars.UI.FPSText.css('color', colorToString(FPSCol));
	}
}
