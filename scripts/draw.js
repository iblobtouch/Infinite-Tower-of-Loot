function recolor(defaultColor, newColor) { 
    console.log(dc.width + ", " + dc.height);
    
    var image = dctx.getImageData(0, 0, dc.width, dc.height);
    var imageData = image.data;
    
    for (var i = 0; i < imageData.length; i += 4) {
        for (var key in defaultColor) {
            if (defaultColor.hasOwnProperty(key)) {
                if ((imageData[i] === defaultColor[key].red) && (imageData[i + 1] === defaultColor[key].green) && (imageData[i + 2] === defaultColor[key].blue)) {
                    imageData[i] = newColor[key].red;
                    imageData[i + 1] = newColor[key].green;
                    imageData[i + 2] = newColor[key].blue;
                }
            }
        }
        
        if ((imageData[i] == 255) && (imageData[i + 1] == 0))  {
            imageData[i] = newColor.border.red;
            imageData[i + 1] = newColor.border.green;
            imageData[i + 2] = newColor.border.blue;
        }
    }
    
    return image;
}

//This function will take the current image content of the drawing canvas, and replace the colours in "default" with the colours in "new", then return the image content of the canvas.
//This will ignore the alpha of a pixel!

function testOutline (pos, imageData) {
    if (pos < dc.width * 4) {
        return false;
    }
    
    if (pos > (dc.width * dc.height - (dc.width * 2)) * 4) {
        return false;
    }
    
    if (imageData[offset(pos, -1, 0) + 3] !== 0) {
        return true;
    }
    if (imageData[offset(pos, 1, 0) + 3] !== 0) {
        return true;
    }
    if (imageData[offset(pos, 0, -1) + 3] !== 0) {
        return true;
    }
    if (imageData[offset(pos, 0, 1) + 3] !== 0) {
        return true;
    }
    return false;
}

//Test a given location to see if the given location contains a filled pixel that is not an already placed outline.

function outline (outlineColor, alpha) {
    var image = dctx.getImageData(0, 0, dc.width, dc.height);
    var imageData = image.data;
    var canPlace = false;
    var placedPos = [];
    
    for (var i = 0; i < imageData.length; i += 4) {
        if (imageData[i + 3] === 0) {
            if (testOutline(i, imageData) === true) {
                placedPos[placedPos.length] = i;
            }
        }
    }
    
    for (var i = 0; i < placedPos.length; i += 1) {
        imageData[placedPos[i]] = outlineColor.red;
        imageData[placedPos[i] + 1] = outlineColor.green;
        imageData[placedPos[i] + 2] = outlineColor.blue;
        imageData[placedPos[i] + 3] = alpha;
    }
    
    return image;
}

function genWeaponImage(weapon, width, height) {
    dctx.clearRect(0, 0, dc.width, dc.height);
    
    dctx.drawImage(blades, weapon.bladeNum * game.sourceImgConsts.width, 0, game.sourceImgConsts.width, game.sourceImgConsts.height, 0, 0, width, height);
    
    var image = dctx.getImageData(0, 0, width, height);
    var imageData = image.data;
    
    //We need to know what the blade looks like as a imagedata array at the specified width and height, clear the drawing canvas, draw it to the screen then get the data.
    
    for (i = 0; i < imageData.length * 4; i += 4) {
        if ((imageData[i] == 255) && (imageData[i + 1] == 0) && (imageData[i + 2] == 0) && (imageData[i + 3] == 255)) {
            var pos = i / 4;
            
            weapon.bladePos.x = (pos % width);
            weapon.bladePos.y = (Math.floor(pos / width));
            dctx.clearRect(0, 0, dc.width, dc.height);
            
            break;
        }
    }
    
    /* Now that we have this data, a special trick is performed on the given image files.
    In addition to containing recolourable colours, there's also a special red dot.
    This loop will find this dot and note its position for later.
    */
    
    dctx.drawImage(handles, weapon.handleNum * game.sourceImgConsts.width, 0, game.sourceImgConsts.width, game.sourceImgConsts.height, 0, 0, width, height);
    
    image = dctx.getImageData(0, 0, width, height);
    imageData = image.data;
    
    for (i = 0; i < imageData.length * 4; i += 4) {
        if ((imageData[i] == 255) && (imageData[i + 1] == 0) && (imageData[i + 2] == 0) && (imageData[i + 3] == 255)) {
            var pos = i / 4;
            
            weapon.handlePos.x = (pos % width);
            weapon.handlePos.y = (Math.floor(pos / width));
            dctx.clearRect(0, 0, dc.width, dc.height);
            
            break;
        }
    }
    
    // Same as before, just for the handle.
    
    dctx.drawImage(blades, weapon.bladeNum * game.sourceImgConsts.width, 0, game.sourceImgConsts.width, game.sourceImgConsts.height, 
    64 + weapon.handlePos.x - weapon.bladePos.x, 64 + weapon.handlePos.y - weapon.bladePos.y, 
    width, height);
    
    dctx.drawImage(handles, weapon.handleNum * game.sourceImgConsts.width, 0, game.sourceImgConsts.width, game.sourceImgConsts.height, 64, 64, width, height);
    
    //Now that we have found the top right pixel of the red dot in both the blade and the handle, we can then overlay both images such that the dot in both will overlap.
    
    image = recolor(defaultColors, weapon.colors);
    //Recolor the final image, then set the current image data to it.
    
    if (weapon.rarity.auraColors.length > 0) {
        for (var i = 0; i < weapon.rarity.auraWidth; i += 1) {
            dctx.clearRect(0, 0, dc.width, dc.height);
            dctx.putImageData(image, 0, 0);
            image = outline(weapon.rarity.auraColors[i % weapon.rarity.auraColors.length], 255 - (255 / weapon.rarity.auraWidth * i));
            //dctx.putImageData(image, 0, 0);
        }
    }
    
    //Give the weapon and aura, if its rarity specifies one.
    
    dctx.restore();
    
    return image;
}

//Returns a brand new image of the specified weapon, with the image scaled by the specified width and height, relative to the original dimension in the weapon blade and handle file.

function genEnemyImage(enemy, width, height) {
    dctx.clearRect(0, 0, dc.width, dc.height);
    
    dctx.drawImage(enemies, 0 * game.sourceImgConsts.width, 0, game.sourceImgConsts.width, game.sourceImgConsts.height, 0, 0, width, height);
    
    var image = dctx.getImageData(0, 0, width, height);
    var imageData = image.data;
    
    image = recolor(defaultColors, enemy.colors);
    //Recolor the final image, then set the current image data to it.
    
    return image;
}

//Returns a brand new image of the specified weapon, with the image scaled by the specified width and height, relative to the original dimension in the weapon blade and handle file.

function getTrueDimensions(img) {
    dctx.clearRect(0, 0, dc.width, dc.height);
    
    dctx.putImageData(img, 0, 0);
    
    var image = dctx.getImageData(0, 0, dc.width, dc.height),
    imagedata = image.data;
    
    var left = dc.width, right = 0, top = dc.height, bottom = 0;
    
    for (var y = 0; y < imagedata.length / (dc.width * 4); y += 1) {
        for (var x = 0; x < dc.width; x += 1) {
            if (imagedata[(y * dc.width + x) * 4 + 3] != 0) {
                if  (x < left) {
                    left = x;
                }
                
                if  (x > right) {
                    right = x;
                }
                
                if  (y < top) {
                    top = y;
                }
                
                if  (y > bottom) {
                    bottom = y;
                }
            }
        }
    }
    
    var width = right - left + 2, height = bottom - top + 2;
    
    img = dctx.getImageData(left, top, width, height);
    
    return [img, width, height];
}

function displayWeaponStats(weapon, x, y) {
    ctx[2].save();
    dctx.save();
    dctx.clearRect(0, 0, dc.width, dc.height);
    if (weapon.rarity.hasOwnProperty("auraColors")) {
        dctx.fillStyle = "rgba(" + weapon.rarity.auraColors[0].red + "," + weapon.rarity.auraColors[0].green + "," + weapon.rarity.auraColors[0].blue + ", 255)";
    } else {
        dctx.fillStyle = "black";
    }
    
    dctx.font = '12px ubuntu';

    dctx.fillText(weapon.rarity.name, 0, 30);
    dctx.fillStyle = "black";
    dctx.fillText(weapon.damage + " damage", 0, 45);
    
    var temp = getTrueDimensions(dctx.getImageData(0, 0, dc.width, dc.height));
    
    ctx[1].fillStyle = "white";
    ctx[1].fillRect(x, y, temp[1] + 20, temp[2] + 20);
    ctx[1].strokeRect(x, y, temp[1] + 20, temp[2] + 20);
    ctx[2].putImageData(temp[0], x + 10, y + 10);
    ctx[2].restore();
    dctx.restore();
}





