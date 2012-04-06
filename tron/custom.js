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
	var game = new SR.Game(),
		fps = 0,
		// Defining classes
		Ship = function (pPosition) {
			var texture = new Image(),
				textures       = [],
				imagesLoaded   = false,
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
				degree         = Math.PI / 180,
				angle          = 0,
				i,
				totalFrames    = 60,
				framesLoaded   = 0,
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
			// Todo check when images have loaded
			imagesLoaded = true;

			this.gameComponent = new SR.GameComponent();

			this.onKeyDown = function (e) {
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
			};

			this.onKeyUp = function (e) {
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
			};

			/* et: elapsed time, ef: elapsed frames */
			this.gameComponent.update = function (et, ef) {
				if (isAscending && ! isDescending) {
					if (velocity.y > maxSpeed * -1) {
						velocity.y -= speed * ef;
					}
				} else if (isDescending && ! isAscending) {
					if (velocity.y < maxSpeed) {
						velocity.y += speed * ef;
					}
				} else {
					velocity.y *= drag * ef;
				}
				if (isRollingLeft && ! isRollingRight) {
					if (velocity.x > maxSpeed * -1) {
						velocity.x -= speed * ef;
						angle -= 2 * degree * ef;
					}
				} else if (isRollingRight && ! isRollingLeft) {
					if (velocity.x < maxSpeed) {
						velocity.x += speed * ef;
						angle += 2 * degree * ef;
					}
				} else {
					velocity.x *= drag * ef;
					angle *= drag * ef;
				}

				position.x += velocity.x;
				position.y += velocity.y;

				// Set boundaries, so ship won't fly of screen
				if (position.x < 0) {
					position.x = 0;
				} else if (position.x > 539) {
					position.x = 539;
				} 
				if (position.y < 50) {
					position.y = 50;
				} else if (position.y > 220) {
					position.y = 220;
				}
			};

			this.gameComponent.draw = function (c) {
				var dx = Math.floor(299 / 60);
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
		},
		Rock = function () {
			this.gameComponent = new SR.GameComponent();
		},
		// Declaring game variables
		ship,
		onKeyDown = function (e) {
			ship.onKeyDown(e);
		},
		onKeyUp = function (e) {
			ship.onKeyUp(e);
		};

		game.update = function (e) {
			fps = Math.floor(1000 / e);
		};

		game.draw = function (c) {
			c.font = 'Bold 12px sans-serif';
			c.fillText("FPS: " + fps, 10, 10);
		};


	// Initializing and playing game when window has loaded
	window.addEventListener('load', function () {
		game.init(539, 299);
		ship = new Ship(new SR.Point(270, 150));
		game.addGameComponent(ship.gameComponent);
		document.body.addEventListener('keydown', onKeyDown, false);
		document.body.addEventListener('keyup', onKeyUp, false);
	}, false);

}(this, this.document, this.SUBRISE));
