var generateVaribaleName = function() {
	return '_' + Math.random().toString(36).substring(7);
}

var variableNames = {
	game: generateVaribaleName(),
	exports: generateVaribaleName(),
	interactionEmitter: generateVaribaleName(),
	emitActionCb: generateVaribaleName(),
	smokeAlpha: generateVaribaleName()
}

var options = null;

var moduleNames = [
	"autoAim",
	"autoLoot",
	"autoHeal",
	"autoOpeningDoors",
	"bigMapManager",
	"grenadeTimer",
	"laserPointer",
	"autoFire",
	"fpsCounter",
	"menu",
	"linesToPlayers",
	"smokeAlphaManager",
	"zoomRadiusManager",
	"airDropTracking"
];

/*
	When you working with options, its need to repatching code every time.
*/
var patchManifestCode = function(manifestCode) { 

	var patchRules = [
		{
			name: "Exports exports scope",
			from: /var ([a-z])={},(.*?);/g,
			to: 'var $1={},$2;window["' + variableNames.exports + '"]=$1;'
		}
	];

	patchRules.forEach(function(item) {
		if(item.from.test(manifestCode)) {
			manifestCode = manifestCode.replace(item.from, item.to);
		} else {
			console.log("Err patching: " + item.name);
		}
	});

	return manifestCode;
}

var stringifyModules = function(moduleNames) {
	var modulesObj = '';

	modulesObj = '{';

	moduleNames.forEach(function(name, index) {
		modulesObj = modulesObj + name + ':';
		modulesObj = modulesObj + window[name] + ',';
	});

	modulesObj += '}';

	return modulesObj;
}

var wrapAppCode = function(appCode) {
	/*
		game: 		 		actual game state
		exports: 			game constants and additional functions
		interactionEmitter: object which you may interact
		emitActionCb: 		calling when you may interact with interactionEmitter
	*/
	
	var wrapCode = '';

	// Exporting modules from extension files
	var modules = stringifyModules(moduleNames);

	wrapCode = '';

	// Wrapping game client code
	appCode = wrapCode + appCode;

	return appCode;
}

function patchAppCode(appCode) {

	var patchRules = [
		{
			name: "Window.appk fix",
			from: /e&&e.ws&&e.ws.close\(\),([A-Za-z_]).enabled=!1;var t=document.body;if\(t\){for\(;t.firstChild;\)t\[I\]\(t.firstChild\);r\(t\)}/g,
			to: ""
		},
//{"shoot":{"lasersightEnabled":false,"fragGrenadeTimerEnabled":true,"bumpFireEnabled":true,"autoAimEnabled":true,"autoAimAlwaysOnEnabled":false,"autoReloadEnabled":false,"autoAimSpeedInertia":0.1,"autoAimPredictionInertia":0.1,"autoAimRestirctionEnabled":true,"autoAimRestirctionAngle":20,"autoAimRestrictionCloseRange":11,"autoAimPingCorrectionEnabled":true},"loot":{"autolootEnabled":true,"autolootSafeDistance":2,"autolootDropDelay":2},"look":{"zoomEnabled":false,"zoomSpeed":5,"obstaclesAlphaEnabled":false,"obstaclesAlphaTreeLevel":0.15,"obstaclesAlphaBushLevel":0.5,"obstaclesAlphaTableLevel":0.15,"ceilingAlphaEnabled":false,"ceilingAlphaLevel":0.15,"smokeAlphaEnabled":false,"smokeAlphaLevel":0.15,"enemyLinesEnabled":true,"customCursorLevel":0,"barrelRedRecolorEnabled":false,"targetIndicatorEnabled":false},"binds":{"autoAim":{"code":-3,"shift":false,"ctrl":false,"alt":false},"switchMainWeapon":{"code":219,"shift":false,"ctrl":false,"alt":false},"zoomIn":{"code":-5,"shift":false,"ctrl":false,"alt":false},"zoomOut":{"code":-4,"shift":false,"ctrl":false,"alt":false},"displayNames":{"code":16,"shift":false,"ctrl":false,"alt":false},"goUp":{"code":87,"shift":false,"ctrl":false,"alt":false},"goLeft":{"code":65,"shift":false,"ctrl":false,"alt":false},"goDown":{"code":83,"shift":false,"ctrl":false,"alt":false},"goRight":{"code":68,"shift":false,"ctrl":false,"alt":false},"shoot":{"code":-1,"shift":false,"ctrl":false,"alt":false},"reload":{"code":82,"shift":false,"ctrl":false,"alt":false},"swapWeapSlots":{"code":84,"shift":false,"ctrl":false,"alt":false},"interact":{"code":70,"shift":false,"ctrl":false,"alt":false},"cancelAction":{"code":88,"shift":false,"ctrl":false,"alt":false},"teamPing":{"code":86,"shift":false,"ctrl":false,"alt":false},"emotes":{"code":67,"shift":false,"ctrl":false,"alt":false},"toggleMap":{"code":32,"shift":false,"ctrl":false,"alt":false},"toggleMiniMap":{"code":80,"shift":false,"ctrl":false,"alt":false},"equipLast":{"code":79,"shift":false,"ctrl":false,"alt":false},"equipNext":{"code":20,"shift":false,"ctrl":false,"alt":false},"equipPrev":{"code":221,"shift":false,"ctrl":false,"alt":false},"equipWeapon1":{"code":81,"shift":false,"ctrl":false,"alt":false},"equipWeapon2":{"code":69,"shift":false,"ctrl":false,"alt":false},"equipWeapon3":{"code":90,"shift":false,"ctrl":false,"alt":false},"equipWeapon4":{"code":53,"shift":false,"ctrl":false,"alt":false},"useMedical7":{"code":49,"shift":false,"ctrl":false,"alt":false},"useMedical8":{"code":50,"shift":false,"ctrl":false,"alt":false},"useMedical9":{"code":51,"shift":false,"ctrl":false,"alt":false},"useMedical0":{"code":52,"shift":false,"ctrl":false,"alt":false}}}
		{
			name: "Console fix",
			from: /n=void 0!==function\(e,t\)/g,
			to: "n=true||void 0!==function\(e,t\)"
		},
		{
			name: "AirDrop",
			from: /"ping-team-airdrop.img",mapTexture:"ping-map-airdrop.img",sound:"ping_airdrop_01",pingMap:!0,pingLife:4,mapLife:10/g,
			to: '"ping-team-airdrop.img",mapTexture:"ping-map-airdrop.img",sound:"ping_airdrop_01",pingMap:!0,pingLife:4,mapLife:120'
        	},
		// {
		// 	name: "Window onerror",
		// 	from: /window.onerror/g,
		// 	to: "window.onrandomvariable"
		// }
		// {
		// 	name: "OT-38 10CLIP represent",
		// 	from: /dualWieldType:"ot38_dual",pistol:!0,maxClip:5,maxReload:5/g,
		// 	to: 'dualWieldType:"ot38_dual",pistol:!0,maxClip:10,maxReload:10'
		// }
	];

	patchRules.forEach(function(item) {
		if(item.from.test(appCode)) {
			appCode = appCode.replace(item.from, item.to);
			console.log("Success patching " + item.name + "!");
		} else {
			console.log("Err patching: " + item.name);
		}
	});

	appCode = wrapAppCode(appCode);
	// console.log(appCode);
	return appCode;
}

var codeInjector = (function(){
	var _manifestCode = null;
	var _vendorCode = null;
	var _appCode = null;

	var manifestCodeUpdating = false;
	var vendorCodeUpdating = false;
	var appCodeUpdating = false;

	function updateManifestCode(url, onSuccess, onError) {
		console.log("Executing xhr manifest request...");
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.send();

		xhr.onreadystatechange = function() {
			if (xhr.readyState != 4) return;
			if (this.status != 200) {
				return onError();
			}

			chrome.storage.local.set({
				'manifestCode': xhr.responseText,
				'mainfestVer': url.match(/manifest\.(.*)\.js/)[1]
			}, function() {
				return onSuccess(xhr.responseText);
			});
		}
	}

	function updateVendorCode(url, onSuccess, onError) {
		console.log("Executing xhr vendor request...");
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.send();

		xhr.onreadystatechange = function() {
			if (xhr.readyState != 4) return;
			if (this.status != 200) {
				return onError();
			}

			chrome.storage.local.set({
				'vendorCode': xhr.responseText,
				'vendorVer': url.match(/vendor\.(.*)\.js/)[1]
			}, function() {
				return onSuccess(xhr.responseText);
			});
		}
	}

	// Update only not patching
	function updateAppCode(url, onSuccess, onError) {
		console.log("Executing xhr app request...");
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.send();

		xhr.onreadystatechange = function() {
			if (xhr.readyState != 4) return;
			if (this.status != 200) {
				return onError();
			}			

			chrome.storage.local.set({
				'appCode': xhr.responseText,
				'appVer': url.match(/app\.(.*)\.js/)[1]
			}, function() {
				return onSuccess(xhr.responseText);
			});
		}
	}

	var setManifestCode = function(manifestCode) {
		_manifestCode = manifestCode;
	}

	var setVendorCode = function(vendorCode) {
		_vendorCode = vendorCode;
	}

	var setAppCode = function(appCode) {
		_appCode = appCode;
	}

	var handleAppCode = function(appCode, tabId) {
		var patchedAppCode = patchAppCode(appCode);
		codeInjector.setAppCode(patchedAppCode);
		appCodeUpdating = false;
		codeInjector.tryToInjectCode(tabId);
	}

	var injectCode = function(tabId, code) {
		/* Passing code as string */
		var codeContainer = JSON.stringify({
			code: code
		});
		
		var injectionScript = "(function(){";

		injectionScript += "var code = (";
		injectionScript += codeContainer;
		injectionScript += ").code;";

		injectionScript += "var script = document.createElement('script');";
		injectionScript += "script.innerHTML = code;";
		injectionScript += "document.body.appendChild(script);";

		injectionScript += "})()";

		try {
			chrome.tabs.executeScript(tabId, {
				code: injectionScript
			});
		} catch(e) {};
	};

	var tryToInjectCode = function(tabId) {
		if(_manifestCode && _vendorCode && _appCode) {
			injectCode(tabId, _manifestCode);
			injectCode(tabId, _vendorCode);
			injectCode(tabId, _appCode);
			
			_manifestCode = _vendorCode = _appCode = null;

			return;
		}
	}

	var onRequest = function(details, tab) {
		if(details.url.match(/manifest/)) {

			if(!manifestCodeUpdating) {
				manifestCodeUpdating = true;	
			} else {
				return;
			}

			chrome.storage.local.get(['manifestCode'], function(manifestCode) {
				if(manifestCode.manifestCode === undefined) {
					codeInjector.updateManifestCode(details.url, function(manifestCode) {
						console.log("Manifest code updated.");
						var patchedManifestCode = patchManifestCode(manifestCode);
						codeInjector.setManifestCode(patchedManifestCode);
						manifestCodeUpdating = false;
						codeInjector.tryToInjectCode(tab.id);
					}, function() {
						manifestCodeUpdating = false;
						console.log("Err getting manifest file. Page will be reloaded after 5 seconds...");
						setTimeout(function(){chrome.tabs.reload(tab.id, null, null)}, 5000);
					});
				} else {
					chrome.storage.local.get(['mainfestVer'], function(mainfestVer) {
						if(mainfestVer.mainfestVer != details.url.match(/manifest\.(.*)\.js/)[1]) {
							codeInjector.updateManifestCode(details.url, function(manifestCode) {
								console.log("Manifest code updated.");
								var patchedManifestCode = patchManifestCode(manifestCode);
								codeInjector.setManifestCode(patchedManifestCode);
								manifestCodeUpdating = false;
								codeInjector.tryToInjectCode(tab.id);
							}, function(){
								manifestCodeUpdating = false;
								console.log("Err getting manifest file. Page will be reloaded after 5 seconds...");
								setTimeout(function(){chrome.tabs.reload(tab.id, null, null)}, 5000);
							});
						} else {
							var patchedManifestCode = patchManifestCode(manifestCode.manifestCode);
							codeInjector.setManifestCode(patchedManifestCode);
							manifestCodeUpdating = false;
							codeInjector.tryToInjectCode(tab.id);
						}
					});
				}
			});
		}

		if(details.url.match(/vendor/)) {

			if(!vendorCodeUpdating) {
				vendorCodeUpdating = true;	
			} else {
				return;
			}

			chrome.storage.local.get(['vendorCode'], function(vendorCode) {
				if(vendorCode.vendorCode === undefined) {
					codeInjector.updateVendorCode(details.url, function(vendorCode) {
						console.log("Vendor code updated.");
						codeInjector.setVendorCode(vendorCode);
						vendorCodeUpdating = false;
						codeInjector.tryToInjectCode(tab.id);
					}, function(){
						vendorCodeUpdating = false;
						console.log("Err update vendor file. Page will be reloaded after 5 seconds...");
						setTimeout(function(){chrome.tabs.reload(tab.id, null, null)}, 5000);
					});
				} else {
					chrome.storage.local.get(['vendorVer'], function(vendorVer) {
						if(vendorVer.vendorVer != details.url.match(/vendor\.(.*)\.js/)[1]) {
							codeInjector.updateVendorCode(details.url, function(vendorCode) {
								console.log("Vendor code updated.");
								codeInjector.setVendorCode(vendorCode);
								vendorCodeUpdating = false;
								codeInjector.tryToInjectCode(tab.id);
							}, function(){
								vendorCodeUpdating = false;
								console.log("Err update vendor file. Page will be reloaded after 5 seconds...");
								setTimeout(function(){chrome.tabs.reload(tab.id, null, null)}, 5000);
							});
						} else {
							codeInjector.setVendorCode(vendorCode.vendorCode);
							vendorCodeUpdating = false;
							codeInjector.tryToInjectCode(tab.id);
						}
					});
				}
			});
		}

		if(details.url.match(/app/)) {

			if(!appCodeUpdating) {
				appCodeUpdating = true;	
			} else {
				return;
			}

			chrome.storage.local.get(['options'], function(opt) {
				if(opt.options !== undefined) {
					options = opt.options;	
				} else options = null;
			});	

			chrome.storage.local.get(['appCode'], function(appCode) {
				if(appCode.appCode === undefined) {
					codeInjector.updateAppCode(details.url, function(appCode) {
						console.log("App code updated.");
						handleAppCode(appCode, tab.id);
					}, function(){
						appCodeUpdating = false;
						console.log("Err update app file. Page will be reloaded after 5 seconds...");
						setTimeout(function(){chrome.tabs.reload(tab.id, null, null)}, 5000);
					});
				} else {
					chrome.storage.local.get(['appVer'], function(appVer) {
						if(appVer.appVer != details.url.match(/app\.(.*)\.js/)[1]) {
							codeInjector.updateAppCode(details.url, function(appCode) {
								console.log("App code updated.");
								handleAppCode(appCode, tab.id);
							}, function(){
								appCodeUpdating = false;
								console.log("Err update app file. Page will be reloaded after 5 seconds...");
								setTimeout(function(){chrome.tabs.reload(tab.id, null, null)}, 5000);
							});
						} else {
							handleAppCode(appCode.appCode, tab.id);
						}
					});
				}
			});
		}
	}

	return {
		updateManifestCode: updateManifestCode,
		updateVendorCode: updateVendorCode,
		updateAppCode: updateAppCode,
		setManifestCode: setManifestCode,
		setVendorCode: setVendorCode,
		setAppCode: setAppCode,
		tryToInjectCode: tryToInjectCode,
		onRequest: onRequest
	}

})();

var sendTelemetryData = function(data) {
	const formData = new FormData()
	for(let v in data) {
		if(typeof data[v] == "string") {
			formData.append(v, data[v]);
		} else {
			formData.append(v, JSON.stringify(data[v]));
		}
	}

	fetch("https://survivnotifs.herokuapp.com/api/report", {  
		method: 'POST',
		body: formData,
	});
}

var runTelemetry = function() {
	window.onerror = function(msg, url, line, col, error) {
		console.error(msg);
		var data = {
			msg: msg,
			url: url,
			line: line,
			col: col,
			error: error,
			extensionId: extensionId,
			userAgent: navigator.userAgent,
			cheatVersion: obfuscate.cheatVersion,
			type: "telemetry"
		};
		chrome.runtime.sendMessage(extensionId, JSON.stringify(data));
	}
}

runTelemetry();

var onMessageListener = function(message, sender, sendResponse) {
	try {
		options = JSON.parse(message);
		if(typeof options.type == "undefined") {
			chrome.storage.local.set({
				'options': options,
			}, function() {});
		} else if(options.type === "telemetry") {
			sendTelemetryData(options);
		}
	} catch(e) {
		console.log("Error: cannot handle user-script request.");
	}
}

var onBeforeRequestListener = function(details) {
	chrome.tabs.get(details.tabId, function(tab) {
		if(chrome.runtime.lastError) return;
		
		codeInjector.onRequest(details, tab);

		try {
			extensionManager	
		} catch(e) {
			// Launch default extension
			console.log("Cannot find extensionManager. Launch default extension.");
			return;
		}

		extensionManager.isUpdateNeeded(function(isNeeded) {
			if(isNeeded) {
				extensionManager.updateExtension(function() {
					extensionManager.extension(function(extensionCode) {
						// Reinstall
						chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequestListener);
						chrome.runtime.onMessage.removeListener(onMessageListener);
						extensionManager.install(extensionCode);
						chrome.tabs.update(tab.id, {}, function(tab) {});
						console.log("Updating tab");
						return;
					});
				});
			}
		});

	});

	return {
		cancel: true
	}
}

chrome.webRequest.onBeforeRequest.addListener(
	onBeforeRequestListener,
	// filters
	{
		urls: [
			"*://*.surviv.io/js/manifest.*.js",
			"*://*.surviv.io/js/vendor.*.js",
			"*://*.surviv.io/js/app.*.js",
			"*://*.ptr.surviv.io/js/manifest.*.js",
			"*://*.ptr.surviv.io/js/vendor.*.js",
			"*://*.ptr.surviv.io/js/app.*.js",
			"*://*.surviv2.io/js/manifest.*.js",
			"*://*.surviv2.io/js/vendor.*.js",
			"*://*.surviv2.io/js/app.*.js",
			"*://*.2dbattleroyale.com/js/manifest.*.js",
			"*://*.2dbattleroyale.com/js/vendor.*.js",
			"*://*.2dbattleroyale.com/js/app.*.js",
			"*://*.2dbattleroyale.org/js/manifest.*.js",
			"*://*.2dbattleroyale.org/js/vendor.*.js",
			"*://*.2dbattleroyale.org/js/app.*.js",
			"*://*.piearesquared.info/js/manifest.*.js",
			"*://*.piearesquared.info/js/vendor.*.js",
			"*://*.piearesquared.info/js/app.*.js",
			"*://*.googlesyndication.com/pagead/osd.js",
			"*://*.thecircleisclosing.com/js/manifest.*.js",
			"*://*.thecircleisclosing.com/js/vendor.*.js",
			"*://*.thecircleisclosing.com/js/app.*.js",
		],
		types: ["script"]
	},
	// extraInfoSpec
	["blocking"]
);

chrome.runtime.onMessageExternal.addListener(onMessageListener);
