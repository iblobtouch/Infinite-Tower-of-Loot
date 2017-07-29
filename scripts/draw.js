function recolor(defaultColor, newColor) { 
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
    }
    
    return image;
}

//This function will take the current image content of the drawing canvas, and replace the colours in "default" with the colours in "new", then return the image content of the canvas.
//This will ignore the alpha of a pixel!

function testOutline (pos, placedPos, imageData, outlineColor) {
    if ((pos < 0) || (pos > dc.width * dc.height * 4)) {
        return false;
    }
    
    if ((pos / 4 % dc.width < 3) || (pos / 4 % dc.width > dc.width - 3)) {
        return false;
    }
    if (imageData[pos + 3] != 0) {
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
        canPlace = false;
        if (imageData[i + 3] === 0) {
            for (var x = -4; x < 8; x += 4) {
                for (var y = -dc.width * 4; y < dc.width * 8; y += dc.width * 4) {
                    if ((x != 0) && (y != 0)) {
                    //if (x != 0) {
                        if (testOutline(i + x + y, placedPos, imageData, outlineColor) === true) {
                            canPlace = true;
                        }
                    }
                }
            }
            if (canPlace === true) {
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