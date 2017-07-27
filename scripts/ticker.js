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
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        var blades = imgs[0];
        var handle = imgs[1];
        var drawtimer = setInterval(tickManager, 100 / 60);
      }
    };
}

function tickManager() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.save();
    if (Object.keys(heldWep).length != 0 && heldWep.constructor != Object) {
        ctx.putImageData(heldWep.Image, 0, 0);
    }
    ctx.restore();
}

function resize() {
    c.width = window.innerWidth;
	c.height = window.innerHeight;
}
resize();

window.onresize = resize;