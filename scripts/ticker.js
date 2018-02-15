function onload() {
    dctx.mozImageSmoothingEnabled = false;
    dctx.webkitImageSmoothingEnabled = false;
    dctx.msImageSmoothingEnabled = false;
    dctx.imageSmoothingEnabled = false;
    
    var imageURLs=[];
    var imagesOK=0;
    imageURLs.push("images/Weapon Blade.png");
    imageURLs.push("images/Weapon Handle.png");
    imageURLs.push("images/Enemies.png");
    imageURLs.push("images/Frame.png");
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
        blades = imgs[0];
        handles = imgs[1];
        enemies = imgs[2];
        frame = imgs[3];
        newWep();
        newEnemy();
        var drawtimer = setInterval(tickManager, 100 / 60);
      }
    };
}

function tickManager() {
    //var out = document.getElementById("Out");
    
    game.state.tickCounter += 1;
    
    if (game.state.tickCounter >= 60) {
        game.state.tickCounter = 0;
    }
    
    if (game.menu == "battle") {
        //dctx.clearRect(0, 0, dc.width, dc.height);
        ctx[0].clearRect(0, 0, c[0].width, c[0].height);
        ctx[1].clearRect(0, 0, c[1].width, c[1].height);
        ctx[2].clearRect(0, 0, c[2].width, c[2].height);
        
        ctx[1].font = '12px ubuntu';
        ctx[2].font = '12px ubuntu';

        if (game.hasOwnProperty("currentEnemy")) {
            ctx[1].save();
            //ctx[0].drawImage(frame, 96, 32, 128, 128);
            ctx[1].putImageData(game.currentEnemy.image, 50, 50);
            ctx[2].fillStyle = "000000";
            ctx[2].fillText("Enemy has: " + game.currentEnemy.curHealth + " / " + game.currentEnemy.maxHealth + " hp", 0, 20);
            ctx[1].restore();
        }

        if (game.hasOwnProperty("currentWep")) {
            ctx[1].save();
            //ctx[0].drawImage(frame, 96, 32, 128, 128);
            ctx[1].putImageData(game.currentWep.image, 120, 50);
            if ((game.mouse.x > 120) && (game.mouse.x < 120 + game.currentWep.size.width) && (game.mouse.y > 50) && (game.mouse.y < 50 + game.currentWep.size.height)) {
                displayWeaponStats(game.currentWep, game.mouse.x, game.mouse.y);
            }
            ctx[2].fillStyle = "000000";
            ctx[1].restore();
        }

        ctx[2].fillText("Floor: " + game.state.floorNum, 0, 35);
    } else {
        ctx[0].clearRect(0, 0, c[0].width, c[0].height);
        ctx[1].clearRect(0, 0, c[1].width, c[1].height);
        ctx[2].clearRect(0, 0, c[2].width, c[2].height);
        for (var i = 0; i < 24; i += 1) {
            ctx[1].drawImage(frame, 70 * (i % 8), 70 * (Math.floor(i / 8)));
            if(game.inventory[i] != undefined){
                ctx[0].putImageData(game.inventory[i].image, 70 * (i % 8) + (32 - game.inventory[i].size.width / 2), 70 * (Math.floor(i / 8)) + (32 - game.inventory[i].size.height / 2));
            }
        }
        
        if ((game.mouse.x > 0) && (game.mouse.x < 70 * 8) && (game.mouse.y > 0) && (game.mouse.y < 70 * 3)) {
            var i = Math.floor(game.mouse.x / 70) + Math.floor(game.mouse.y / 70) * 8;
            if(game.inventory[i] != undefined){
                displayWeaponStats(game.inventory[i], game.mouse.x, game.mouse.y);
            }
        }
    }
    
    if (game.state.tickCounter % 60 == 0) {
        game.currentEnemy.curHealth -= game.currentWep.damage;
        
        if (game.currentEnemy.curHealth <= 0) {
            game.state.floorNum += 1;
            newWep();
            newEnemy();
        }
    }
}

function resize() {
    var container = document.getElementById("content");
    
    for (var i = 0; i < 3; i += 1) {
        c[i].width = container.clientWidth;
        if (container.clientHeight < 400) {
            c[i].height = window.innerHeight - 30;
        } else {
            c[i].height = container.clientHeight;
        }
        
        c[i].mozImageSmoothingEnabled = false;
        c[i].webkitImageSmoothingEnabled = false;
        c[i].msImageSmoothingEnabled = false;
        c[i].imageSmoothingEnabled = false;
    }
    
    dc.width = 256;
	dc.height = 256;
    
    dctx.mozImageSmoothingEnabled = false;
    dctx.webkitImageSmoothingEnabled = false;
    dctx.msImageSmoothingEnabled = false;
    dctx.imageSmoothingEnabled = false;  
}
resize();

window.onresize = resize;