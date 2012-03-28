/* Author: Sammy Hubner
 * Description: Simple Asteroids game, to experiment with HTML 5 Canvas.
 *
 * Depends on the Subrise JavaScript Library and Modernizr
*/

(function (window, Subrise, Modernizr) {
	'use strict';
	var game = new Subrise.Game(),
		Bullet = function (pX, pY, pAngle) {
			var x = pX | 0,
				y = pY | 0,
				speed = 0.2,
				angle = pAngle,
				radius = 2,
				that = this;

			this.getX = function () {
				return x;
			};
			this.getY = function () {
				return y;
			};
			this.getRadius = function () {
				return radius;
			};
			// Checks if the bullet is still positioned on screen
			this.isLive = function () {
				if (x > window.innerWidth || x < 0 || y > window.innerHeight || y < 0) {
					return false;
				} else {
					return true;
				}
			};
			this.update = function (e) {
				if (angle !== undefined) {
					x += Math.cos(angle) * speed * e;
					y += Math.sin(angle) * speed * e;
				}
			};
			this.draw = function (c) {
				if (that.isLive) {
					c.setTransform(1, 0, 0, 1, 0, 0);
					c.strokeStyle = '#0f0';
					c.lineWidth = 2;
					c.beginPath();
					c.arc(x, y, radius, 0, Math.PI * 2, false);
					c.stroke();
				}
			};
		},
		bullets = [],
		score = 0,
		player = (function () {
			var Player = {},
				isAiming = false,
				position = {x: window.innerWidth / 2, y: window.innerHeight},
				crosshair = {x: 0, y: 0},
				angle = -90 * Math.PI / 180; // In radians

			Player.ammo = 6;

			Player.setCrosshair = function (pX, pY) {
				crosshair.x = pX | 0;
				crosshair.y = pY | 0;
				isAiming = true;
				angle = Math.atan2(crosshair.y - position.y, crosshair.x - position.x);
			};
			Player.stopAiming = function () {
				isAiming = false;
			};
			// Default position of the player is at the bottom of the screen centered.
			Player.setPosition = function (pX, pY) {
				position.x = pX | window.innerWidth / 2;
				position.y = pY | window.innerHeight;
			};
			Player.getPosition = function () {
				return position;
			};
			// Returns the shooting angle in radians
			Player.getAngle = function () {
				return angle;
			};
			Player.update = function (e) {};
			Player.draw = function (c) {
				// Draw base
				c.setTransform(1, 0, 0, 1, 0, 0);
				c.translate(position.x, position.y);
				c.rotate(angle);

				c.strokeStyle = '#0f0';
				c.fillStyle = '#0f0';
				c.lineWidth = 3;
				c.beginPath();
				c.arc(0, 0, 20, 0, Math.PI * 2, false);
				c.fill();
				c.beginPath();
				c.moveTo(0, 0);
				c.lineTo(25, 0);
				c.stroke();

				// Draw crosshair
				if (isAiming) {
					c.setTransform(1, 0, 0, 1, 0, 0);
					c.strokeStyle = '#f00';
					c.lineWidth = 3;
					c.beginPath();
					c.arc(crosshair.x, crosshair.y, 35, 0, Math.PI * 2, false);
					c.stroke();
					// The cross hairs
					c.strokeStyle = '#f00';
					c.lineWidth = 1;
					c.beginPath();
					c.moveTo(crosshair.x - 35, crosshair.y);
					c.lineTo(crosshair.x + 35, crosshair.y);
					c.stroke();
					c.beginPath();
					c.moveTo(crosshair.x, crosshair.y - 35);
					c.lineTo(crosshair.x, crosshair.y + 35);
					c.stroke();
				}
			};

			return Player;
		}()),
		Enemy = function (pX, pY) {
			var x = pX,
				y = pY | 0,
				radius = 20,
				speed = 0.05;
			this.getX = function () {
				return x;
			};
			this.getY = function () {
				return y;
			};
			this.getRadius = function () {
				return radius;
			};
			this.update = function (e) {
				y += e * speed;
			};
			this.draw = function (c) {
				c.setTransform(1, 0, 0, 1, 0, 0);
				c.fillStyle = '#0f0';
				c.beginPath();
				c.arc(x, y, radius, 0, Math.PI * 2, false);
				c.fill();
			};
		},
		enemies = [],
		enemySpawnTime = 3000, // Every second spawn an enemy
		enemySpawnTimer = 0,   // Counts the time till a new enemy will spawn

		// Mouse events
		onMouseMove = function (e) {
			player.setCrosshair(e.clientX, e.clientY);
		},
		onMouseDown = function (e) {
			var pos, angle, bullet;
			player.setCrosshair(e.clientX, e.clientY);

			if (bullets.length < player.ammo) {
				pos = player.getPosition();
				angle = player.getAngle();
				bullet = new Bullet(pos.x, pos.y, angle);
				bullets.push(bullet);
			}
		},

		// Touch events
		playerTouchId = -1,
		onTouchStart = function (e) {
			var i, touch;
			for (i = 0; i < e.changedTouches.length; i += 1) {
				touch = e.changedTouches[i];
				if (playerTouchId < 0) {
					playerTouchId = touch.identifier;
					player.setCrosshair(touch.clientX, touch.clientY);
				}
			}
		},
		onTouchMove = function (e) {
			var i, touch;
			e.preventDefault();
			for (i = 0; i < e.touches.length; i += 1) {
				touch = e.touches[i];
				if (playerTouchId === touch.identifier) {
					player.setCrosshair(touch.clientX, touch.clientY);
				}
			}
		},
		onTouchEnd = function (e) {
			var i, touch, pos, angle, bullet;
			for (i = 0; i < e.changedTouches.length; i += 1) {
				touch = e.changedTouches[i];
				if (playerTouchId === touch.identifier) {
					playerTouchId = -1;
					player.setCrosshair(touch.clientX, touch.clientY);
					if (bullets.length < player.ammo) {
						pos = player.getPosition();
						angle = player.getAngle();
						bullet = new Bullet(pos.x, pos.y, angle);
						bullets.push(bullet);
					}
					player.stopAiming();
				}
			}
		};

	game.resetCanvas = function () {
		player.setPosition();
	};
	game.update = function (e) {
		var i, j, bulletDistance;
		player.update(e);
		// Bullets
		for (i = 0; i < bullets.length; i += 1) {
			if (bullets[i].isLive()) {
				bullets[i].update(e);
			} else {
				bullets.splice(i, 1);
			}
		}
		// Enemies
		enemySpawnTimer += e;
		if (enemySpawnTimer > enemySpawnTime) {
			enemySpawnTimer = 0;
			enemies.push(new Enemy(Math.random() * window.innerWidth, 0));
		}
		for (i = 0; i < enemies.length; i += 1) {
			enemies[i].update(e);
			if (enemies[i].getY() > window.innerHeight + enemies[i].getRadius()) {
				enemies.splice(i, 1);
				score -= 1;
			}

			// check for collision with bullets
			for (j = 0; j < bullets.length; j += 1) {
				bulletDistance = Subrise.getDistance(enemies[i].getX(), enemies[i].getY(), bullets[j].getX(), bullets[j].getY());
				if (Math.abs(bulletDistance) < enemies[i].getRadius() + bullets[j].getRadius()) {
					enemies.splice(i, 1);
					bullets.splice(j, 1);
					score += 1;
				}
			}
		}
	};

	game.draw = function (c) {
		var i;
		for (i = 0; i < bullets.length; i += 1) {
			bullets[i].draw(c);
		}
		for (i = 0; i < enemies.length; i += 1) {
			enemies[i].draw(c);
		}
		c.setTransform(1, 0, 0, 1, 0, 0);
		c.fillStyle = '#0f0';
		c.font = '20px sans-serif';
		c.textAlign = 'left';
		c.fillText('AMMO ' + (player.ammo - bullets.length), window.innerWidth / 2 + 30, window.innerHeight - 3);
		c.textAlign = 'right';
		c.fillText('SCORE ' + score, window.innerWidth / 2 - 30, window.innerHeight - 3);
		player.draw(c);
	};

	window.onload = function () {
		if (!Modernizr.canvas) {
			alert('Your browser failed to support HTML 5 Canvas, please try a modern browser like Chrome, Safari or Firefox.');
		}

		game.init();

		// Setup Event Handlers
		if (Modernizr.touch) {
			window.addEventListener('touchstart', onTouchStart, false);
			window.addEventListener('touchmove',  onTouchMove,  false);
			window.addEventListener('touchend',   onTouchEnd,   false);
		} else {
			window.addEventListener('mousemove', onMouseMove, false);
			window.addEventListener('mousedown', onMouseDown, false);
		}

		game.run();
	};

	
}(this, this.Subrise, this.Modernizr));