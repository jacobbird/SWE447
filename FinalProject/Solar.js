
/////////////////////////////////////////////////////////////////////////////
//
//  Solar.js
//
/////////////////////////////////////////////////////////////////////////////

var canvas;
var gl;
var count;
var mat;

//---------------------------------------------------------------------------
//
//  Declare our array of planets (each of which is a sphere)
//
// The list of planets to render.  Uncomment any planets that you are 
// including in the scene. For each planet in this list, make sure to 
// set its distance from the Sun, as well its size, color, and orbit
// around the Sun. 

var Planets = {
  Sun : undefined,
  Mercury : undefined,
  Venus : undefined,
  Earth : undefined,
  Moon : undefined,
  Mars : undefined,
  Jupiter : undefined,
  Saturn : undefined,
  Uranus : undefined,
  Neptune : undefined,
  Pluto : undefined
};


var cube = null;
var gl = null;


// Viewing transformation parameters
var V = undefined;
var M = undefined;
var angle = 0.0;
var dAngle = Math.PI / 10.0;
// Viewing transformation parameters
// matrix storing the viewing transformation

// Projection transformation parameters
var P;  // matrix storing the projection transformation
var near = 10;      // near clipping plane's distance
var far = 120;      // far clipping plane's distance

// Animation variables
var time = 0.0;      // time, our global time constant, which is 
                     // incremented every frame
var timeDelta = 0.0001; // the amount that time is updated each fraime

//---------------------------------------------------------------------------
//
//  init() - scene initialization function
//

function init() {
  canvas = document.getElementById("webgl-canvas");
  count = 0;
  // Configure our WebGL environment
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) { alert("WebGL initialization failed"); }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    // Enable depth test
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);
    // Accept fragment if it closer to the camera than the former one
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    var fovy = 60.0; // degrees
    var aspect = w / h;

    cube = new Cube(gl);
    cube.P = perspective(fovy, aspect, near, far);
	
    

  mat=[];
  // Initialize the planets in the Planets list, including specifying
  // necesasry shaders, shader uniform variables, and other initialization
  // parameters.  This loops adds additinoal properties to each object
  // in the Planets object;
	
  for (var name in Planets ) {

    // Create a new sphere object for our planet, and assign it into the
    // appropriate place in the Planets dictionary.  And to simplify the code
    // assign that same value to the local variable "p", for later use.

    //if(name==="Sun"){
		//var Sun = Planets[name] = new Sphere();
	//}
	//else{
		var planet = Planets[name] = new Sphere();
	//}
    // For each planet, we'll add a new property (which itself is a 
    // dictionary) that contains the uniforms that we will use in
    // the associated shader programs for drawing the planets.  These
    // uniform's values will be set each frame in render().

    planet.uniforms = { 
      color : gl.getUniformLocation(planet.program, "color"),
      MV : gl.getUniformLocation(planet.program, "MV"),
      P : gl.getUniformLocation(planet.program, "P"),
    };
  }

  
  resize();

  window.requestAnimationFrame(render);  
}

//---------------------------------------------------------------------------
//
//  render() - render the scene
//

function render() {
  time += timeDelta;
  var rotAxis = [0,1,1];
  var ms = new MatrixStack();
 
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    V = translate(0.0, 0.0, -0.5*(near + far));
    angle += dAngle;
    offset = [ 0.0,  0.0, 0.0 ]; 
    var axis = [ 1.0, 1.0, 1.0 ];
    M = mult(translate(offset), rotate(angle, axis));

    cube.MV = mult(V, M);
    
    cube.AmbientLight = vec3(0.2, 0.2, 0.2);
  	cube.Light_color = vec3(1.0, 1.0, 1.0);
  	cube.Light_position = vec3(0.0, 0.0, 1.0);
  	cube.Shininess = 40.0;
       
    cube.render();
  // Specify the viewing transformation, and use it to initialize the 
  // matrix stack

  
  ms.load(V);  
  
  
  
  canvas.onmousedown = function(e){
	  console.log(e.clientX);
	  console.log(e.clientY);
	  initX = e.clientX;
	  initY = e.clientY;
	  
  }
  canvas.onmouseup = function(e){
	console.log(e.clientY);
	finalY = e.clientY
	  
	deltaY=initY-finalY;
  	degreesY=deltaY/20;
  	if(initX>408){ 
  		distanceX=initX-408;
  	}
  	else{
  		distanceX=408-initX;	  
	}
	
	name = "Pluto";
        planet = Planets[name];  
	
  	mat.push(new Array(degreesY, distanceX, planet));
	count = count + 1;
  }
  
  
	
  // Create a few temporary variables to make it simpler to work with
  // the various properties we'll use to render the planets.  The Planets
  // dictionary (created in init()) can be indexed by each planet's name.
  // We'll use the temporary variables "planet" to reference the geometric
  // information (e.g., sphere model) we created in the Planets array.
  // Likewise, we'll use "data" to reference the database of information
  // about the planets in SolarSystem.  Look at how these are
  // used; it'll simplify the work you need to do.

  var name, planet, data, Sun;

  name = "Sun";
  planet = Planets[name];
  data = SolarSystem[name];
  
  
  
  // Set PointMode to true to render all the vertices as points, as
  // compared to filled triangles.  This can be useful if you think
  // your planet might be inside another planet or the Sun.  Since the
  // "planet" variable is set for each object, you will need to set this
  // for each planet separately.

  planet.PointMode = true;

  // Use the matrix stack to configure and render a planet.  How you rener
  // each planet will be similar, but not exactly the same.  In particular,
  // here, we're only rendering the Sun, which is the center of the Solar
  // system (and hence, has no translation to its location).

  ms.push();
  ms.scale(data.radius);
  gl.useProgram(planet.program);
  gl.uniformMatrix4fv(planet.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(planet.uniforms.P, false, flatten(P));
  gl.uniform4fv(planet.uniforms.color, flatten(data.color));
  planet.render();
  ms.pop();
	
  
  for( i = 0; i< count; i++){	
  name = "Pluto";
  data = SolarSystem[name];
  //
  //  Add your code for more planets here!
  //
	
  planet.PointMode = false;
	
  ms.push();
  
  ms.rotate(mat[i][0]*time*1000, rotAxis); 
  ms.translate(mat[i][1]/4, 0, 0);  
  ms.scale(data.radius);
  gl.useProgram(mat[i][2].program);
  gl.uniformMatrix4fv(mat[i][2].uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(mat[i][2].uniforms.P, false, flatten(P));
  gl.uniform4fv(mat[i][2].uniforms.color, flatten(data.color));

  mat[i][2].render();
  ms.pop();
	 
  }
	
  window.requestAnimationFrame(render);
}

//---------------------------------------------------------------------------
//
//  resize() - handle resize events
//

function resize() {
  var w = canvas.clientWidth;
  var h = canvas.clientHeight;

  gl.viewport(0, 0, w, h);

  var fovy = 100.0; // degrees
  var aspect = w / h;

  P = perspective(fovy, aspect, near, far);
}

//---------------------------------------------------------------------------
//
//  Window callbacks for processing various events
//

window.onload = init;
window.onresize = resize;
