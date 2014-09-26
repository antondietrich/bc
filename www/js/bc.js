var MAP_WIDTH = 21;
var MAP_HEIGHT = 9;

var Engine = {
	clientArea: 	{ width: 0, height: 0 },
	viewport: 		0,
	mapArea: 		{ width: 0, height: 0, elem: 0 },
	controlsArea: 	{ width: 0, height: 0, elem: 0 },

	Start: EngineStart
};



//***********************
//	Function definitions
//***********************
function EngineStart()
{
	// client area & viewport
	Engine.clientArea.width = window.innerWidth;
	Engine.clientArea.height = window.innerHeight;
	
	Engine.viewport = document.createElement("div");
	Engine.viewport.style.width = Engine.clientArea.width + "px";
	Engine.viewport.style.height = Engine.clientArea.height + "px";
	Engine.viewport.style.position = "relative";
	Engine.viewport.style.backgroundColor = "#eee";
	Engine.viewport.style.overflow = "hidden";
	document.body.appendChild(Engine.viewport);

	Debugger.Initialize(Engine.viewport);

	Debugger.SetLine( "ClientArea", Engine.clientArea.width + " &times; " + Engine.clientArea.height );

	// layout & cell size
	Engine.controlsArea.width = 200; 
	Engine.mapArea.width = Engine.clientArea.width - Engine.controlsArea.width;

	Engine.mapArea.elem = document.createElement("div");
	Engine.mapArea.elem.style.width = Engine.mapArea.width + "px";
	Engine.mapArea.elem.id = "mapArea";
	Engine.viewport.appendChild( Engine.mapArea.elem );

	Engine.controlsArea.elem = document.createElement("div");
	Engine.controlsArea.elem.style.width = Engine.controlsArea.width + "px";
	Engine.controlsArea.elem.id = "controlsArea";
	Engine.viewport.appendChild( Engine.controlsArea.elem );

	// map
	var mapString = "21 13 G G G G G W G G G G G G G G G R G G G G G G G G G G W G G G G G R R R R R R R R R R G G G G G W W G G G R R G G G R G G G G G R R R R G G W W G R R G G G G R G W W W W G G G R R R R B R R G G G W W B W W G G G G G G G G G G W G G G G W W G R G G G G G G G G G G G G W G G W W W G G R G G G G G G G G G G G G W G W W G G G G R G G G G G G G G G G W W W W W G G G G G R R G G G G G G G W W W G G G G G G G G G G R R R R R G G G W G G G G G G G G G G G G G G G G G G G G W G G G G G G G G G G G G G G G G G G G G W G G G G G G G G G G G G G G G G G ";
	Map.Initialize( Engine.mapArea, Engine.mapArea.width, Engine.mapArea.height );
	Map.FromString( mapString );
}