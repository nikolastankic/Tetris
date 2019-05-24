function getVert(shape) {
		switch (shape) {
		case 1 : // I
			return [
				2, 0,  0, 
		        1, 0,  0, 
		        2, 1,  0, 
		        1, 0,  0, 
		        2, 1,  0, 
		        1, 1,  0,
		        
		        1, 0, 0,
		        0, 0, 0,
		        1, 1, 0,
		        0, 0, 0,
		        1, 1, 0,
		        0, 1, 0,
		        
		        0, 0, 0,
		        -1, 0, 0,
		        0, 1, 0,
		        -1, 0, 0,
		        0, 1, 0,
		        -1, 1, 0,
		        
		        -1, 0, 0,
		        -2, 0, 0,
		        -1, 1, 0,
		        -2, 0, 0,
		        -1, 1, 0,
		        -2, 1, 0
			];
		case 2 : // T
			return [
				0, -1,  0, 
		        0, 0,  0, 
		        1, -1,  0, 
		        0, 0,  0, 
		        1, -1,  0, 
		        1, 0,  0,
		        
		        0, 0, 0,
		        0, 1, 0,
		        1, 0, 0,
		        0, 1, 0,
		        1, 0, 0,
		        1, 1, 0,
		        
		        -1, 0, 0,
		        -1, 1, 0,
		        0, 0, 0,
		        -1, 1, 0,
		        0, 0, 0,
		        0, 1, 0,
		        
		        1, 0, 0,
		        1, 1, 0,
		        2, 0, 0,
		        1, 1, 0,
		        2, 0, 0,
		        2, 1, 0,
			];
		case 3 :  // O
			return [
				-1, -1, 0, 
		        -1, 0, 0, 
		        0, -1, 0, 
		        -1, 0, 0, 
		        0, -1, 0, 
		        0, 0,  0,
		        
		        -1, 0, 0,
		        -1, 1, 0,
		        0, 0, 0,
		        -1, 1, 0,
		        0, 0, 0,
		        0, 1, 0,
		        
		        0, -1, 0,
		        0, 0, 0,
		        1, -1, 0,
		        0, 0, 0,
		        1, -1, 0,
		        1, 0, 0,
		        
		        0, 0, 0,
		        0, 1, 0,
		        1, 0, 0,
		        0, 1, 0,
		        1, 0, 0,
		        1, 1, 0,
			]
		case 4 : // L
			return [
				-1, -1, 0, 
		        -1, 0, 0, 
		        0, -1, 0, 
		        -1, 0, 0, 
		        0, -1, 0, 
		        0, 0, 0,
		        
		        -1, 0, 0,
		        -1, 1, 0,
		        0, 0, 0,
		        -1, 1, 0,
		        0, 0, 0,
		        0, 1, 0,
		        
		        -1, 1, 0,
		        -1, 2, 0,
		        0, 1, 0,
		        -1, 2, 0,
		        0, 1, 0,
		        0, 2, 0,
		        
		        0, -1, 0,
		        0, 0, 0,
		        1, -1, 0,
		        0, 0, 0,
		        1, -1, 0,
		        1, 0, 0,
			]
		case 5 : // J
			return [
				-1, -1, 0,
		        -1, 0, 0,
		        0, -1, 0,
		        -1, 0, 0,
		        0, -1, 0,
		        0, 0, 0,
		        
				0, -1, 0, 
		        0, 0, 0, 
		        1, -1, 0, 
		        0, 0, 0, 
		        1, -1, 0, 
		        1, 0, 0,
		        
		        0, 0, 0,
		        0, 1, 0,
		        1, 0, 0,
		        0, 1, 0,
		        1, 0, 0,
		        1, 1, 0,
		        
		        0, 1, 0,
		        0, 2, 0,
		        1, 1, 0,
		        0, 2, 0,
		        1, 1, 0,
		        1, 2, 0,
			]
		case 6 : // Z
			return [
				-1, 0, 0,
				-1, 1, 0,
				0, 0, 0,
				-1, 1, 0,
				0, 0, 0,
				0, 1, 0,
				
				0, -1, 0, 
		        0, 0, 0, 
		        1, -1, 0, 
		        0, 0, 0, 
		        1, -1, 0, 
		        1, 0, 0,
		        
		        0, 0, 0,
		        0, 1, 0,
		        1, 0, 0,
		        0, 1, 0,
		        1, 0, 0,
		        1, 1, 0,
		        
		        1, -1, 0,
		        1, 0, 0,
		        2, -1, 0,
		        1, 0, 0,
		        2, -1, 0,
		        2, 0, 0,
			]
		case 7 : //S
			return [
				-1, -1, 0,
		        -1, 0, 0,
		        0, -1, 0,
		        -1, 0, 0,
		        0, -1, 0,
		        0, 0, 0,
		        
		        0, -1, 0, 
		        0, 0, 0, 
		        1, -1, 0, 
		        0, 0, 0, 
		        1, -1, 0, 
		        1, 0, 0,
		        
		        0, 0, 0,
		        0, 1, 0,
		        1, 0, 0,
		        0, 1, 0,
		        1, 0, 0,
		        1, 1, 0,
		        
		        1, 0, 0,
		        1, 1, 0,
		        2, 0, 0,
		        1, 1, 0,
		        2, 0, 0,
		        2, 1, 0,
			]
			default : return getVert(1);
		}
	}

function getColor() {
	var help = new Array();
	var helpIndex = 0;
	var rand = [Math.round(Math.random()*10)/10, Math.round(Math.random()*10)/10, Math.round(Math.random()*10)/10];
		for (var i=0; i<24; i++) 
			help = help.concat([Math.round(Math.random()*10)/10, Math.round(Math.random()*10)/10, Math.round(Math.random()*10)/10]);
		return help;
}

function shapeArray(shape) {
	switch (shape) {
	case 1 : // I
		return [
			0, 0, 0, 0,
			1, 1, 1, 1,
			0, 0, 0, 0,
			0, 0, 0, 0
		]
	case 2 : // T
		return [
			0, 0, 0, 0,
			0, 1, 1, 1,
			0, 0, 1, 0,
			0, 0, 0, 0
		]
	case 3 : // O
		return [
			0, 0, 0, 0,
			0, 1, 1, 0,
			0, 1, 1, 0,
			0, 0, 0, 0
		]
	case 4 : // L
		return [
			0, 1, 0, 0,
			0, 1, 0, 0,
			0, 1, 1, 0,
			0, 0, 0, 0
		]
	case 5 : // J
		return [
			0, 0, 1, 0,
			0, 0, 1, 0,
			0, 1, 1, 0,
			0, 0, 0, 0
		]
	case 6 : // Z
		return [
			0, 0, 0, 0,
			0, 1, 1, 0,
			0, 0, 1, 1,
			0, 0, 0, 0
		]
	case 7 : // S
		return [
			0, 0, 0, 0,
			0, 0, 1, 1,
			0, 1, 1, 0,
			0, 0, 0, 0
		]
	}
}

function arrayToVert() {
	var help = new Array();
	var helpIndex = 0;
	var counter = 0;
	var empty = 0;
	for (var i=219; i>=0; i--) {
		if (gridArray[i] != 0) {
			help[helpIndex++] = i%10; // x
			help[helpIndex++] = 22 - ~~(i/10); //y
			help[helpIndex++] = 0; //z
			
			help[helpIndex++] = i%10; // x
			help[helpIndex++] = 22 - ~~(i/10) + 1; //y
			help[helpIndex++] = 0; //z
			
			help[helpIndex++] = i%10 + 1; // x
			help[helpIndex++] = 22 - ~~(i/10); //y
			help[helpIndex++] = 0; //z
			
			help[helpIndex++] = i%10; // x
			help[helpIndex++] = 22 - ~~(i/10) + 1; //y
			help[helpIndex++] = 0; //z
			
			help[helpIndex++] = i%10 + 1; // x
			help[helpIndex++] = 22 - ~~(i/10); //y
			help[helpIndex++] = 0; //z
			
			help[helpIndex++] = i%10 + 1; // x
			help[helpIndex++] = 22 - ~~(i/10) + 1; //y
			help[helpIndex++] = 0; //z
			
			counter += 6;
			empty = 0;
		}
		else empty++;
		if (empty > 15) break;
	}
	blockPositionBuffer.num_items = counter;
	return help;
}

function arrayToColor() {
	var help = new Array();
	var helpIndex = 0;
	for (var i=219; i>0; i--) {
		if (gridArray[i] != 0) {
			for (var j=0; j<6; j++)
				help = help.concat([0.3, 0.3, 0.3]);
		}
	}
	return help;
}