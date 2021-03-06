// (function(){
			
	$(document).ready(function(){
		var game = {};

		game.width = 700;
		game.height = 700;

		game.coins = [];
		game.keys = [];

		game.paths = ['player.jpg'];
		game.images = [];
		game.doneImages = 0;
		game.requiredImages = 0;
		game.lineWidth = 6;
		game.bonusCounter = 5;
		game.bonusTime  = 5;
		game.isPaused = false;
		coinPoints = 20;
		squerPoints = 10;

		game.menu = {
			width: 300,
			height: 150,
			x: 300,
			y: 300,
			rendered: false
		}

		game.powerUp = ["none", "guard"];

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
		$('#body').append('<canvas id="backgroundCanvas" width="700" height="750"></canvas><canvas id="playerCanvas" width="700" height="750"></canvas>	<canvas id="enemyCanvas" width="700" height="750"></canvas><canvas id="coinsCanvas" width="700" height="750"></canvas>	<canvas id="menuCanvas" width="1000" height="750"></canvas><div id="score">0</div>	<button id="left">LEFT</button>	<button id="space">SPACE</button>	<button id="right">RIGHT</button>');
		game.contextBackground = $("#backgroundCanvas")[0].getContext("2d");
		game.contextPlayer = $("#playerCanvas")[0].getContext("2d");
		game.contextEnemy = $("#enemyCanvas")[0].getContext("2d");
		game.contextCoins = $("#coinsCanvas")[0].getContext("2d");
		game.contextMenu = $("#menuCanvas")[0].getContext("2d");
		game.score = $("#score");
		game.keys = [];
		score = 0;
		timeOutFunc = [];

		game.enemy = {
			array: [],
			speed: 4,
			width: 70,
			spawn: true,
			prevX: 250
		}

		game.coins = {
			array: [],
			speed: 4,
			radius: 20,
			spawn: true,
			prevX: 150,
			collectable: false
		}

		game.player = {
			x: 300,
			y: game.height - 110,
			width: 70,
			height: 70,
			speed: 8,
			life: true,
			rendered: false,
			powerUp: 0
		}
			loop();
		}
		function addPowerUp(){
			var x = Math.floor(Math.random() * 10);
			if (x <= 2) {
				game.scroe+=20;
				return 1;
			} else {
				return 0;
			}
		}
		function update () {
			if (!game.player.life) {
				menu();
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
				$("#left").bind("touchstart mousedown", function(){
					game.keys = [];
					game.keys[37] = true;
				});
				$("#left, #right").bind("touchend mouseup", function(){
					game.keys = [];
				});
				$("#right").bind("touchstart mousedown", function(){
					game.keys = [];
					game.keys[39] = true;
				});
				$("#space").bind("tap click", function(){
					game.keys[32] = true;
				});
				if (game.keys[32] == true ) {
					game.keys = [];
				}
				if (game.enemy.spawn == true) {
					setTimeout(function () {
						var x = spawnSpot(game.enemy.prevX);
						game.enemy.prevX = x;
						var y = addPowerUp();
						game.enemy.width = Math.floor(Math.random()*10 + 40);
						var enemyArray = [[x,-game.enemy.width],[x + game.enemy.width,-game.enemy.width],[x + game.enemy.width,-game.enemy.width + game.enemy.width],
						[x,-game.enemy.width + game.enemy.width],y];
						game.enemy.array.push(enemyArray);
						game.enemy.spawn = true;
					}, 500);
					game.enemy.spawn = false;
				}
				if (game.coins.spawn == true) {
					setTimeout(function () {
						var x = spawnSpot(game.coins.prevX);
						game.coins.prevX = x;
						var y = addPowerUp();
						var coinsArray = [x, -1 * game.coins.radius, game.coins.radius,y];
						game.coins.array.push(coinsArray);
						game.coins.spawn = true;
					}, 300);
						game.coins.spawn = false;

				}
				if(game.coins.array.length > 0) {
					var temp =[];
					for(i in game.coins.array) {
						var coinsArray = game.coins.array[i];
							coinsArray[1] += game.coins.speed;
							coinObj = {
								x: coinsArray[0],
								y: coinsArray[1],
								radius: game.coins.radius,
								bonus: coinsArray[3]
							}
						if (RectCircleColliding(coinObj, game.player)){
							if(game.powerUp[game.player.powerUp] == "none") {
								if(coinObj.bonus == 0) {
									game.player.life = false;
								} else if (coinObj.bonus == 1) {
									// setTimeout(function(){
									// }, 4990);
									game.player.powerUp = 1;		
								}
							} else if (game.powerUp[game.player.powerUp] == "guard") {
								updateScore(score+=coinPoints);
								temp.push(i);
								clearInterval(timeOutFunc);
								timeOutFunc = setInterval(function(){ 
									game.player.powerUp = 0;
									// game.player.rendered = false;
									// clearTimeout(y);
								}, 5000);
								
							}
							if (coinsArray[1] + game.coins.radius > game.height + (game.coins.radius * 2)) {
								temp.push(i);
							}
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
						width: game.player.width,
						height: game.player.height
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
							width: game.enemy.width,
							height: game.enemy.height
						}
						if(((player.x <= enemy.x && enemy.x <= player.x + player.width) || (player.x <= enemy.x + enemy.width && enemy.x + enemy.width <= player.x + player.width)) &&
							((player.y <= enemy.y && enemy.y <= player.y + player.width) || (player.y <= enemy.y + enemy.width && enemy.y + enemy.width <= player.y + player.width))) 
						{
							if(game.powerUp[game.player.powerUp] == "none") {
								game.player.life = false;

							} else if (game.powerUp[game.player.powerUp] == "guard") {
								updateScore(score+=squerPoints);
								temp.push(i);
							}
						}
					}
					for (i in temp) {
						game.enemy.array.splice(temp[i],1);
					}
				}
			}
		}
		
		function menu() {
			if(!game.menu.rendered) {
				game.contextMenu.fillStyle = 'rgba(0,0,0,.2)';
				game.contextMenu.fillRect(game.width / 2 - (game.menu.width / 2), 0, game.menu.width * 2, game.height);
				game.contextMenu.fillStyle = "rgb(255,255,255)";
				game.contextMenu.font = "40px Verdana";
				game.contextMenu.textAlign = "center";
				game.contextMenu.fillText('GAME OVER',game.width / 2 + (game.menu.width / 2),game.menu.y + (game.menu.height / 2));
				game.contextMenu.font = "15px Verdana";
				game.contextMenu.textAlign = "center";
				game.contextMenu.fillText('PRESS "SPACE" TO RESTART',game.width / 2 + (game.menu.width / 2),game.menu.y + 40 + (game.menu.height / 2));
				setTimeout(function() {
					game.menu.rendered = true;
				}, 100);
			}
			if(game.keys[32]) {
					game.contextMenu.clearRect(game.width / 2 - (game.menu.width / 2) - 1, 0, game.menu.width * 2 + 2, game.height);
					game.player.life = true;
					game.menu.rendered = false;

					game.enemy = {
						array: [],
						speed: 4,
						width: 70,
						spawn: true,
						prevX: 250
					}

					game.coins = {
						array: [],
						speed: 4,
						radius: 20,
						spawn: true,
						prevX: 150,
						collectable: false
					}
					game.player = {
						x: 300,
						y: game.height - 110,
						width: 70,
						height: 70,
						speed: 8,
						life: true,
						rendered: false,
						powerUp: 0
					}
			}
		}
		function RectCircleColliding(circle,rect){
		    var distX = Math.abs(circle.x - rect.x-rect.width/2);
		    var distY = Math.abs(circle.y - rect.y-rect.height/2);

		    if (distX > (rect.width/2 + circle.radius)) { return false; }
		    if (distY > (rect.height/2 + circle.radius)) { return false; }

		    if (distX <= (rect.width/2)) { return true; } 
		    if (distY <= (rect.height/2)) { return true; }

		    var dx=distX-rect.width/2;
		    var dy=distY-rect.height/2;
		    return (dx*dx+dy*dy<=(circle.radius*circle.radius));
		}
		function drawEnemy (array, fillColor) {
				fillColor = "rgb(255, 0, 0)";
				strokeColor = "rgb(0, 0, 0)";
				game.contextEnemy.beginPath();
				game.contextEnemy.moveTo(array[0][0],array[0][1]);
				for (var i = array.length - 1; i > 0; i--) {
					game.contextEnemy.lineTo(array[i][0],array[i][1]);
				}
				game.contextEnemy.closePath();
				game.contextEnemy.fillStyle = fillColor;
				game.contextEnemy.fill();
				game.contextEnemy.clearRect(array[0][0] + game.lineWidth,array[0][1] + game.lineWidth, array[1][0] - array[0][0] - (game.lineWidth * 2), array[1][0] - array[0][0] - (game.lineWidth * 2));
				game.contextEnemy.beginPath();
				game.contextEnemy.rect(array[0][0],array[0][1],array[1][0] - array[0][0],array[1][0] - array[0][0]);
				game.contextEnemy.closePath();
				game.contextEnemy.lineWidth=game.lineWidth;
				game.contextEnemy.strokeStyle = strokeColor;
				game.contextEnemy.stroke();
		}
		function drawCoin (x, y, radius, bonus) {
			startAngle = 0;
			endAngle = Math.PI*2;
			anticlockwise = true;
			var color = "rgb(0,0,0)";
			var colorBonus = "rgb(120,0,0)";
			if (bonus == 0) {
				colorBonus = "rgb(255,0,0)";
			
			} else {
				colorBonus = "rgb(0,153,255)";
			}
			game.contextCoins.beginPath();
	   		game.contextCoins.arc(x, y, radius, startAngle, endAngle, anticlockwise);
			game.contextCoins.closePath();
			game.contextCoins.strokeStyle = color;
			game.contextCoins.lineWidth = game.lineWidth;
			game.contextCoins.stroke();
			game.contextCoins.beginPath();
	   		game.contextCoins.arc(x, y, radius - game.lineWidth, startAngle, endAngle, anticlockwise);
			game.contextCoins.closePath();
			game.contextCoins.strokeStyle = colorBonus;
			game.contextCoins.lineWidth = game.lineWidth / 2;
			game.contextCoins.stroke();
		}
		function spawnSpot(d) {
			var f = Math.floor(Math.random()*100) + 20;
			a = 0;
			b = 150;
			c = 300;
			e = 500;
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
				if(game.player.powerUp == 0) {
					game.contextPlayer.fillStyle = "rgb(25,165,79)";
				} else if (game.player.powerUp == 1) {
					game.contextPlayer.fillStyle = "rgb(255,0,0)";
				}
			// if(!game.player.rendered) {
				game.contextPlayer.clearRect(0, 0, game.width, game.height);
				game.contextPlayer.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
				game.contextPlayer.fillStyle = "rgb(25,165,79)";
				game.contextPlayer.clearRect(game.player.x + 5, game.player.y + 5, game.player.width - 10, game.player.height - 10);
				game.contextPlayer.fillRect(game.player.x + 10, game.player.y + 10, game.player.width - 20, game.player.height - 20);
				game.player.rendered = true;
				// }
			
			game.contextEnemy.clearRect(0,0,game.width,game.height);
			game.contextCoins.clearRect(0,0,game.width,game.height);
			for(i in game.enemy.array) {
				drawEnemy(game.enemy.array[i], "rgb(120,120,0)");
			}
			for(i in game.coins.array) {
				drawCoin(game.coins.array[i][0],game.coins.array[i][1],game.coins.array[i][2],game.coins.array[i][3]);
			}
		}
		function updateScore (score) {
			game.score.text(score);
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
				window.setTimeout(callback, 1000/30);
			};
})();

