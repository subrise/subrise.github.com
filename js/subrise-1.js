/*!
 * Subrise JavaScript Library v1.0 beta
 * http://subrise.com/
 *
 * Copyright 2011, Subrise Games
 *
 * Game: Simple Full Canvas Game Framework, which setups a gamecanvas and setup the gameloop.
 *       Use Modernizr to check if the browser support HTML 5 Canvas, before you use the Game object.
 *
 * Author: Sammy Hubner
 * Date: November 27 2011
 */

window.Subrise = (function (window, document) {
	'use strict';
	var version = '1.0 beta',
		requestAnimFrame = (function () {
		      return  window.requestAnimationFrame       || 
		              window.webkitRequestAnimationFrame || 
		              window.mozRequestAnimationFrame    || 
		              window.oRequestAnimationFrame      || 
		              window.msRequestAnimationFrame     || 
		              function(/* function */ callback, /* DOMElement */ element){
		                window.setTimeout(callback, 1000 / 60);
		              };
		}()),

		Subrise = {};

	Subrise.getVersion = function () {
		return version;
	};

	Subrise.getDistance = function (x1, y1, x2, y2) {
		var dx = x1 - x2,
			dy = y1 - y2;

		return Math.sqrt(dx * dx + dy * dy);
	};

	Subrise.degToRad = function (deg) {
		return deg * (Math.PI / 180);
	};

	Subrise.radToDeg = function (rad) {
		return rad * (180 / Math.PI);
	};

	Subrise.Game = function () {
		var prevTime = new Date(),
			canvas,
			context,
			that = this,
			_resetCanvas = function () {
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
				that.resetCanvas();
			};

		// Setup the game canvas and insert it into the body, return false when browser doesn't support canvas.
		that.init = function () {
			canvas = document.createElement('canvas');
			context = canvas.getContext('2d');
			if (!context) {
				return false;
			}

			canvas.id = 'game_canvas';
			canvas.style.position = 'fixed';
			_resetCanvas();

			document.body.appendChild(canvas);
			window.onorientationchange = _resetCanvas;  
			window.onresize = _resetCanvas;
			return true;
		};

		// Extend this when stage resizes
		that.resetCanvas = function () {};

		// Extend this
		that.update = function (e) {};

		// Extend this
		that.draw = function (c) {};

		// Please don't extend this. TODO: find out how I can make this read only
		that.run = function () {
			requestAnimFrame(that.run, canvas);

			// Determine the miliseconds elapsed inbetween frames
			var currTime = new Date(),
				elapsed = currTime - prevTime;
			prevTime = currTime;

			// Update
			that.update(elapsed);

			// Draws only if we were able to retrieve a context
			if (context) {
				context.setTransform(1, 0, 0, 1, 0, 0);
				context.clearRect(0, 0, window.innerWidth, window.innerHeight);
				that.draw(context);
			}
		};
	};

	return Subrise;

}(this, this.document));