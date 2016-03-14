// (function(){
			
	$(document).ready(function(){
		var game = {};

		game.width = 700;
		game.height = 750;

		game.contextBackground = $("#backgroundCanvas")[0].getContext("2d");
		game.contextPlayer = $("#playerCanvas")[0].getContext("2d");
		game.contextEnemy = $("#enemyCanvas")[0].getContext("2d");
		game.contextCoins = $("#coinsCanvas")[0].getContext("2d");

		game.coins = [];
		game.keys = [];

		game.paths = ['player.jpg'];
		game.images = [];
		game.doneImages = 0;
		game.requiredImages = 0;

		game.enemy = {
			array: [],
			speed: 4,
			width: 100,
			spawn: true,
			prevX: 250
		}

		game.coins = {
			array: [],
			speed: 4,
			radius: 30,
			spawn: true,
			prevX: 150
		}

		game.player = {
			x: 300,
			y: game.height - 110,
			width: 100,
			height: 100,
			speed: 8,
			life: true,
			rendered: false
		}

		game.spawnSpots = {
			h: 1,

		}

		$(document).keydown(function(e){
			game.keys[e.keyCode ? e.keyCode : e.which] = true;
		});

		$(document).keyup(function(e){
			delete game.keys[e.keyCode ? e.keyCode : e.which];
		});

		function init () {
			loop();
		}

		function update () {
			if (!game.player.life) {
				game.player.life = false;
			} else {
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
				if (game.enemy.spawn == true) {
					setTimeout(function () {
						// var x = Math.floor(Math.random()*(700 - game.enemy.width) + 1);
						var x = spawnSpot(game.enemy.prevX);
						// console.log(x);
						game.enemy.prevX = x;
						var enemyArray = [[x,-game.enemy.width],[x + game.enemy.width,-game.enemy.width],[x + game.enemy.width,-game.enemy.width + game.enemy.width],[x,-game.enemy.width + game.enemy.width]];
						game.enemy.array.push(enemyArray);
						game.enemy.spawn = true;
					}, 1000);
					game.enemy.spawn = false;
				}
				if (game.coins.spawn == true) {
					setTimeout(function () {
						// var x = Math.floor(Math.random()*(700 - game.coins.radius) + 5);
						var x = spawnSpot(game.coins.prevX);
						game.coins.prevX = x;
						var coinsArray = [x, -1 * game.coins.radius, game.coins.radius];
						game.coins.array.push(coinsArray);
						game.coins.spawn = true;
					}, 400);
						game.coins.spawn = false;

				}
				if(game.coins.array.length > 0) {
					var temp =[];
					for(i in game.coins.array) {
						var coinsArray = game.coins.array[i];
							coinsArray[1] += game.coins.speed;
						if (coinsArray[1] + game.coins.radius > game.height + (game.coins.radius * 2)) {
							temp.push(i);
						}
					}
					for(i in temp){
						game.coins.array.splice(temp[i],1);
					}
				}
				if(game.enemy.array.length > 0) {
					var temp = [];
					player = {
						x: game.player.x,
						y: game.player.y,
						width: game.player.width
					}
					for (i in game.enemy.array){
						var enemyArray = game.enemy.array[i];
						for(y in enemyArray){

							enemyArray[y][1] += game.enemy.speed;
						}
						if (enemyArray[y][1] > game.height + game.enemy.width) {
							temp.push(i);
						}
						enemy = {
							x: game.enemy.array[i][0][0],
							y: game.enemy.array[i][0][1],
							width: game.enemy.width
						}
						if(((player.x <= enemy.x && enemy.x <= player.x + player.width) || (player.x <= enemy.x + enemy.width && enemy.x + enemy.width <= player.x + player.width)) &&
							((player.y <= enemy.y && enemy.y <= player.y + player.width) || (player.y <= enemy.y + enemy.width && enemy.y + enemy.width <= player.y + player.width))) 
						{
							game.player.life = false;
						}
					}
					for (i in temp) {
						game.enemy.array.splice(temp[i],1);
					}
				}
			}
		}
		function drawEnemy (array, fillColor) {
			if (fillColor == undefined) {
				fillColor = "rgb(0,255,0)";
			}
				game.contextEnemy.beginPath();
				game.contextEnemy.moveTo(array[0][0],array[0][1]);
				for (var i = array.length - 1; i > 0; i--) {
					game.contextEnemy.lineTo(array[i][0],array[i][1]);
				}
				game.contextEnemy.closePath();
				game.contextEnemy.fillStyle = fillColor;
				game.contextEnemy.fill();
			
		}
		function drawCoin (x, y, radius) {
			startAngle = 0;
			endAngle = Math.PI*2;
			anticlockwise = true;
			color = "rgb(255,255,0)"
			game.contextCoins.beginPath();
			game.contextCoins.fillStyle = color;
	   		game.contextCoins.arc(x, y, radius, startAngle, endAngle, anticlockwise);
			game.contextCoins.closePath();
			game.contextCoins.fill();
		}
		function spawnSpot(d) {
			var f = Math.floor(Math.random()*100) + 100;
			a = 0;
			b = 150;
			c = 300;
			e = 450;
			r = Math.floor(Math.random()*10);
			if(r <= 2) {
				d = a;
			} else if (r >2 && r<= 4) {
				d = b;
			} else if ( r> 4 && r<= 6) {
				d = c;
			} else {
				d = e;
			}
			// console.log(r);
			if (d <= 50) {
				game.spawnSpots.h = 1;
			} else if (d >= 650) {
				game.spawnSpots.h = -1;
			}
			return d + f*game.spawnSpots.h;
		}
		function renderGame() {
			game.contextBackground.clearRect(0, 0, game.width, game.height);
			game.contextBackground.fillRect(0, 0, game.width, game.height);

			game.contextBackground.fillStyle = "rgb(255,165,0)";
			if(!game.player.rendered) {
				game.contextPlayer.fillStyle = "rgb(25,165,79)";
				game.contextPlayer.clearRect(0, 0, game.width, game.height);
				game.contextPlayer.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
				game.contextPlayer.clearRect(game.player.x + 5, game.player.y + 5, game.player.width - 10, game.player.height - 10);
				game.contextPlayer.fillRect(game.player.x + 10, game.player.y + 10, game.player.width - 20, game.player.height - 20);
				game.player.rendered = true;
			}
			game.contextEnemy.clearRect(0,0,700,750);
			game.contextCoins.clearRect(0,0,700,750);
			for(i in game.enemy.array) {
				drawEnemy(game.enemy.array[i], "rgb(120,120,0)");
			}
			for(i in game.coins.array) {
				drawCoin(game.coins.array[i][0],game.coins.array[i][1],game.coins.array[i][2]);
			}
		}
		function loop () {
			requestAnimFrame(function() {
				loop();
			});
			renderGame();
			update();

		}
		init();
	});

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame||
			window.webkitRequestAnimationFrame||
			window.mozRequestAnimationFrame||
			window.oRequestAnimationFrame||
			window.msRequestAnimationFrame||
			function (callback) {
				window.setTimeout(callback, 1000/60);
			};
})();

