/*!
 * Subrise JavaScript Library v1.0.3 beta
 * http://subrise.com/
 *
 * Copyright 2012, Subrise Games
 *
 * Game: Our own JavaScript Library, which holds some handy classes
 *       for building simple web games.
 *
 * Author: Sammy Hubner
 * Date: November 27 2011
 * Last modified: April 9 2012
 */
(function (window, document, undefined) {
	'use strict';
	var version = '1.0.3 beta',
		requestAnimFrame = (function () {
			return window.requestAnimationFrame    ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				window.oRequestAnimationFrame      ||
				window.msRequestAnimationFrame     ||
				function (callback, element) {
					window.setTimeout(callback, 1000 / 60);
				};
		}()),
		SUBRISE = {};

	SUBRISE.getVersion = function () {
		return version;
	};

	SUBRISE.getDistance = function (x1, y1, x2, y2) {
		var dx = x1 - x2,
			dy = y1 - y2;

		return Math.sqrt(dx * dx + dy * dy);
	};

	SUBRISE.degToRad = function (deg) {
		return deg * (Math.PI / 180);
	};

	SUBRISE.radToDeg = function (rad) {
		return rad * (180 / Math.PI);
	};

	SUBRISE.Game = function () {
		var prevTime = new Date(),
			canvas,
			canvasWidth,
			canvasHeight,
			fullScreen = true,
			context,
			gameComponents = [],
			that = this,
			_resetCanvas = function () {
				console.log('reset');
				if (fullScreen) {
					canvasWidth  = window.innerWidth;
					canvasHeight = window.innerHeight;
				}
				canvas.width  = canvasWidth;
				canvas.height = canvasHeight;
				that.resetCanvas();
			},
			run = function () {
				var currTime, elapsedTime, i, l, elapsedFrames;
				requestAnimFrame(run, canvas);

				// Determine the miliseconds elapsed inbetween frames
				currTime      = new Date();
				elapsedTime   = currTime - prevTime; // Elapsed miliseconds
				elapsedFrames = elapsedTime / 17;   // Elapsed frames if we want to play 60 fps
				prevTime      = currTime;

				// Update
				l = gameComponents.length;
				for (i = 0; i < l; i += 1) {
					gameComponents[i].update(elapsedTime, elapsedFrames);
				}
				that.update(elapsedTime, elapsedFrames);

				// Draws only if we were able to retrieve a context
				if (context) {
					context.setTransform(1, 0, 0, 1, 0, 0);
					context.clearRect(0, 0, window.innerWidth, window.innerHeight);
					for (i = 0; i < l; i += 1) {
						gameComponents[i].draw(context);
					}
					that.draw(context);
				}
			};

		// Setup the game canvas and insert it into the body, return false when browser doesn't support canvas.
		this.init = function (width, height) {
			if (width > 0) {
				fullScreen = false;
			}
			canvasWidth  = width  || window.innerWidth;
			canvasHeight = height || window.innerHeight;
			canvas = document.createElement('canvas');
			context = canvas.getContext('2d');
			if (!context) {
				return false;
			}

			canvas.id = 'gameCanvas';
			_resetCanvas();

			document.body.appendChild(canvas);
			window.addEventListener('orientationchange', _resetCanvas, false);
			window.addEventListener('resize', _resetCanvas, false);

			run();
			return true;
		};

		// Returns canvas width
		this.getWidth = function () {
			return canvasWidth;
		};

		// Returns canvas height
		this.getHeight = function () {
			return canvasHeight;
		};

		// Extend this when stage resizes
		this.resetCanvas = function () {};

		// Extend this
		this.update = function (time, frames) {};

		// Extend this
		this.draw = function (c) {};

		this.addGameComponent = function (gameComponent) {
			gameComponents.push(gameComponent);
		};
	};

	SUBRISE.GameComponent = function () {
		return {
			'update' : function (elapsedTime, elapsedFrames) {},
			'draw'   : function (context) {}
		};
	};

	SUBRISE.Point = function (x, y) {
		x = x || 0;
		y = y || 0;
		return {'x': x, 'y': y};
	};

	SUBRISE.Rectangle = function (pX, pY, pWidth, pHeight) {
		var x = pX || 0,
			y      = pY      || 0,
			width  = pWidth  || 100,
			height = pHeight || 100,
			that   = this,
			// cached variables
			xRange,
			yRange,
			midPoint;

		// The range from the center of the rectangle to the side edge
		this.getXRange = function () {
			if (xRange !== undefined) {
				return xRange;
			}
			xRange = width / 2;
			return xRange;
		};

		// The range from the center of the rectangle to the top edge
		this.getYRange = function () {
			if (yRange !== undefined) {
				return yRange;
			}
			yRange = height / 2;
			return yRange;
		};

		this.getMidPoint = function () {
			if (midPoint !== undefined) {
				return midPoint;
			}
			midPoint = new SUBRISE.Point(Math.floor(x + that.getXRange()), Math.floor(y + that.getYRange()));
			return midPoint;
		};

		this.getWidth = function () {
			return width;
		};

		this.getHeight = function () {
			return height;
		};

		// First checks if the two rectanlges aren't horizontally overlapping for an early opt out
		this.collidesWithRectangle = function (rectangle) {
			var thisMidPoint = that.getMidPoint(),
				rectMidPoint = rectangle.getMidPoint(),
				thisXRange   = that.getXRange(),
				rectXRange   = rectangle.getXRange(),
				thisYRange,
				rectYRange;

			if (Math.abs(thisMidPoint.x - rectMidPoint.x) > thisXRange + rectXRange) {
				return false;
			}

			thisYRange = that.getYRange();
			rectYRange = rectangle.getYRange();
			if (Math.abs(thisMidPoint.y - rectMidPoint.y) > thisYRange + rectYRange) {
				return false;
			}

			return true;
		};
	};

	window.SUBRISE = window.SR = SUBRISE;

}(this, this.document));
