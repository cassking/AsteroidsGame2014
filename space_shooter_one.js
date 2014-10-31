

/*INITIALIZE THE GAME AND STARTS IT*/

var game = new Game();
function init() {
	if(game.init())
		game.start();
}




/**
* Define an object to hold all our images for the game so images
* are only ever created once. This type of object is known as as
* a singleton
*/
/*(bsed on tutorial from http://blog.sklambert.com/html5-canvas-game-panning-a-background/)
//create one object to hold our images, so allows to reuse one image w/o having to create manyrr*/
var imageRepository = new function() {
	//define images
	this.empty = null;
this.background = new Image();

//set images source

this.background.src = "imgs/bg.png";

}


/*BASE OBJECT
/* create a DRAWABle Object which will be the base class for
* all drawable objecst in this game. Sets up default variables
* that all child objects will inherit, as well as the default functions
*/

function Drawable () {

	this.init = function(x, y ) {
		//default variables
		this.x = x;
		this.y = y;
	}

	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;


	//Define abstarct function to be implemented in child objects

	this.draw = function() {
	};



}

/*BACKGROUND OBJECT
/*this creates the BACKGROUND OBJECT which will become a child of
/* the DRAWABLE object. the background is drawn on the "background"
/*canvas and creates the illusing of moving by panning the image*/


function Background() {
	this.speed = 1; //redefine speed of the bg for panning..1 pixel per frame
	
	//implement abstract function
	this.draw function() {

		//pan background
		this.y += this.speed;
		this.context.drawImage(imageRepository.background, this.x, this.y);


		//draw another imagea t the top edge of the first image

		this.context.drawImage(imageRepository.background, this.x, this.y - this.canvasHeight);

		//if the image scrolled off the screeen, reset it
		if (this.y >= this.canvasHeight)
		this.y = 0;

	};


}

//set bacground to inherirt properties from Drawable
Background.prototype = new Drawable();


/*THE GAME OBJECT
/*creates the Game object which will hold all objectws and data for
/*the game */


function Game() {

/* gets canvas information and context and sets up all game onjects
/*returns TRUE if the canvas is supported and FALSE if it is not.
/* this is to stop the animation script from constantly
/* running on older browasers*/



this.init = function() {


	//get the canvas element
	this.bgCanvas = document.getElementById('background');

	//test to see if canvas is supported
	if (this.bgCanvas.getContext) {
		this.bgContext = this.bgCanvas.getContext('2d');

		//initialize objects to contain their context and canvas informarion
		Background.prototype.context = this.bgContext;
		Background.prototype.canvasWidth = this.bgCanvas.width;
		Background.prototype.canvasHeight = this.bgCanvas.height;

		//Inititialzie the background object
		this.background = new Background();
		this.background.init(0,0);//set draw point to 0, 0
		return true;
	} else {
		return false;
	}

	};

	//start the ANIMATION LOOP
	this.start = function() {
		animate();
	};
}

/*THE ANIMATION LOOP
/* calls the requestAnimationFrame shim to optimize
/* the game loop and draws all game objects
/* this fucntion must be GLOBAL anc cannot be withing an object
*/
function animate() {


	requestAnimationFrame( animate );
	game.background.draw();
}

/*requestAnim shim layer by Paul Irish
/*finds the first API that works to optimize the animaton loop,
/* otherwise defautls to setTimeout()
*/

window.requestAnimationFrame = (function() {

	return window.requestAnimationFrame   ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};

}) ();





