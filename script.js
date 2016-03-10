// (function(){
			
	$(document).ready(function(){
		var game = {};

		game.width = 700;
		game.height = 750;

		game.contextBackground = $("#backgroundCanvas")[0].getContext("2d");
		game.contextPlayer = $("#playerCanvas")[0].getContext("2d");

		game.stars = [];
		game.keys = [];

		game.paths = ['player.jpg'];
		game.images = [];
		game.doneImages = 0;
		game.requiredImages = 0;

		game.player = {
			x: 300,
			y: game.height - 110,
			width: 100,
			height: 100,
			speed: 8,
			rendered: false
		}

		$(document).keydown(function(e){
			game.keys[e.keyCode ? e.keyCode : e.which] = true;
		});

		$(document).keyup(function(e){
			delete game.keys[e.keyCode ? e.keyCode : e.which];
		});

		function init () {
			// game.contextPlayer.drawImage(game.images[0], game.player.x, game.player.y);
			// var img = new Image();
			// 	img.src = 'player.jpg';
			// 	game.contextPlayer.drawImage(img, game.player.x, game.player.y);
			loop();
		}

		function update () {
			if(game.keys[37] || game.keys[65]) {
				if(game.player.x > 5) {
					game.player.x-=game.player.speed;
					game.player.rendered = false;
				}
			}
			if(game.keys[39] || game.keys[68]) {
				if(game.player.x <= game.width - game.player.width - 5) {
					game.player.x+=game.player.speed;
					game.player.rendered = false;
				}
			}
		}

		function render () {
			game.contextBackground.clearRect(0, 0, game.width, game.height);
			game.contextBackground.fillRect(0, 0, game.width, game.height);

			game.contextBackground.fillStyle = "rgb(255,165,0)";
			if(!game.player.rendered) {
				game.contextPlayer.fillStyle = "rgb(25,165,79)";
				// game.contextPlayer.clearRect(game.player.x - 5, game.player.y - 9, game.player.width + 5, game.player.height + 500);
				game.contextPlayer.clearRect(0, 0, game.width, game.height);
				game.contextPlayer.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
				game.contextPlayer.clearRect(game.player.x + 5, game.player.y + 5, game.player.width - 10, game.player.height - 10);

				game.contextPlayer.fillRect(game.player.x + 10, game.player.y + 10, game.player.width - 20, game.player.height - 20);

				game.player.rendered = true;
			}
		}

		// function initImages (paths) {
		// 	game.requiredImages = paths.length;
		// 	for(i in paths) {
		// 		var img = new Image();
		// 		img.src = paths[i];
		// 		game.images[i] = img;
		// 		game.images[i].onload = function() {
		// 			game.doneImages++;
		// 		}
		// 	}
		// }

		// function checkImages () {
		// 	if(game.doneImages > game.requiredImages) {
		// 		init();
		// 	}else{
		// 		setTimeout(function(){
		// 			checkImages();
		// 		}, 1);
		// 	}
		// }

		function loop () {
			requestAnimFrame(function() {
				loop();
			});
			render();
			update();
		}
		// initImages(game.paths);
		init();
	});
// })();

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame||
			window.webkitRequestAnimationFrame||
			window.mozRequestAnimationFrame||
			window.oRequestAnimationFrame||
			window.msRequestAnimationFrame||
			function (callback) {
				window.setTimeout(callback, 1000/30);
			};
})();

