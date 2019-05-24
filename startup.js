	//variables
	var canvas;
	var gl;
	var unit;
	var program;
	var mvMatrix;
	var pMatrix;
	var positionBuffer;
	var colorBuffer;
	var position = [0,0]; //x and y position of the origin
	var arrayPosition = 3; // the starting point of the currentArray in the grid array
	var rotation = 0;
	var currentShape;
	//attribute and uniform locations
	var positionLocation;
	var colorLocation;
	var mvMatrixLocation;
	var pMatrixLocation;
	//help matrices
	var translationMatrix = mat4.create();
	var rotationMatrix = mat4.create();
	var scaleMatrix = mat4.create();
	var identityMatrix = mat4.create();
	//grid
	var blockProgram;
	var blockPositionBuffer;
	var blockColorBuffer;
	var blockMVMatrix = mat4.create();
	var blockPMatrix = mat4.create();
	var blockPositionLocation;
	var blockMVMatrixLocation;
	var blockPMatrixLocation;
	var blockColorLocation;
	var gridArray = new Array(220).fill(0);
	var currentArray = mat4.create(); //array with block positions of the current shape
	//game
	var gravity = true; //toggle gravity
	var difficulty = 0; //difficulty factor
	var rowsCleared = 0;
	var score = 0;
	var timer;
	//next block display:
	var next;
	var nextgl;
	var nextProgram;
	var nextPositionBuffer;
	var nextColorBuffer;
	var nextShape = ~~(Math.random()*7+1);
	var nextColor;
	
	var start = function() {
		canvas = document.getElementById('grid');
		gl = canvas.getContext('webgl');
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		unit = 0.2;
		program = initShaders(gl, "vertex-shader", "fragment-shader");
		blockProgram = initShaders(gl, "vertex-shader", "fragment-shader");
		blockPositionBuffer = gl.createBuffer();
		blockColorBuffer = gl.createBuffer();
		gl.useProgram(program);
		blockPositionBuffer.num_items = 0;
		
		next = document.getElementById('next');
		nextgl = next.getContext('webgl');
		nextgl.viewportWidth = next.width;
		nextgl.viewportHeight = next.height;
		nextProgram = initShaders(nextgl, "vertex-shader", "fragment-shader");
		nextPositionBuffer = nextgl.createBuffer();
		nextColorBuffer = nextgl.createBuffer();
		
		pMatrixLocation = gl.getUniformLocation(program, "PMatrix");
		mvMatrixLocation = gl.getUniformLocation(program, "MVMatrix");
		positionLocation = gl.getAttribLocation(program, "vertPosition");
		colorLocation = gl.getAttribLocation(program, "vcolor");
		blockPMatrixLocation = gl.getUniformLocation(blockProgram, "PMatrix");
		blockMVMatrixLocation = gl.getUniformLocation(blockProgram, "MVMatrix");
		blockPositionLocation = gl.getAttribLocation(blockProgram, "vertPosition");
		blockColorLocation = gl.getAttribLocation(blockProgram, "vcolor");


		positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getVert(currentShape)), gl.STATIC_DRAW);
		colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getColor()), gl.STATIC_DRAW);
		
		pMatrix = mat4.create();
		mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
		mvMatrix = mat4.create();

		mat4.scale(scaleMatrix, scaleMatrix, [unit, unit, 1]);
		mat4.translate(translationMatrix, translationMatrix, [0, 2.2, -3.6]);
		mat4.multiply(mvMatrix, translationMatrix, scaleMatrix);
		mat4.scale(blockMVMatrix, blockMVMatrix, [unit, unit, 1]);
		mat4.translate(blockMVMatrix, blockMVMatrix, [-5, -11, -3.6]);
		mat4.copy(blockPMatrix, pMatrix);
		currentArray = shapeArray(1);
		

		gl.useProgram(blockProgram);
		gl.bindBuffer(gl.ARRAY_BUFFER, blockPositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrayToVert()), gl.STATIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, blockColorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrayToColor()), gl.STATIC_DRAW);
		
		nextgl.useProgram(nextProgram);
		nextColor = getColor();
		nextgl.uniformMatrix4fv(nextgl.getUniformLocation(nextProgram, "PMatrix"), false, pMatrix);
		var nextMVMatrix = mat4.create();
		mat4.scale(nextMVMatrix, nextMVMatrix, [1/2, 1, 1]);
		mat4.translate(nextMVMatrix, nextMVMatrix, [0, 0, -3.6]);
		nextgl.uniformMatrix4fv(nextgl.getUniformLocation(nextProgram, "MVMatrix"), false, nextMVMatrix);
		
		arrayPosition = 3;
		rotation = 0;
		mat4.copy(rotationMatrix, identityMatrix);
		position[0] = 0;
		translationMatrix[12] = 0;
		position[1] = unit*10;
		translationMatrix[13] = unit*10;
		spawn();
		
		timer = setInterval(translateDown, 500);
		requestAnimationFrame(animate);
	}
	
	function draw() {
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		gl.uniformMatrix4fv(pMatrixLocation, false, pMatrix);
		gl.uniformMatrix4fv(mvMatrixLocation, false, mvMatrix);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.vertexAttribPointer(
				positionLocation, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(positionLocation);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.vertexAttribPointer(
				colorLocation, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(colorLocation);
		
		gl.drawArrays(gl.TRIANGLES, 0, 24);
		
		gl.useProgram(blockProgram);
		gl.uniformMatrix4fv(blockPMatrixLocation, false, blockPMatrix);
		gl.uniformMatrix4fv(blockMVMatrixLocation, false, blockMVMatrix);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, blockPositionBuffer);
		gl.vertexAttribPointer(
				blockPositionLocation, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(blockPositionLocation);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, blockColorBuffer);
		gl.vertexAttribPointer(
				blockColorLocation, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(blockColorLocation);

		if (blockPositionBuffer.num_items != 0)
		gl.drawArrays(gl.TRIANGLES, 0, blockPositionBuffer.num_items);
		
		gl.useProgram(program);
		
		
	}
	
	function updateGrid() {
		//add current object to the grid array
		for (var i=0; i<16; i++) {
			if (currentArray[i] != 0)
				gridArray[arrayPosition+~~(i/4)*10+i%4] = currentShape;
		}
		//clear occupied rows
		clearRows();
		document.getElementById("score").innerHTML = score;
		//buffer grid blocks
		gl.useProgram(blockProgram);
		gl.bindBuffer(gl.ARRAY_BUFFER, blockPositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrayToVert()), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, blockColorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrayToColor()), gl.STATIC_DRAW);
		//reset position data
		arrayPosition = 3;
		rotation = 0;
		mat4.copy(rotationMatrix, identityMatrix);
		position[0] = 0;
		translationMatrix[12] = 0;
		position[1] = unit*10;
		translationMatrix[13] = unit*10;
		spawn();
	}
	
	function spawn() {
		currentShape = nextShape;
		nextShape = ~~(Math.random()*7+1);
		currentArray = shapeArray(currentShape);
		//check to see if the new element can spawn, if not reset the game
		for (var i=0; i<16; i++)
			if (currentArray[i] != 0)
				if (gridArray[arrayPosition+~~(i/4)*10+i%4] != 0) {
					clearInterval(timer);
					score = 0;
					rowsCleared = 0;
					difficulty = 0;
					gridArray = new Array(220).fill(0);
					blockPositionBuffer.num_items = 0;
					document.getElementById("score").innerHTML = score;
					timer = setInterval(translateDown, 500);
					break;
				}
		gl.useProgram(program);
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getVert(currentShape)), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nextColor), gl.STATIC_DRAW);
		nextColor = getColor();
		
		//draw the next shape
		nextgl.bindBuffer(nextgl.ARRAY_BUFFER, nextPositionBuffer);
		nextgl.bufferData(nextgl.ARRAY_BUFFER, new Float32Array(getVert(nextShape)), nextgl.STATIC_DRAW);
		nextgl.vertexAttribPointer(
				nextgl.getAttribLocation(nextProgram, "vertPosition"), 3, gl.FLOAT, false, 0, 0);
		nextgl.enableVertexAttribArray(nextgl.getAttribLocation(nextProgram, "vertPosition"));
		
		nextgl.bindBuffer(nextgl.ARRAY_BUFFER, nextColorBuffer);
		nextgl.bufferData(nextgl.ARRAY_BUFFER, new Float32Array(nextColor), nextgl.STATIC_DRAW);
		nextgl.vertexAttribPointer(
				nextgl.getAttribLocation(nextProgram, "vcolor"), 3, gl.FLOAT, false, 0, 0);
		nextgl.enableVertexAttribArray(nextgl.getAttribLocation(nextProgram, "vcolor"));
		nextgl.drawArrays(nextgl.TRIANGLES, 0, 24);
		
		draw();
	}
	
	function clearRows() {
		//check to see if each row is occupied. If yes, delete that row and move everything 1 block down.
		var counter = 0;
		var empty = 0;
		for (var i=21; i>1; i--) {
			for (var j=0; j<10; j++)
				if (gridArray[i*10+j] != 0) {
					counter++;
					empty = 0;
				}
				else empty++;
			if (counter == 10) {
				for (var k=i; k>1; k--) {
					for (var j=0; j<10; j++) 
						gridArray[k*10+j] = gridArray[(k-1)*10+j];
				}
				i++;
				rowsCleared++;
				score += (100 + difficulty*50);
				if (rowsCleared%10 == 0) {
					difficulty++;
					if (difficulty <= 10) {
						clearInterval(timer);
						timer = setInterval(translateDown, 500 - difficulty*25);
					}
				}
			}
			if (empty > 15) break; //if more than 15 consecutive blocks are empty it means there is nothing else in the grid; it's safe to stop
			counter = 0;
		}
	}