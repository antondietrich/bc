var Map = {
	width: 0,
	height: 0,
	container: 0,
	
	layers: {},

	cells: [],
	cellSize: 0,

	Initialize: MapInit,
	FromString: MapFromString,
	Rebuild: MapRebuild
}

function MapInit( container, width, height )
{
	Map.container = container;
}

function MapFromString( mapString )
{
	var stream = new TokenStream( mapString );
	Map.width = parseInt( stream.NextToken( " " ) ); // Y
	Map.height = parseInt( stream.NextToken( " " ) ); // X
	var token = "";

	Map.cellSize = Math.round( Map.container.width / Map.width );

	if( Map.cellSize * Map.height > Engine.clientArea.height )
	{
		Map.cellSize = Math.round( Engine.clientArea.height / Map.height );
	}

	Map.container.height = Map.height * Map.cellSize;

	// Init Resources
	Sprites.Initialize( Map.cellSize );
	TileTypes.Initialize();

	// cells
	Map.cells = new Array( Map.height );
	for( var x = 0; x < Map.height; x++ ) 
	{
		Map.cells[x] = new Array(Map.width);
		for (var y = 0; y < Map.width; y++)
		{
			if (!stream.eof)
				token = stream.NextToken( " " );
			else
				token = "bad";

			if( TileTypes[ token ] )
				Map.cells[x][y] = new Cell( x, y, TileTypes[ token ] );
			else
				Map.cells[x][y] = new Cell( x, y, TileTypes[ 'bad' ] );
		}
	};


	Debugger.SetLine( "map size", Map.width + " &times; " + Map.height );
	Debugger.SetLine( "cell size", Map.cellSize );

	Map.Rebuild();
}

function MapRebuild()
{
	var table = document.createElement( "table" );
	table.id = "terrain";
	table.className = "mapLayer";
	table.style.backgroundSize = (100 / Map.width) + "% " + (100 / Map.height) + "%";

	for (var x = 0; x < Map.cells.length; x++) 
	{
		var tr = document.createElement( "tr" );
		tr.style.height = Map.cellSize + "px";
		for (var y = 0; y < Map.cells[x].length; y++) 
		{
			var td = document.createElement( "td" );
			Map.cells[x][y].elem = td;
			td.style.width = Map.cellSize + "px";
			td.className = Map.cells[x][y].type.name;
			Sprites.Apply( td, Map.cells[x][y].type.sprite, GetConnectedSides( Map.cells[x][y] ) );

			tr.appendChild( td );
		}
		table.appendChild( tr );
	};
	Map.container.elem.appendChild( table );
	Map.layers['terrain'] = new MapLayer( "Terrain", table, 100, 0 );

	var grid = document.createElement("div");
	grid.id = "grid";
	grid.className = "mapLayer";
	grid.style.width = Map.cellSize * Map.width + "px";
	grid.style.height = Map.cellSize * Map.height + "px";
	grid.style.backgroundSize = (100 / Map.width) + "% " + (100 / Map.height) + "%";
	Map.container.elem.appendChild(grid);
	Map.layers['grid'] = new MapLayer( "Grid", grid, 900, 0 );
}

function Cell( x, y, type )
{
	this.coords = { x: x, y: y };
	this.elem = 0;
	this.type = type;
	this.Neighbor = CellGetNeighbor;
	return this;
}

function CellGetNeighbor( offset )
{
	// Y axis from left to right
	// X axis from top to bottom

	offset.x = offset.x || 0;
	offset.y = offset.y || 0;

	targetX = this.coords.x + offset.x;
	targetY = this.coords.y + offset.y;

	if ( targetX < 0 || targetX >= Map.height || targetY < 0 || targetY >= Map.width ) 
	{
		return this;
	};

	return Map.cells[targetX][targetY];
}

function GetConnectedSides( cell )
{
	var connectedSides = 0;
	var OFFSET = {
		N: 	{ x: -1, y:  0 },
		S: 	{ x:  1, y:  0 },
		E: 	{ x:  0, y:  1 },
		W: 	{ x:  0, y: -1 },
		Ne: 	{ x: -1, y:  1 },
		Nw: 	{ x: -1, y: -1 },
		Se: 	{ x:  1, y:  1 },
		Sw: 	{ x:  1, y: -1 },
	}
	for( key in OFFSET )
	{
		if ( cell.Neighbor( OFFSET[key] ) && Connected( cell, cell.Neighbor( OFFSET[key] ) ) ) 
		{
			connectedSides |= DIRECTION[key];
		}
	}
	cell.elem.title = "_" + connectedSides;
	return connectedSides;
}

function Connected( cellA, cellB )
{
	if (cellA.type.connectionClass && cellA.type.connectionClass.indexOf(cellB.type.name) != -1 )
	{
		return true;
	}
		
	return false;
}

/********************
	Layers
********************/

function MapLayer( name, elem, zIndex, options )
{
	this.name = name;
	this.elem = elem;
	this.elem.style.zIndex = zIndex;
	this.options = options;

	LayersControl.AddLayer( this );

	return this;
}

function SetLayerVisibility( visible )
{
	if( visible === true)
	{
		this.elem.style.visibility = "hidden";
	}
	else if( visible === false)
	{
		this.elem.style.visibility = "visible";
	}
}