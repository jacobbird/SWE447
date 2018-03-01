var gl = null;
var cone = null;
function init() {
    var canvas = document.getElementById( "webgl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    

    if ( !gl ) {
        alert("Unable to setup WebGL");
        return;
    }

    cone = new Cone(gl, 50);
    
    gl.clearColor( 0.0, 0.0, 1.0, 1.0 );
    
    render();
}

function render() {
    
  time += timeDelta;
  var rotAxis = [0,1,1];
  var ms = new MatrixStack();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Specify the viewing transformation, and use it to initialize the 
  // matrix stack

  V = translate(0.0, 0.0, -0.5*(near + far));
  ms.load(V);  

  // Create a few temporary variables to make it simpler to work with
  // the various properties we'll use to render the planets.  The Planets
  // dictionary (created in init()) can be indexed by each planet's name.
  // We'll use the temporary variables "planet" to reference the geometric
  // information (e.g., sphere model) we created in the Planets array.
  // Likewise, we'll use "data" to reference the database of information
  // about the planets in SolarSystem.  Look at how these are
  // used; it'll simplify the work you need to do.
  //  Add your code for more planets here!
  //
	
  planet.PointMode = false;
	
  ms.push();
  
  ms.rotate(25, rotAxis); 
  
  
  gl.useProgram(cone.program);
  gl.uniformMatrix4fv(cone.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(cone.uniforms.P, false, flatten(P));
  gl.uniform4fv(cone.uniforms.color, flatten(data.color));

  cone.render();
  ms.pop();
    
    
    
}

window.onload = init;
