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
	var Ship = function (game, pPoint) {
			var that           = this,
				textures       = [],
				position       = pPoint || new SR.Point(game.getWidth() / 2, game.getHeight() / 2),
				velocity       = SR.Point(),
				isDescending   = false,
				isAscending    = false,
				isRollingLeft  = false,
				isRollingRight = false,
				width          = 320,
				height         = 240,
				halfWidth      = width / 2,
				halfHeight     = height / 2,
				canvas         = document.createElement('canvas'),
				context        = canvas.getContext('2d'),
				speed          = 1,
				maxSpeed       = 25,
				drag           = 0.9,
				dAngle         = (Math.PI / 180) * 2,
				angle          = 0,
				i,
				totalFrames    = 30,
				framesLoaded   = 0,
				gameComponent  = new SR.GameComponent(),
				onFrameLoaded  = function () {
					framesLoaded += 1;
				};

			canvas.width = width;
			canvas.height = height;

			that.getAltitude = function () {
				return position.y;
			};

			for (i = 0; i < 10; i +=1) {
				textures[i] = new Image();
				textures[i].src = './img/recognizer/recognizer000'+i+'.png';
				textures[i].addEventListener('load', onFrameLoaded, false);
			}
			for (i = 10; i <= totalFrames; i +=1) {
				textures[i] = new Image();
				textures[i].src = './img/recognizer/recognizer00'+i+'.png';
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
			this.update = function (et, ef) {
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

			this.draw = function (c) {
				var dx = Math.floor((game.getHeight() - 60) / totalFrames),
					index;
				if (framesLoaded >= totalFrames) {
					index = Math.floor(position.y / dx);
					if (index < 0) {
						index = 0;
					} else if (index > totalFrames) {
						index = totalFrames;
					}
					context.clearRect(0, 0, width, height);
					context.save();
					context.translate(halfWidth, halfHeight);
					context.rotate(angle);
					context.drawImage(textures[index], -halfWidth, -halfHeight);
					context.globalCompositeOperation = 'source-atop';
					context.fillStyle = 'rgba(0, 0, 255, 0.3)';
					context.fillRect(-halfWidth, -halfHeight, width, height);
					context.restore();
					c.drawImage(canvas, position.x - halfWidth, position.y - halfHeight);
				} else {
					c.fillStyle = '#ffffff';
					c.fillText('Loading: '+framesLoaded+'/'+totalFrames, position.x, position.y);
				}
			};
		},
		Enemy = function (game, pPoint, pColor) {
			var that           = this,
				textures       = [],
				position       = pPoint || new SR.Point(game.getWidth() / 2, game.getHeight() / 2),
				color          = pColor || 'rgba(255, 0, 0, 0.3)',
				velocity       = SR.Point(),
				isDescending   = false,
				isAscending    = false,
				isRollingLeft  = false,
				isRollingRight = false,
				width          = 320,
				height         = 240,
				halfWidth      = width / 2,
				halfHeight     = height / 2,
				canvas         = document.createElement('canvas'),
				context        = canvas.getContext('2d'),
				speed          = 1,
				maxSpeed       = 25,
				drag           = 0.9,
				dAngle         = (Math.PI / 180) * 2,
				angle          = 0,
				i,
				totalFrames    = 30,
				framesLoaded   = 0,
				gameComponent  = new SR.GameComponent(),
				onFrameLoaded  = function () {
					framesLoaded += 1;
				};

			canvas.width = width;
			canvas.height = height;

			that.getAltitude = function () {
				return position.y;
			};

			for (i = 0; i < 10; i +=1) {
				textures[i] = new Image();
				textures[i].src = './img/recognizer/recognizer000'+i+'.png';
				textures[i].addEventListener('load', onFrameLoaded, false);
			}
			for (i = 10; i <= totalFrames; i +=1) {
				textures[i] = new Image();
				textures[i].src = './img/recognizer/recognizer00'+i+'.png';
				textures[i].addEventListener('load', onFrameLoaded, false);
			}

			document.body.addEventListener('keydown', function (e) {
				if (e.keyCode === 83) {
					isDescending = true; 
				}
				if (e.keyCode === 87) {
					isAscending = true;
				}
				if (e.keyCode === 65) {
					isRollingLeft = true;
				}
				if (e.keyCode === 68) {
					isRollingRight = true;
				}
			}, false);

			document.body.addEventListener('keyup', function (e) {
				if (e.keyCode === 83) {
					isDescending = false; 
				}
				if (e.keyCode === 87) {
					isAscending = false;
				}
				if (e.keyCode === 65) {
					isRollingLeft = false;
				}
				if (e.keyCode === 68) {
					isRollingRight = false;
				}
			}, false);

			/* et: elapsed time, ef: elapsed frames */
			this.update = function (et, ef) {
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

			this.draw = function (c) {
				var dx = Math.floor((game.getHeight() - 60) / totalFrames),
					index;
				if (framesLoaded >= totalFrames) {
					index = Math.floor(position.y / dx);
					if (index < 0) {
						index = 0;
					} else if (index > totalFrames) {
						index = totalFrames;
					}
					context.clearRect(0, 0, width, height);
					context.save();
					context.translate(halfWidth, halfHeight);
					context.rotate(angle);
					context.drawImage(textures[index], -halfWidth, -halfHeight);
					context.globalCompositeOperation = 'source-atop';
					context.fillStyle = color;
					context.fillRect(-halfWidth, -halfHeight, width, height);
					context.restore();
					c.drawImage(canvas, position.x - halfWidth, position.y - halfHeight);
				} else {
					c.fillStyle = '#ffffff';
					c.fillText('Loading: '+framesLoaded+'/'+totalFrames, position.x, position.y);
				}
			};
		},
		Grid = function (game) {
			var that = this,
				canvasWidth,
				canvasHeight,
				centerX,
				horizon,
				dx = 64,
				dy = 0.1,
				modifierX = 3,
				horizontalLines = [],
				timer = 0,
				spawnThreshold = 250;

			that.update = function (t, f) {
				var i, l;

				canvasWidth  = game.getWidth();
				canvasHeight = game.getHeight();
				centerX      = Math.floor(canvasWidth / 2);
				horizon      = Math.floor(canvasHeight / 2);
				timer += t;
				if (timer > spawnThreshold) {
					timer = 0;
					horizontalLines.push({
						'y' : horizon,
						'velocity' : 0
					});
				}
				l = horizontalLines.length;
				for (i = 0; i < l; i += 1) {
					if (horizontalLines[i]) {
						horizontalLines[i].velocity += f * dy;
						horizontalLines[i].y += horizontalLines[i].velocity;
						if (horizontalLines[i].y > canvasHeight) {
							horizontalLines.splice(i, 1);
						}
					}
				}
			};

			that.draw = function (c) {
				var i, j, l;

				// Style
				c.strokeStyle = '#fff';
				c.lineWidth = 2;

				// Vertical Lines
				c.beginPath();  
				c.moveTo(centerX, horizon);
				c.lineTo(centerX, canvasHeight);

				i = centerX;
				j = centerX;
				while ( i < canvasWidth) {
					i += dx;
					j += dx * modifierX;
					c.moveTo(i, horizon);
					c.lineTo(j, canvasHeight);
				}
				i = centerX;
				j = centerX;
				while (i > 0) {
					i -= dx;
					j -= dx * modifierX;
					c.moveTo(i, horizon);
					c.lineTo(j, canvasHeight);
				}

				// Horizontal lines
				c.moveTo(0, horizon);
				c.lineTo(canvasWidth, horizon);

				l = horizontalLines.length;
				for (i = 0; i < l; i += 1) {
					c.moveTo(0, horizontalLines[i].y);
					c.lineTo(canvasWidth, horizontalLines[i].y);
				}

				c.stroke();
			};
		},
		Target = function (game, pPosition) {
			var that = this,
				position = pPosition || new SR.Point(),
				radius = 1,
				dSpeed = 0.02
				speed = 0;

			that.update = function (t, f) {
				speed += f * dSpeed;
				radius += speed;
				if (radius > 100) {
					radius = 1;
					speed = 0;
					position.x = Math.random() * game.getWidth();
					position.y = game.getHeight() / 2;
				}
			};

			that.draw = function (c) {
				c.fillStyle = '#fff';
				c.beginPath();
				c.arc(position.x, position.y, radius, 0, Math.PI * 2);
				c.closePath();
				c.fill();
			};
		};



	// Initializing and playing game when window has loaded
	window.addEventListener('load', function () {
		var game = new SR.Game(),
			fps  = 0,
			grid,
			ship,
			enemyA,
			target;

		// game.init(539, 299);
		game.init();
		grid = new Grid(game);
		ship = new Ship(game);
		enemyA = new Enemy(game, new SR.Point(game.getWidth() / 2, 100));
		// target = new Target(game, new SR.Point(game.getWidth() / 2, game.getHeight() / 2));
		

		game.update = function (t, f) {
			grid.update(t, f);
			// target.update(t, f);
			enemyA.update(t, f);
			ship.update(t, f);
			fps = Math.floor(1000 / t);
		};

		game.draw = function (c) {
			grid.draw(c);
			// target.draw(c);

			if (enemyA.getAltitude() > ship.getAltitude()) {
				ship.draw(c);
				enemyA.draw(c);
			} else {
				enemyA.draw(c);
				ship.draw(c);
			}

			c.fillStyle = '#ffffff';
			c.font = 'Bold 12px sans-serif';
			c.fillText("FPS: " + fps, 10, 20);
		};
	}, false);

}(this, this.document, this.SUBRISE));
