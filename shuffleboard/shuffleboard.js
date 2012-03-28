/* Author: Sammy Hubner
 * Description: Digital shuffleboard in the making
 *
 * Depends on the Subrise JavaScript Library and Modernizr
*/

(function (window, Subrise, Modernizr) {
	'use strict';
	var game = new Subrise.Game(),
		stones = [],
		shove = [],
		stoneIndex = -1, // holds the index of the stone you are moving
		Stone = function (pX, pY) {
			var x = pX,
				y = pY,
				angle = Subrise.degToRad(-90),
				radius = 25,
				isShuffeling = false,
				speed,
				bounceX = 1,
				bounceY = 1,
				friction = 0.97,
				velocity = {'x': 1, 'y': 1};

			this.getX = function () {
				return x;
			};
			this.getY = function () {
				return y;
			};
			this.getRadius = function () {
				return radius;
			};
			this.setPosition = function (pos) {
				x = pos.x;
				y = pos.y;
				isShuffeling = false;
			};
			this.shove = function (pAngle, pSpeed) {
				isShuffeling = true;
				angle = pAngle;
				speed = pSpeed;
				bounceX = 1;
				bounceY = 1;
			};
			this.horBounce = function () {
				bounceX *= -1;
			};
			this.verBounce = function () {
				bounceY *= -1;
			};
			this.update = function (e) {
				if (isShuffeling) {
					speed *= friction;
					velocity.x = Math.cos(angle) * speed * bounceX * e;
					velocity.y = Math.sin(angle) * speed * bounceY * e;
					
					//velocity.x *= bounceX * friction * e;
					//velocity.y *= bounceY * friction * e;
					x += velocity.x;
					y += velocity.y;
				}
				if (x - radius < 0) {
					x = 0 + radius;
					bounceX *= -1;
				}
				if (x + radius> window.innerWidth) {
					x = window.innerWidth - radius;
					bounceX *= -1;
				}
				if (y - radius < 0) {
					y = 0 + radius;
					bounceY *= -1;
				}
				if (y + radius> window.innerHeight) {
					y = window.innerHeight - radius;
					bounceY *= -1;
				}
			};
			this.draw = function (c) {
				c.lineWidth = 2;
				c.fillStyle = '#444';
				c.strokeStyle = '#000';
				c.beginPath();
				c.arc(x, y, radius, 0, Math.PI * 2, false);
				c.fill();
				c.stroke();
				c.beginPath();
				c.arc(x, y, radius - 10, 0, Math.PI * 2, false);
				c.stroke();
			};
		},

		// Mouse events
		onMouseDown = function (e) {
			var i, distance;
			// check if you are clicking on a stone
			for (i = 0; i < stones.length; i += 1) {
				distance = Subrise.getDistance(stones[i].getX(), stones[i].getY(), e.clientX, e.clientY);
				if (distance < stones[i].getRadius()) {
					stoneIndex = i;
					stones[i].setPosition({'x': e.clientX, 'y': e.clientY});
					// register the shove
					shove = [];
					shove.push({timestamp:new Date(), 'x': e.clientX, 'y': e.clientY});
					return;
				}
			}
		},
		onMouseMove = function (e) {
			if (stoneIndex >= 0) {
				stones[stoneIndex].setPosition({'x': e.clientX, 'y': e.clientY});
				if (shove.length > 5) {
					shove.splice(0, 1);
				}
				shove.push({timestamp:new Date().getTime(), 'x': e.clientX, 'y': e.clientY});
			}
		},
		onMouseUp = function (e) {
			var x1, y1, x2, y2, l, angle, distance, time;
			
			l = shove.length;
			if (l > 1) {
				x1 = shove[0].x;
				y1 = shove[0].y;
				x2 = shove[l-1].x;
				y2 = shove[l-1].y;

				angle = Math.atan2(y2 - y1, x2 - x1);
				distance = Subrise.getDistance(x1, y1, x2, y2);
				time = shove[l-1].timestamp - shove[0].timestamp;

				stones[stoneIndex].shove(angle, distance / time);
			}

			stoneIndex = -1;
		},
		// Touch events
		playerTouchId = -1,
		onTouchStart = function (e) {
			var i, j, touch, distance;
			
			for (i = 0; i < e.changedTouches.length; i += 1) {
				touch = e.changedTouches[i];
				if (playerTouchId < 0) {
					// check if you are clicking on a stone
					for (j = 0; j < stones.length; j += 1) {
						distance = Subrise.getDistance(stones[j].getX(), stones[j].getY(), touch.clientX, touch.clientY);

						if (distance < stones[j].getRadius()) {
							stoneIndex = j;
							stones[j].setPosition({'x': touch.clientX, 'y': touch.clientY});
							playerTouchId = touch.identifier;
							// register the shove
							shove = [];
							shove.push({timestamp:new Date(), 'x': touch.clientX, 'y': touch.clientY});
							return;
						}
					}
				}
			}
		},
		onTouchMove = function (e) {
			var i, touch;
			e.preventDefault();
			for (i = 0; i < e.touches.length; i += 1) {
				touch = e.touches[i];
				if (playerTouchId === touch.identifier) {
					if (stoneIndex >= 0) {
						stones[stoneIndex].setPosition({'x': touch.clientX, 'y': touch.clientY});
						if (shove.length > 5) {
							shove.splice(0, 1);
						}
						shove.push({timestamp:new Date().getTime(), 'x': touch.clientX, 'y': touch.clientY});
					}
				}
			}
		},
		onTouchEnd = function (e) {
			var i, touch, x1, y1, x2, y2, l, angle, distance, time;
			for (i = 0; i < e.changedTouches.length; i += 1) {
				touch = e.changedTouches[i];
				if (playerTouchId === touch.identifier) {
					playerTouchId = -1;

					l = shove.length;
					if (l > 1) {
						x1 = shove[0].x;
						y1 = shove[0].y;
						x2 = shove[l-1].x;
						y2 = shove[l-1].y;

						angle = Math.atan2(y2 - y1, x2 - x1);
						distance = Subrise.getDistance(x1, y1, x2, y2);
						time = shove[l-1].timestamp - shove[0].timestamp;

						stones[stoneIndex].shove(angle, distance / time);
					}
					stoneIndex = -1;
				}
			}
		};

	game.resetCanvas = function () {
	};
	game.update = function (e) {
		var i;
		for (i = 0; i < stones.length; i += 1) {
			stones[i].update(e);
		}
	};

	game.draw = function (c) {
		var i;
		for (i = 0; i < stones.length; i += 1) {
			stones[i].draw(c);
		}
	};

	window.onload = function () {
		if (!Modernizr.canvas) {
			alert('Your browser failed to support HTML 5 Canvas, please try a modern browser like Chrome, Safari or Firefox.');
		}

		game.init();

		// Setup game elements
		stones.push(new Stone(window.innerWidth / 2, window.innerHeight / 2));
		// stones.push(new Stone(window.innerWidth / 2 - 70, window.innerHeight / 2));
		// stones.push(new Stone(window.innerWidth / 2 - 140, window.innerHeight / 2));

		// Setup Event Handlers
		if (Modernizr.touch) {
			window.addEventListener('touchstart', onTouchStart, false);
			window.addEventListener('touchmove',  onTouchMove,  false);
			window.addEventListener('touchend',   onTouchEnd,   false);
		} else {
			window.addEventListener('mousemove', onMouseMove, false);
			window.addEventListener('mousedown', onMouseDown, false);
			window.addEventListener('mouseup',   onMouseUp,   false);
		}

		game.run();
	};

	
}(this, this.Subrise, this.Modernizr));