function Game () {
    this.currentWep = {};
    this.currentEnemy = {};
    this.mouse = {};
    this.state = {};
    
    this.sourceImgConsts = {};
    this.sourceImgConsts.width = 64;
    //The width of each individual sprite in the source files.
    this.sourceImgConsts.height = 64;
    //The height of each individual sprite in the source files.
    this.sourceImgConsts.numBlades = 6;
    //The number of blades in the blade source file.
    this.sourceImgConsts.numHandles = 5;
    //The number of handles in the handle source file.s
    this.state.floorNum = 0;
    //Current floor the player is on.
    this.state.tickCounter = 0;
    //Current tick the game is on, a tick is normally 1 every 1/60th of a second.
    this.menu = "battle";
    //Current menu the player is on, battle = battle screen, inventory = inventory screen.
    this.inventory = [];
}

var game = new Game();

function Color (red, green, blue, alpha) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
}

var c = [];
var ctx = [];

c[0] = document.getElementById('c-0');
ctx[0] = c[0].getContext('2d');

c[1] = document.getElementById('c-1');
ctx[1] = c[1].getContext('2d');

c[2] = document.getElementById('c-2');
ctx[2] = c[2].getContext('2d');

var dc = document.getElementById('drawing');
dctx = dc.getContext('2d');

var imgs=[];
var blades = false;
var handles = false;
var frame = false;

var defaultColors = {};

defaultColors.border = new Color(0, 38, 255, 255);
defaultColors.lightMid = new Color(255, 0, 220, 255);
defaultColors.darkMid = new Color(87, 0, 127, 255);
defaultColors.shading = new Color(255, 255, 255, 255);

defaultColors.lightMid2 = new Color(0, 175, 0, 255);
defaultColors.darkMid2 = new Color(0, 255, 0, 255);
defaultColors.shading2 = new Color(0, 140, 0, 255);

//These colours are what appear in the images and what will be replaced upon inital generation.

var drops = [0, 0, 0, 0, 0, 0, 0];

function ColorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}

function Entity () {
    this.pos = {};
    this.size = {};
}

function hasRarity () {
    var rareSeed = Math.random();
    
    if ((rareSeed > 0) && (rareSeed < 0.24)) {
        this.rarity = raritys.trash;
        drops[0] += 1;
    } else if ((rareSeed >= 0.25) && (rareSeed < 0.55)) {
        this.rarity = raritys.common;
        drops[1] += 1;
    } else if ((rareSeed >= 0.55) && (rareSeed < 0.75)) {
        this.rarity = raritys.uncommon;
        drops[2] += 1;
    } else if ((rareSeed >= 0.75) && (rareSeed < 0.85)) {
        this.rarity = raritys.rare;
        drops[3] += 1;
    } else if ((rareSeed >= 0.85) && (rareSeed < 0.88)) {
        this.rarity = raritys.uRare;
        drops[4] += 1;
    } else if ((rareSeed >= 0.88) && (rareSeed < 0.89)) {
        this.rarity = raritys.Legendary;
        drops[5] += 1;
    } else if ((rareSeed >= 0.89) && (rareSeed < 0.895)) {
        this.rarity = raritys.uLegendary;
        drops[6] += 1;
    } else {
        this.rarity = raritys.trash;
        drops[0] += 1;
    }
}

function hasColour(variance) {
    
    var rSeed = Math.random();
    var gSeed = Math.random();
    var bSeed = Math.random();
    
    var borderLight = 50;
    var main1Light = 80;
    var main2Light = 120;
    var shadeLight = 200;
    
    this.colors = {};
    this.colors.border = new Color (borderLight + (variance * rSeed), borderLight + (variance * gSeed), borderLight + (variance * bSeed), 255);
    this.colors.darkMid = new Color (main1Light + (variance * rSeed), main1Light + (variance * gSeed), main1Light + (variance * bSeed), 255);
    this.colors.lightMid = new Color (main2Light + (variance * rSeed), main2Light + (variance * gSeed), main2Light + (variance * bSeed), 255);
    this.colors.shading = new Color (shadeLight + (variance * rSeed), shadeLight + (variance * gSeed), shadeLight + (variance * bSeed), 255);
    
    var main1Light = 110;
    var main2Light = 150;
    var shadeLight = 230;
    
    this.colors.darkMid2 = new Color (main1Light + (variance * rSeed), main1Light + (variance * gSeed), main1Light + (variance * bSeed), 255);
    this.colors.lightMid2 = new Color (main2Light + (variance * rSeed), main2Light + (variance * gSeed), main2Light + (variance * bSeed), 255);
    this.colors.shading2 = new Color (shadeLight + (variance * rSeed), shadeLight + (variance * gSeed), shadeLight + (variance * bSeed), 255);
}

function Weapon(width, height) {
    
    Entity.call(this);
    hasRarity.call(this);
    
    var variance = this.rarity.colorVariance;
    
    hasColour.call(this, variance);
    
    console.log(this);
    
    this.damage = Math.ceil(Math.pow(this.rarity.multiplier * (game.state.floorNum + 1), 1.5));
    
    this.bladePos = {};
    this.handlePos = {};
    this.bladeNum = Math.floor(game.sourceImgConsts.numBlades * Math.random());
    this.handleNum = Math.floor(game.sourceImgConsts.numHandles * Math.random());
    
    this.image = genWeaponImage(this, width, height);
    
    var temp = getTrueDimensions(this.image);
    
    this.image = temp[0];
    this.size.width = temp[1];
    this.size.height = temp[2];
    
    //dctx.putImageData(this.Image, 0, 0);
    
    console.log(this);
}

function sortInventory() {
    game.inventory.sort(function(a, b) {
        var valA = a.damage;
        var valB = b.damage;
        if (valA > valB) {
            return -1;
        }
        if (valA < valB) {
            return 1;
        }

        // names must be equal
        return 0;
    });
}

function newWep() {
    if (game.hasOwnProperty("currentWep") && (game.currentWep.hasOwnProperty("image"))) {
        //for (var i = 0; i < 24; i += 1) {
            //if(game.inventory[24] == undefined){
                game.inventory[24] = new Weapon(128, 128);
        sortInventory();
                //break;
            //}
        //}
        console.log("New weapon in inventory");
    } else {
        game.currentWep = new Weapon(128, 128);
    }
}

function Enemy(width, height) {
    Entity.call(this);
    var variance = 200;
    hasColour.call(this, variance);
    
    this.maxHealth = Math.ceil(Math.pow(game.state.floorNum + 1, 2.5));
    this.curHealth = this.maxHealth;
    
    this.image = genEnemyImage(this, width, height);
    
    var temp = getTrueDimensions(this.image);
    
    this.image = temp[0];
    this.size.width = temp[1];
    this.size.height = temp[2];
}

function newEnemy() {
    game.currentEnemy = new Enemy(128, 128);
}

//var thisTimer = setInterval(newthis, 1000);

function showBattle() {
    game.menu = "battle";
}

function showInventory() {
    game.menu = "inventory";
}

function offset(i, x, y) {
    return i + ((x + (y * dc.width)) * 4);
}

//Take an i position in the background canvas data array, and an x and y offset from it and resolve it to a new i.

function mouseMove(e) {    
    game.mouse.x = e.clientX;
    game.mouse.y = e.clientY - c[2].offsetTop;
    
    //c[2].style.cursor = "none";
}

function mouseDown(e) {
    game.mouse.down = true;
    if (game.menu == "inventory") {
        var temp = {};
        if ((game.mouse.x < 460) && game.mouse.y < 210) {
            var i = Math.floor(game.mouse.x / 70) + Math.floor(game.mouse.y / 70) * 8;
            if (game.inventory[i] != undefined) {
                temp = game.inventory[i];
                game.inventory[i] = game.currentWep;
                game.currentWep = temp;
                sortInventory();
            }
            console.log(i);
        }
    }
}

function mouseUp(e) {
    game.mouse.down = false;
}

//console.log(getPixelPos(512, 512, 512, 512));

//Get the posistion of the pixel in the array, where the array starts at 0,0 top left and ends at width, height bottom right.

c[2].addEventListener("mousemove", mouseMove, false);
c[2].addEventListener("mouseup", mouseUp, false);
c[2].addEventListener("mousedown", mouseDown, false);