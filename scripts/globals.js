function Color (red, green, blue, alpha) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
}

var c = document.getElementById('game'),
ctx = c.getContext('2d');

var dc = document.getElementById('drawing'),
dctx = dc.getContext('2d');

var imgs=[];

var defaultColors = {};

defaultColors.border = new Color(0, 38, 255, 255);
defaultColors.lightMid = new Color(255, 0, 220, 255);
defaultColors.darkMid = new Color(87, 0, 127, 255);
defaultColors.shading = new Color(255, 255, 255, 255);

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

function Item() {
    var rareSeed = Math.random();
    
    if ((rareSeed > 0) && (rareSeed < 0.29)) {
        this.rarity = raritys.trash;
        drops[0] += 1;
    } else if ((rareSeed >= 0.3) && (rareSeed < 0.55)) {
        this.rarity = raritys.common;
        drops[1] += 1;
    } else if ((rareSeed >= 0.55) && (rareSeed < 0.75)) {
        this.rarity = raritys.uncommon;
        drops[2] += 1;
    } else if ((rareSeed >= 0.75) && (rareSeed < 0.85)) {
        this.rarity = raritys.rare;
        drops[3] += 1;
    } else if ((rareSeed >= 0.85) && (rareSeed < 0.92)) {
        this.rarity = raritys.uRare;
        drops[4] += 1;
    } else if ((rareSeed >= 0.92) && (rareSeed < 0.95)) {
        this.rarity = raritys.Legendary;
        drops[5] += 1;
    } else if ((rareSeed >= 0.95) && (rareSeed < 0.96)) {
        this.rarity = raritys.uLegendary;
        drops[6] += 1;
    } else {
        this.rarity = raritys.trash;
        drops[0] += 1;
    }
    
    console.log("Generated a " + this.rarity.name + " Weapon");
    
    var rSeed = Math.random();
    var gSeed = Math.random();
    var bSeed = Math.random();
    
    var borderLight = 50;
    var main1Light = 80;
    var main2Light = 120;
    var shadeLight = 200;
    
    var variance = this.rarity.colorVariance;
    
    this.colors = {};
    this.colors.border = new Color (borderLight + (variance * rSeed), borderLight + (variance * gSeed), borderLight + (variance * bSeed), 255);
    this.colors.darkMid = new Color (main1Light + (variance * rSeed), main1Light + (variance * gSeed), main1Light + (variance * bSeed), 255);
    this.colors.lightMid = new Color (main2Light + (variance * rSeed), main2Light + (variance * gSeed), main2Light + (variance * bSeed), 255);
    this.colors.shading = new Color (shadeLight + (variance * rSeed), shadeLight + (variance * gSeed), shadeLight + (variance * bSeed), 255);
}

function GenWeapon() {
    dctx.save();
    var wep = new Item();
    
    dctx.clearRect(0, 0, dc.width, dc.height);
    
    dctx.drawImage(imgs[0], Math.floor(5 * Math.random()) * 64, 0, 64, 64, 0, 0, 256, 256);
    dctx.drawImage(imgs[1], Math.floor(4 * Math.random()) * 64, 0, 64, 64, 0, 0, 256, 256);
    
    wep.Image = recolor(defaultColors, wep.colors);
    
    if (wep.rarity.auraColors.length > 0) {
        for (var i = 0; i < wep.rarity.auraWidth; i += 1) {
            dctx.clearRect(0, 0, dc.width, dc.height);
            dctx.putImageData(wep.Image, 0, 0);
            wep.Image = outline(wep.rarity.auraColors[i % wep.rarity.auraColors.length], 255 - (255 / wep.rarity.auraWidth * i));
            dctx.putImageData(wep.Image, 0, 0);
        }
    }
    dctx.restore();
    
    dctx.putImageData(wep.Image, 0, 0);
    
    return wep;
}

function newWep() {
    heldWep = GenWeapon();
}

var wepTimer = setInterval(newWep, 1000);

function getPixelPos (x, y, width, height) {
    return ((y * width + x) * 4);
}

console.log(getPixelPos(512, 512, 512, 512));

//Get the posistion of the pixel in the array, where the array starts at 0,0 top left and ends at width, height bottom right.