

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
	this.spaceship = new Image();
	this.bullet = new Image();
	this.pumpkin = new Image();

	//ensure that ALL IMAGES HAVE LOADED before startig game
	var numImages = 3;
	var numLoaded = 0;
	function imageLoaded() {


		numLoaded++;
		if (numLoaded === numImages) {
			window.init();
		}
	}


this.background.onload = function() {
	imageLoaded();
}
this.spaceship.onload = function() {
	imageLoaded();
}
this.pumpkin.onload = function() {
	imageLoaded();
}
this.bullet.onload = function() {
	imageLoaded();
}
	//set images source

	this.background.src = "imgs/bg.png";
	this.spaceship.src = "imgs/pumpkin.png";
	this.pumpkin.src = "imgs/pumpkin.png";
	this.bullet.src = "imgs/bullet.png";

}


/*BASE OBJECT
/* create a DRAWABle Object which will be the base class for
* all drawable objecst in this game. Sets up default variables
* that all child objects will inherit, as well as the default functions
*/

function Drawable () {

	this.init = function(x, y, width, height ) {
		//default variables
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;


	//Define abstarct function to be implemented in child objects

	this.draw = function() {
	};
	this.move = function() {

	};



}

/*BACKGROUND OBJECT
/*this creates the BACKGROUND OBJECT which will become a child of
/* the DRAWABLE object. the background is drawn on the "background"
/*canvas and creates the illusing of moving by panning the image*/


function Background() {
	this.speed = 1; //redefine speed of the bg for panning..1 pixel per frame
	
	//implement abstract function
	this.draw = function() {

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



/**
 * Creates the Bullet object which the ship fires. The bullets are
 * drawn on the "main" canvas.
 */
function Bullet() {	
	this.alive = false; // Is true if the bullet is currently in use
	
	/*
	 * Sets the bullet values
	 */
	this.spawn = function(x, y, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.alive = true;
	};

	/*
	 * Uses a "drity rectangle" to erase the bullet and moves it.
	 * Returns true if the bullet moved off the screen, indicating that
	 * the bullet is ready to be cleared by the pool, otherwise draws
	 * the bullet.
	 */
	this.draw = function() {
		this.context.clearRect(this.x, this.y, this.width, this.height);
		this.y -= this.speed;
		if (this.y <= 0 - this.height) {
			return true;
		}
		else {
			this.context.drawImage(imageRepository.bullet, this.x, this.y);
		}
	};
	
	/*
	 * Resets the bullet values
	 */
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.alive = false;
	};
}
Bullet.prototype = new Drawable();


//create ship object to be used
function Ship() {
	this.speed = 3;//speed set to 3 pixels per frame
	this.bulletPool = new Pool(30);
	this.bulletPool.init();
	
	var fireRate = 15; //shoot once very 15 frames using counter to det. when it can shot
	var counter = 0;
	//THE SHIP HAS THREE METHODS
	//DRAW
	//MOVE
	//FIRE


	//DRAW
	this.draw = function() {
		this.context.drawImage(imageRepository.spaceship, this.x, this.y);
	};

	//MOVE
	this.move = function() {
		counter++;
		// Determine if the action is move action
		if (KEY_STATUS.left || KEY_STATUS.right ||
			KEY_STATUS.down || KEY_STATUS.up) {

			// The ship moved, so erase it's current image so it can
			// be redrawn in it's new location
			this.context.clearRect(this.x, this.y, this.width, this.height);

			// Update x and y according to the direction to move and
			// redraw the ship. Change the else if's to if statements
			// to have diagonal movement.
			if (KEY_STATUS.left) {
				this.x -= this.speed
				if (this.x <= 0) // Keep player within the screen
					this.x = 0;
			} else if (KEY_STATUS.right) {
				this.x += this.speed
				if (this.x >= this.canvasWidth - this.width)
					this.x = this.canvasWidth - this.width;
			} else if (KEY_STATUS.up) {
				this.y -= this.speed
				if (this.y <= this.canvasHeight/4*3)
					this.y = this.canvasHeight/4*3;
			} else if (KEY_STATUS.down) {
				this.y += this.speed
				if (this.y >= this.canvasHeight - this.height)
					this.y = this.canvasHeight - this.height;
			}
			// Finish by redrawing the ship
			this.draw();
		}
		if (KEY_STATUS.space && counter >= fireRate) {
			this.fire();
			counter = 0;
		}
	};

//FIRE
/* * Fires two bullets */ 
this.fire = function() { //getTwo() method to get two bullets at once, positions them above the gun
	this.bulletPool.getTwo(this.x+6, this.y, 3,
	 this.x+33, this.y, 3); 
}; 
} 
Ship.prototype = new Drawable(); 


//The code first creates a JSON object that holds the keycodes for each keyboard key
//It also creates an array of statuses of true/false so that we know when a key is pressed
//then creates the /onkeydown/ and /onkeyup events/ to trigger the key status change of a key.
//the keycodes when user presses a keyboard button

// The keycodes that will be mapped when a user presses a button.
// Original code by Doug McInnes
KEY_CODES = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
}

// Creates the array to hold the KEY_CODES and sets all their values
// to false. Checking true/flase is the quickest way to check status
// of a key press and which one was pressed when determining
// when to move and which direction.
KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[ KEY_CODES[ code ]] = false;
}
/**
 * Sets up the document to listen to onkeydown events (fired when
 * any key on the keyboard is pressed down). When a key is pressed,
 * it sets the appropriate direction to true to let us know which
 * key it was.
 */
document.onkeydown = function(e) {
  // Firefox and opera use charCode instead of keyCode to
  // return which key was pressed.
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
}
/**
 * Sets up the document to listen to ownkeyup events (fired when
 * any key on the keyboard is released). When a key is released,
 * it sets teh appropriate direction to false to let us know which
 * key it was.
 */
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
}







function Game() {

/* gets canvas information and context and sets up all game onjects
/*returns TRUE if the canvas is supported and FALSE if it is not.
/* this is to stop the animation script from constantly
/* running on older browasers*/



this.init = function() {
	//get the canvas element
	this.bgCanvas = document.getElementById('background');
	this.shipCanvas = document.getElementById('ship');
	//this.bgCanvas = document.getElementById('pumpkin');
	this.mainCanvas = document.getElementById('main');
	//test to see if canvas is supported
	//only need to check one canvas
	if (this.bgCanvas.getContext) {

		this.bgContext = this.bgCanvas.getContext('2d');
			this.shipContext = this.shipCanvas.getContext('2d');
			this.mainContext = this.mainCanvas.getContext('2d');
//this.pumpkin.Context = this.pumpkinCanvas.getContext('2d');
		//initialize objects to contain their context and canvas informarion
		Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;
			
			Ship.prototype.context = this.shipContext;
			Ship.prototype.canvasWidth = this.shipCanvas.width;
			Ship.prototype.canvasHeight = this.shipCanvas.height;
			
				//Pumpkin.prototype.canvasHeight = this.shipCanvas.height;
			//Pumpkin.prototype.context = this.shipContext;
			//Pumpkin.prototype.canvasWidth = this.shipCanvas.width;


			Bullet.prototype.context = this.mainContext;
			Bullet.prototype.canvasWidth = this.mainCanvas.width;
			Bullet.prototype.canvasHeight = this.mainCanvas.height;

		//Inititialzie the background object
		this.background = new Background();
		this.background.init(0,0);//set draw point to 0, 0

		//initialize the ship object
		this.ship = new Ship();
		//set the ship to start near bottom of canvas
		var shipStartX = this.shipCanvas.width/2 - imageRepository.spaceship.width;
			var shipStartY = this.shipCanvas.height/4*3 + imageRepository.spaceship.height;
			this.ship.init(shipStartX, shipStartY, imageRepository.spaceship.width,
			               imageRepository.spaceship.height);


		return true;
	} else {
		return false;
	}

	};

	//start the ANIMATION LOOP
	this.start = function() {
		this.ship.draw();
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
	game.ship.move();
	game.ship.bulletPool.animate();
}


////////* PART TWO THE SHIPS AND BULLETS*/////////

/*custom pool objects. holds bullet to be managed to prevent garbage collection*/

function Pool(maxSize) {
	var size = maxSize; //max bullets allowed in pool
	var pool =[];
	/*populates the pool array with BULLET OBJECTS*/
	this.init = function() {
			for ( var i = 0; i < size; i++) {
	//initialize the bullet object
	var bullet = new Bullet();
	bullet.init(0,0, imageRepository.bullet.width,imageRepository.bullet.height);
	pool[i] = bullet;
	}


	};
	/*grabs the last itme in the list and initializes it and pushes it to front of array*/
	this.get = function(x,y, speed) {
		if(!pool[size -1].alive) {
			pool[size -1].spawn(x,y,speed);
			pool.unshift(pool.pop());
		}
	};

/*used for the shitp to be able to get two bullets at once.
/* if only the get() function is used twice, the ship is able to fire
/* and only have 1 bullet spawn instead of 2*/
this.getTwo = function(x1,y1,speed1,x2,y2,speed2) {
	if(!pool[size -1].alive &&
		!pool[size -2].alive) {
		this.get(x1,y2,speed1);
		this.get(x2,y2,speed2);
	}
};

/*draws any in use Bullets. if a bullet goes off the screen
/*clears it n pushes it to the front of array*/
this.animate = function() {

	for (var i = 0; i < size; i++) {
		//only draw untile we find a bullet that is not alive
		if (pool[i].alive) {
			if(pool[i].draw()) {
				pool[i].clear();
				pool.push((pool.splice(i,1))[0]);
			}
		}
		else
			break;
	}
}
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




