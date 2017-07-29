function onload() {
    var imageURLs=[];
    var imagesOK=0;
    imageURLs.push("images/Weapon Blade.png");
    imageURLs.push("images/Weapon Handle.png");
    loadAllImages();

    function loadAllImages(){
        for (var i = 0; i < imageURLs.length; i++) {
            var img = new Image();
            imgs.push(img);
            img.onload = function(){ imagesOK++; imagesAllLoaded(); };
            img.src = imageURLs[i];
        }      
    }

    var imagesAllLoaded = function() {
      if (imagesOK==imageURLs.length ) {
        dctx.mozImageSmoothingEnabled = false;
        dctx.webkitImageSmoothingEnabled = false;
        dctx.msImageSmoothingEnabled = false;
        dctx.imageSmoothingEnabled = false;  
          
        var blades = imgs[0];
        var handle = imgs[1];
        newWep();
        var drawtimer = setInterval(tickManager, 100 / 60);
      }
    };
}

function tickManager() {
    var out = document.getElementById("Out");
    
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.save();
    if (Object.keys(heldWep).length != 0 && heldWep.constructor != Object) {
        ctx.save();
        ctx.putImageData(heldWep.Image, 0, 0);
        ctx.fillStyle = "000000";
        ctx.fillText(heldWep.rarity.name, 0, 50);
        ctx.restore();
    }
    ctx.restore();
        
    
    var outText = "";
    outText += "You have found " + drops[0] + "Trash Items" + "\r\n";
    outText += "You have found " + drops[1] + "Common Items" + "\r\n";
    outText += "You have found " + drops[2] + "Uncommon Items" + "\r\n";
    outText += "You have found " + drops[3] + "Rare Items" + "\r\n";
    outText += "You have found " + drops[4] + "Ultra Rare Items" + "\r\n";
    outText += "You have found " + drops[5] + "Legendary Items" + "\r\n";
    outText += "You have found " + drops[6] + "Ultra Legendary Items" + "\r\n";
    out.value = outText;
}

function resize() {
    c.width = window.innerWidth;
	c.height = window.innerHeight;
}
resize();

window.onresize = resize;