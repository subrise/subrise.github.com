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
			this.gameComponent = new SR.GameComponent();

			this.gameComponent.update = function (e) {
			};

			this.gameComponent.draw = function (c) {
			};
		},
		Rock = function () {
			this.gameComponent = new SR.GameComponent();
		},
		// Declaring game variables
		ship;



	// Initializing and playing game when window has loaded
	window.addEventListener('load', function () {
		game.init(539, 299);
		ship = new Ship();
		game.addGameComponent(ship.gameComponent);
	}, false);

}(this, this.document, this.SUBRISE));