/*!
 * Subrise TRON
 *
 * Our TRON themed game.
 *
 * Designed by Jeffrey Sapulette
 * Developed by Sammy Hubner
 * Start Date: tuesday March 27 2012 8:48 PM
 */
(function (window, document, SR, undefined) {
	// Defining classes
	var Ship = function (game, pPosition) {
			var textures       = [],
				position       = pPosition || SR.Point(),
				velocity       = SR.Point(),
				isDescending   = false,
				isAscending    = false,
				isRollingLeft  = false,
				isRollingRight = false,
				width          = 320,
				height         = 240,
				halfWidth      = width / 2,
				halfHeight     = height / 2,
				speed          = 1,
				maxSpeed       = 25,
				drag           = 0.9,
				dAngle         = (Math.PI / 180) * 2,
				angle          = 0,
				i,
				totalFrames    = 60,
				framesLoaded   = 0,
				gameComponent  = new SR.GameComponent(),
				onFrameLoaded  = function () {
					framesLoaded += 1;
				};

			for (i = 0; i < 10; i +=1) {
				textures[i] = new Image();
				textures[i].src = './img/render/spaceship000'+i+'.png';
				textures[i].addEventListener('load', onFrameLoaded, false);
			}
			for (i = 10; i < 61; i +=1) {
				textures[i] = new Image();
				textures[i].src = './img/render/spaceship00'+i+'.png';
				textures[i].addEventListener('load', onFrameLoaded, false);
			}

			document.body.addEventListener('keydown', function (e) {
				if (e.keyCode === 40) {
					isDescending = true; 
				}
				if (e.keyCode === 38) {
					isAscending = true;
				}
				if (e.keyCode === 37) {
					isRollingLeft = true;
				}
				if (e.keyCode === 39) {
					isRollingRight = true;
				}
			}, false);

			document.body.addEventListener('keyup', function (e) {
				if (e.keyCode === 40) {
					isDescending = false; 
				}
				if (e.keyCode === 38) {
					isAscending = false;
				}
				if (e.keyCode === 37) {
					isRollingLeft = false;
				}
				if (e.keyCode === 39) {
					isRollingRight = false;
				}
			}, false);

			/* et: elapsed time, ef: elapsed frames */
			gameComponent.update = function (et, ef) {
				if (isAscending && ! isDescending) {
					if (velocity.y > maxSpeed * -1) {
						velocity.y -= speed;
					}
				} else if (isDescending && ! isAscending) {
					if (velocity.y < maxSpeed) {
						velocity.y += speed;
					}
				} else {
					velocity.y *= drag;
				}

				if (isRollingLeft && ! isRollingRight) {
					if (velocity.x > maxSpeed * -1) {
						velocity.x -= speed;
						if (angle > -1 * (Math.PI / 2)) {
							angle -= dAngle * ef;
						}
					}
				} else if (isRollingRight && ! isRollingLeft) {
					if (velocity.x < maxSpeed) {
						velocity.x += speed;
						if (angle < Math.PI / 2) {
							angle += dAngle * ef;
						}
					}
				} else {
					velocity.x *= drag;
					angle *= drag;
				}

				if (Math.abs(angle) > Math.PI * 2) {
					angle = 0;
				}

				position.x += velocity.x * ef;
				position.y += velocity.y * ef;

				// Set boundaries, so ship won't fly of screen
				if (position.x < 0) {
					position.x = 0;
				} else if (position.x > game.getWidth()) {
					position.x = game.getWidth();
				} 
				if (position.y < 50) {
					position.y = 50;
				} else if (position.y > game.getHeight() - 60) {
					position.y = game.getHeight() - 60;
				}
			};

			gameComponent.draw = function (c) {
				var dx = Math.floor(game.getHeight() / 60);
				if (framesLoaded >= totalFrames) {
					c.save();
					c.translate(position.x, position.y);
					c.rotate(angle);
					c.drawImage(textures[Math.floor(position.y / dx)], -halfWidth, -halfHeight);
					c.restore();
				} else {
					c.fillText('Loading: '+framesLoaded+'/'+totalFrames, position.x, position.y);
				}
			};

			game.addGameComponent(gameComponent);
		},
		Rock = function () {
			this.gameComponent = new SR.GameComponent();
		};



	// Initializing and playing game when window has loaded
	window.addEventListener('load', function () {
		var game = new SR.Game(),
			fps  = 0,
			ship;

		game.update = function (e) {
			fps = Math.floor(100 / e);
		};

		game.draw = function (c) {
			c.font = 'Bold 12px sans-serif';
			c.fillText("FPS: " + fps, 10, 20);
		};

		// game.init(539, 299);
		game.init();
		ship = new Ship(game, new SR.Point(270, 150));
	}, false);

}(this, this.document, this.SUBRISE));
