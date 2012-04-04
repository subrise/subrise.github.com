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
		// Defining classes
		Ship = function () {
			var texture = new Image(),
				imagesLoaded = false,
				position = SR.Point(),
				velocity = SR.Point(),
				isDescending   = false,
				isAscending    = false,
				isRollingLeft  = false,
				isRollingRight = false,
				width  = 246,
				height = 70,
				halfWidth = width / 2,
				halfHeight = height / 2,
				speed  = 1,
				maxSpeed = 25,
				drag = 0.9;

			texture.src = './img/spaceship_top_view.png';
			texture.addEventListener('load', function () {
				imagesLoaded = true;
			}, false);

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

			this.gameComponent.update = function (e) {
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
					}
				} else if (isRollingRight && ! isRollingLeft) {
					if (velocity.x < maxSpeed) {
						velocity.x += speed;
					}
				} else {
					velocity.x *= drag;
				}

				position.x += velocity.x;
				position.y += velocity.y;

				// Set boundaries, so ship won't fly of screen
				if (position.x < 0) {
					position.x = 0;
				} else if (position.x > 539) {
					position.x = 539;
				} 
				if (position.y < 0) {
					position.y = 0;
				} else if (position.y > 299) {
					position.y = 299;
				}
			};

			this.gameComponent.draw = function (c) {
				if (imagesLoaded) {
					c.drawImage(texture, position.x - halfWidth, position.y - halfHeight);
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



	// Initializing and playing game when window has loaded
	window.addEventListener('load', function () {
		game.init(539, 299);
		ship = new Ship();
		game.addGameComponent(ship.gameComponent);
		document.body.addEventListener('keydown', onKeyDown, false);
		document.body.addEventListener('keyup', onKeyUp, false);
	}, false);

}(this, this.document, this.SUBRISE));