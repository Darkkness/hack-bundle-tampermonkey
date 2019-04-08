(function(){
	var adsClearTimer = function() {
		$( 'div[id^="google_ads_iframe_"]' ).remove();
		setTimeout(adsClearTimer, 200);
	};
	$(document).ready(() => adsClearTimer());
	
	var addHelp = function() {
		if(!window.tempVars) {
			setTimeout(addHelp, 100);
			return;
		}
		try{
			$(document);
		}
		catch(e){
			setTimeout(addHelp, 100);
			return;
		}
		
		$(".ad-block-med-rect").css("width","auto");
		$(".ad-block-med-rect").css("overflow-y","auto");
	
		$(".ad-block-med-rect").html(window.tempVars.helpEnHtml);
		// $(".ad-block-med-rect").html(window.tempVars.helpRuHtml);
		
		var updateHelp = function() {
			setTimeout(updateHelp, 50);
			if(window.gameVars){
				var en = window.gameVars.Language != "ru";
				$(".help-en").css("display", en ? "block" : "none");
				$(".help-ru").css("display", en ? "none" : "block");
			}	
		};
		updateHelp();
	}
	
	$(document).ready(() => {
		updateLang()
		function setVolume_1() {
			var radioPlayer = $("#survivRadio");
			var volumeSetting = $("#volume1").val();
			radioPlayer.prop("volume", volumeSetting);
		}

		function setVolume_2() {
			var radioPlayer = $("#survivRadio");
			var volumeSetting = $("#volume2").val();
			radioPlayer.prop("volume", volumeSetting);
		}
		// $("#modal-customize-list").append('<div class="customize-list-item customize-list-item-unlocked" data-lock-reason> \
		// 	<div class="customize-emote-image" style="background-image: url(https://vectr.com/kalaborative/a1J8fHbx4D.svg)" draggable="true" data-id="269"></div> \
		// 	</div>');

		var selectableSlots = $(".customize-col, .customize-list-item");
		// console.log(selectableSlots);

		var disabledStations = ["http://frshoutcast.comunicazion.eu:8815/;", "http://hyades.shoutca.st:8043/stream", "http://54.38.214.69/;?icy=http"]

		var streamStations = ["http://178.32.107.151/proxy/curveradio?mp=/stream"]
		var randomIndex = Math.floor(Math.random() * streamStations.length);
		var chosenStation = streamStations[randomIndex];

		var radioSliderHtml = '<div class="slider-container ui-slider-container"><p class="slider-text" data-l10n="index-music-volume">Radio Volume</p>\
            <input type="range" min=0 max=1 value="1" step=0.01 class="slider sl-music-volume" id="volume2"></div>';
		$(radioSliderHtml).insertAfter(".ui-slider-container:eq(2)");

		addHelp();
		$("<style>")
			.prop("type", "text/css")
			.html("\
			.menu-option {\
				pointer-events: all;\
			}")
			.appendTo("head");
		$("#ad-block-left").css("background-color", "transparent");
		$(".ad-block-med-rect").css("background-color", "rgba(0,0,0,.5)");
		$(".ad-block-med-rect").css("border-radius", "5px");
		$(".ad-block-leaderboard-bottom").hide();
		$("#ad-block-left").append('\
			<div class="menu-block" style="padding: 20px; margin-top: 8px;">\
			<h3 style="margin-top: 0px; color: #83af50;">Surviv Radio!</h3> \
			<audio src="'+chosenStation+'" controls style="width: 200px;" id="survivRadio"></audio> \
			<input type="range" id="volume1" min=0 max=1 step=0.01 value="1" class="slider"> \
			</div>');

		$("#volume1").change(function () {
			setVolume_1();
		});

		$("#volume2").change(function () {
			setVolume_2();
		});

	});
	
	$(document).off("mousedown");
	
	var updateLang = function() {
		setTimeout(updateLang, 50);
		if(window.gameVars)
			window.gameVars.Language = $(".language-select option:selected").val();
	};
})();