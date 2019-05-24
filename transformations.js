	//input
	document.addEventListener("keydown", function(event) {
		switch (event.key) {
		case "ArrowUp" :
			gravity = false;
			break;
		case "w" :
			gravity = false;
			break;
		case "ArrowLeft" :
			if (!transLock) {
				translateLeft();
				}
			break;
		case "a" :
			if (!transLock) {
			translateLeft();
			}
			break;
		case "ArrowRight" :
			if (!transLock) {
				translateRight();
				}
			break;
		case "d" :
			if (!transLock) {
			translateRight();
			}
			break;
		}
	});
	document.addEventListener("keyup", function(event){
		switch (event.key) {
		case "1" :
			if (!rotLock) {
				rotateCounterClockwise();
			}
			break;
		case "3" :
			if (!rotLock) {
				rotateClockwise();
			}
			break;
		case "8" :
			if (!rotLock) {
				rotateCounterClockwise();
			}
			break;
		case "0" :
			if (!rotLock) {
				rotateClockwise();
			}
			break;
		case  "ArrowDown" :
			if (!gravity)
				gravity = true;
			else dropDown();
			break;
		case "s" :
			if (!gravity)
				gravity = true;
			else dropDown();
			break;
		}
	});
	document.getElementById("increase-unit").addEventListener("click", function(){
		if (unit < 0.2) {
			position[0] *= 1/unit;
			position[1] *= 1/unit;
			unit += 10/canvas.width;
			position[0] *= unit;
			position[1] *= unit;
			translationMatrix[12] = position[0];
			translationMatrix[13] = position[1];
			mat4.scale(scaleMatrix, identityMatrix, [unit, unit, 1]);
			mat4.multiply(mvMatrix, rotationMatrix, scaleMatrix);
			mat4.multiply(mvMatrix, translationMatrix, mvMatrix);
			mat4.scale(blockMVMatrix, identityMatrix, [unit, unit, 1]);
			mat4.translate(blockMVMatrix, blockMVMatrix, [-5, -11, -3.6]);
			draw();
		}
	});
	document.getElementById("decrease-unit").addEventListener("click", function(){
		if (unit > 0.05) {
			position[0] *= 1/unit;
			position[1] *= 1/unit;
			unit -= 10/canvas.width;
			position[0] *= unit;
			position[1] *= unit;
			translationMatrix[12] = position[0];
			translationMatrix[13] = position[1];
			mat4.scale(scaleMatrix, identityMatrix, [unit, unit, 1]);
			mat4.multiply(mvMatrix, rotationMatrix, scaleMatrix);
			mat4.multiply(mvMatrix, translationMatrix, mvMatrix);
			mat4.scale(blockMVMatrix, identityMatrix, [unit, unit, 1]);
			mat4.translate(blockMVMatrix, blockMVMatrix, [-5, -11, -3.6]);
			draw();
		}
	});
	
	// some help vars
	var last; //time of the previous animation frame
	var delta = 0; //difference between now and last
	var rotDirection = 0; //rotation direction
	var transLock = false; //translation animation lock
	var rotLock = false;
	var rotated = 0;
	
	function animate(now) {
		lock = true;
		now *= 0.001;
		delta = Math.round(Math.abs(now-last)*3000)/1000;
		last = now;
		// X translation
		if (position[0] != translationMatrix[12]) {
			transLock = true;
			if (position[0] > translationMatrix[12]) { // right translation
				if (translationMatrix[12] + delta > position[0]) {
					mat4.translate(translationMatrix, translationMatrix, [position[0] - translationMatrix[12], 0, 0]);
					transLock = false;
				}
				else mat4.translate(translationMatrix, translationMatrix, [delta, 0, 0]);
			}
			else { // left translation
				if (translationMatrix[12] - delta < position[0]) { 
					mat4.translate(translationMatrix, translationMatrix, [-Math.abs(translationMatrix[12] - position[0]), 0, 0]);
					transLock = false;
				}
				else mat4.translate(translationMatrix, translationMatrix, [-delta, 0, 0]);
			}
		}
		else transLock = false;
		// Y translation
		if (position[1] != translationMatrix[13]) {
			if (translationMatrix[13] - delta < position[1]) {
				mat4.translate(translationMatrix, translationMatrix, [0, -Math.abs(translationMatrix[13] - position[1]), 0]);
			}
			else mat4.translate(translationMatrix, translationMatrix, [0, -delta, 0]);
			mat4.multiply(mvMatrix, rotationMatrix, scaleMatrix);
			mat4.multiply(mvMatrix, translationMatrix, mvMatrix);
		}
		// rotation
		if (Math.round(rotationMatrix[0]*1000) != Math.round(Math.cos(rotation*Math.PI/180)*1000) && Math.round(rotationMatrix[1]*1000) != -Math.round(Math.sin(rotation*Math.PI/180)*1000)) {
			rotLock = true;
			if (rotated + delta*6 > Math.PI/2) {
				mat4.rotateZ(rotationMatrix, rotationMatrix, rotDirection*(Math.PI/2-rotated));
				rotated = 0;
				rotLock = false;
			}
			else {
				mat4.rotateZ(rotationMatrix, rotationMatrix, rotDirection*delta*6);
				rotated += delta*6;
			}
		}
		else rotLock = false;

		mat4.multiply(mvMatrix, rotationMatrix, scaleMatrix);
		mat4.multiply(mvMatrix, translationMatrix, mvMatrix);
		
		gl.uniformMatrix4fv(mvMatrixLocation, false, mvMatrix);
		draw();
		requestAnimationFrame(animate);
	}
	
	function translateLeft() {
		//check to see if the current shape will have left the grid array; if yes, the translation won't be executed; if no, move it 1 unit;
		var stop = false;
		for (var i=0; i<16; i++) {
			if (currentArray[i] != 0)
				if (gridArray[arrayPosition+~~(i/4)*10+i%4-1] != 0 || (arrayPosition+~~(i/4)*10+i%4-1)%10 == 9) {
					stop = true;
					break;
				}
		}
		if (!stop) {
			position[0] -= unit;
			arrayPosition--;
		}
	}
	
	function translateRight() {
		var stop = false;
		for (var i=0; i<16; i++) {
			if (currentArray[i] != 0)
				if (gridArray[arrayPosition+~~(i/4)*10+i%4+1] != 0 || (arrayPosition+~~(i/4)*10+i%4+1)%10 == 0) {
					stop = true;
					break;
				}
		}
		if (!stop){
			position[0] += unit;
			arrayPosition++;
		}
	}
	
	function dropDown() {
		//check how far is the nearest occupied block in the grid from the current shape, and move it by that amount of blocks
		var counter = 0;
		var drop = 23;
		for (var i=0; i<16; i++) {
			if (currentArray[i] != 0) {
				for (var j=1; j<~~((220-arrayPosition)/10); j++) {
					if (gridArray[arrayPosition+~~(i/4)*10+i%4+j*10] == 0)
						counter++
						else break;
				}
				if (counter < drop) drop = counter;
				counter = 0;
			}
		}
		position[1] -= (drop)*unit;
		arrayPosition += (drop)*10;
		updateGrid();
	}
	
	function translateDown() {
		if (gravity) {
			var stop = false;
			var bottom = false;
			for (var i=0; i<16; i++) {
				if (currentArray[i] != 0)
					if (gridArray[arrayPosition+~~(i/4)*10+i%4+10] != 0 || arrayPosition+~~(i/4)*10+i%4+10 >= 220) {
						stop = true;
						break;
					}
			}
			if (!stop) {
				position[1] -= unit;
				arrayPosition += 10;
			}
			if (stop) {
				updateGrid();
			}
		}
	}
	
	function rotateClockwise() {
		/*rotate a local matrix by transposing it and reversing rows or columns. 
		 * If it doesn't leave the grid array, or overlaps with an already occupied block,
		 * apply the matrix to the current shape array. 
		 */
		var mat = mat4.create();
		mat4.copy(mat, currentArray);
		mat4.transpose(mat, mat);
		var help;
		for (var i=0; i<4; i++) {
			var help = mat[4*i];
			mat[4*i] = mat[4*i+3];
			mat[4*i+3] = help;
			help = mat[4*i+1];
			mat[4*i+1] = mat[4*i+2];
			mat[4*i+2] = help;
		}
		var stop = false;
		for (var i=0; i<16; i++) {
			if (mat[i] != 0) {
				if (gridArray[arrayPosition+~~(i/4)*10+i%4] != 0 || arrayPosition+~~(i/4)*10+i%4 >=220) {
					stop = true;
					console.log("this");
					break;
				}
				if (arrayPosition%10 <= 8) 
					if (arrayPosition%10 > (arrayPosition+~~(i/4)*10+i%4)%10) {
						stop = true;
						break;
					}
				if (arrayPosition%10 == 9)
					if (arrayPosition%10 == (arrayPosition+~~(i/4)*10+i%4)%10) {
						stop = true;
						break;
					}
			}
		}
		if (!stop) {
			mat4.copy(currentArray, mat);
			rotDirection = -1;
			rotation += 90;
		}
	}
	
	function rotateCounterClockwise() {
		var mat = mat4.create();
		mat4.copy(mat, currentArray);
		mat4.transpose(mat, mat);
		for (var i=0; i<4; i++) {
			var help = mat[i];
			mat[i] = mat[12+i];
			mat[12+i] = help;
			help = mat[4+i];
			mat[4+i] = mat[8+i];
			mat[8+i] = help;
		}
		var stop = false;
		for (var i=0; i<16; i++) {
			if (mat[i] != 0) {
				if (gridArray[arrayPosition+~~(i/4)*10+i%4] != 0 || arrayPosition+~~(i/4)*10+i%4 >=220) {
					stop = true;
					break;
				}
				if (arrayPosition%10 <= 8) 
					if (arrayPosition%10 > (arrayPosition+~~(i/4)*10+i%4)%10) {
						stop = true;
						break;
					}
				if (arrayPosition%10 == 9)
					if (arrayPosition%10 == (arrayPosition+~~(i/4)*10+i%4)%10) {
						stop = true;
						break;
					}
			}
		}
		if (!stop) {
			mat4.copy(currentArray, mat);
			rotDirection = 1;
			rotation -= 90;
		}
	}