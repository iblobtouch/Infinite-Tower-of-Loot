var c = document.getElementById('game'),
ctx = c.getContext('2d');

var imgs=[];

var heldWep = {};

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

function GenItem() {
    var rSeed = Math.random();
    var gSeed = Math.random();
    var bSeed = Math.random();
    
    var borderLight = 50;
    var main1Light = 80;
    var main2Light = 120;
    var shadeLight = 200;
    
    var variance = 70;
    
    this.colors = {};
    this.colors.border = [borderLight + (variance * rSeed), borderLight + (variance * gSeed), borderLight + (variance * bSeed)];
    this.colors.main1 = [main1Light + (variance * rSeed), main1Light + (variance * gSeed), main1Light + (variance * bSeed)];
    this.colors.main2 = [main2Light + (variance * rSeed), main2Light + (variance * gSeed), main2Light + (variance * bSeed)];
    this.colors.shading = [shadeLight + (variance * rSeed), shadeLight + (variance * gSeed), shadeLight + (variance * bSeed)];
}

function GenWeapon() {
    var wep = new GenItem();
    ctx.clearRect(0, 0, 256, 256);
    
    ctx.drawImage(imgs[0], Math.floor(2 * Math.random()) * 64, 0, 64, 64, 0, 0, 256, 256);
    ctx.drawImage(imgs[1], Math.floor(2 * Math.random()) * 64, 0, 64, 64, 0, 0, 256, 256);
    
    wep.Image = ctx.getImageData(0, 0, 256, 256);
    wep.ImageData = wep.Image.data;
    
    for (var i = 0; i < wep.ImageData.length; i += 4) {
        if ((wep.ImageData[i] === 0) && (wep.ImageData[i + 1] === 38) && (wep.ImageData[i + 2] === 255)) {
            wep.ImageData[i] = wep.colors.border[0];
            wep.ImageData[i + 1] = wep.colors.border[1];
            wep.ImageData[i + 2] = wep.colors.border[2];
        }
        //Replace default border colours.
        
        if ((wep.ImageData[i] === 87) && (wep.ImageData[i + 1] === 0) && (wep.ImageData[i + 2] === 127)) {
            wep.ImageData[i] = wep.colors.main1[0];
            wep.ImageData[i + 1] = wep.colors.main1[1];
            wep.ImageData[i + 2] = wep.colors.main1[2];
        }
        //Replace main1 colours.
        
        if ((wep.ImageData[i] === 255) && (wep.ImageData[i + 1] === 0) && (wep.ImageData[i + 2] === 220)) {
            wep.ImageData[i] = wep.colors.main2[0];
            wep.ImageData[i + 1] = wep.colors.main2[1];
            wep.ImageData[i + 2] = wep.colors.main2[2];
        }
        //Replace main2 colours.
        
        if ((wep.ImageData[i] === 255) && (wep.ImageData[i + 1] === 255) && (wep.ImageData[i + 2] === 255)) {
            wep.ImageData[i] = wep.colors.shading[0];
            wep.ImageData[i + 1] = wep.colors.shading[1];
            wep.ImageData[i + 2] = wep.colors.shading[2];
        }
        //Replace shading colours.
    }
    
    return wep;
}

function newWep() {
    heldWep = GenWeapon();
}