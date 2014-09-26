var Map = {
	width: 0,
	height: 0,
	container: 0,
	/*pixelSize: { width: 0, height: 0 },*/

	cells: [],
	cellSize: 0,

	Initialize: MapInit,
	FromString: MapFromString,
	Rebuild: MapRebuild
}

function MapInit( container, width, height )
{
	Map.container = container;
	//Map.pixelSize.width = width;
	//Map.pixelSize.height = height;
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

	Map.cells = new Array( Map.height );
	for( var x = 0; x < Map.height; x++ ) 
	{
		Map.cells[x] = new Array(Map.width);
		for (var y = 0; y < Map.width; y++)
		{
			Map.cells[x][y] = new Cell( x, y, null );
			if (!stream.eof)
				token = stream.NextToken( " " );
			else
				token = "";

			// Set tile type
			switch( token )
			{
				case "G":
				{
					Map.cells[x][y].type =  new TypeObject( "grass" );
					break;
				}
				case "W":
				{
					Map.cells[x][y].type = new TypeObject( "river" );
					break;
				}
				case "B":
				{
					Map.cells[x][y].type = new TypeObject( "bridge" );
					break;
				}
				default:
				{
					Map.cells[x][y].type = new TypeObject( "bad" );
				}
			}
		}
	};


	Debugger.SetLine( "map size", Map.width + " &times; " + Map.height );
	Debugger.SetLine( "cell size", Map.cellSize );

	Map.Rebuild();
}

function MapRebuild()
{
	var table = document.createElement( "table" );
	table.id = "map";

	for (var x = 0; x < Map.cells.length; x++) 
	{
		var tr = document.createElement( "tr" );
		tr.style.height = Map.cellSize + "px";
		for (var y = 0; y < Map.cells[x].length; y++) 
		{
			var td = document.createElement( "td" );
			td.style.width = Map.cellSize + "px";
			td.className = Map.cells[x][y].type.name;
			tr.appendChild( td );

			Map.cells[x][y].elem = td;
		}
		table.appendChild( tr );
	};
	MapFixTiles();
	Map.container.elem.appendChild( table );
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

	if ( targetX < 0 || targetX >= Map.height ) 
	{
		return {type: { name: "river"} };
	};
	if ( targetY < 0 || targetY >= Map.width ) 
	{
		return {type: { name: "river"} };
	};

	return Map.cells[targetX][targetY];
}

function MapFixTiles()
{
	for( var x = 0; x < Map.height; x++ )
	{
		for( var y = 0; y < Map.width; y++ )
		{
			if (Map.cells[x][y].type.name == "river") 
			{
				MapSetRiverTileOffset( Map.cells[x][y] );
			};
			if (Map.cells[x][y].type.name == "bridge") 
			{
				MapSetBridgeTileOffset( Map.cells[x][y] );
			};
		}
	}
}

function MapSetRiverTileOffset( cell )
{
	var bpX = Map.cellSize;
	var bpY = Map.cellSize;

	var isRiver = {
		n: false,
		s: false,
		e: false,
		w: false,
		ne: false,
		nw: false,
		se: false,
		sw: false
	};

	var DIR = {
		NORTH: { x: -1, y: 0 },
		SOUTH: { x: 1, y: 0 },
		EAST: { x: 0, y: 1 },
		WEST: { x: 0, y: -1 }
	}

	// NORTH
	if ( cell.Neighbor( DIR.NORTH ) && (cell.Neighbor( DIR.NORTH ).type.name == "river" || cell.Neighbor( DIR.NORTH ).type.name == "bridge" ) ) 
		isRiver.n = true;
	// SOUTH
	if ( cell.Neighbor( DIR.SOUTH ) && (cell.Neighbor( DIR.SOUTH ).type.name == "river" || cell.Neighbor( DIR.SOUTH ).type.name == "bridge" ) ) 
		isRiver.s = true;
	// EAST
	if ( cell.Neighbor( DIR.EAST ) && (cell.Neighbor( DIR.EAST ).type.name == "river" || cell.Neighbor( DIR.EAST ).type.name == "bridge" ) ) 
		isRiver.e = true;
	// WEST
	if ( cell.Neighbor( DIR.WEST ) && (cell.Neighbor( DIR.WEST ).type.name == "river" || cell.Neighbor( DIR.WEST ).type.name == "bridge" ) ) 
		isRiver.w = true;
	
	// NOT CURRENTLY SUPPORTED
	// NORTH-EAST
	if ( cell.Neighbor( { x: -1, y: 1 } ) && cell.Neighbor( { x: -1, y: 1 } ).type.name == "river" ) 
		isRiver.ne = true;
	// NORTH-WEST
	if ( cell.Neighbor( { x: -1, y: -1 } ) && cell.Neighbor( { x: -1, y: -1 } ).type.name == "river" ) 
		isRiver.nw = true;
	// SOUTH-EAST
	if ( cell.Neighbor( { x: 1, y: 1 } ) && cell.Neighbor( { x: 1, y: 1 } ).type.name == "river" ) 
		isRiver.se = true;
	// SOUTH-WEST
	if ( cell.Neighbor( { x: 1, y: -1 } ) && cell.Neighbor( { x: 1, y: -1 } ).type.name == "river" ) 
		isRiver.sw = true;

	if ( isRiver.e ) 
	{
		bpX -= Map.cellSize;
	};
	if ( isRiver.w ) 
	{
		bpX += Map.cellSize;
	};
	if ( isRiver.s ) 
	{
		bpY -= Map.cellSize;
	};
	if ( isRiver.n ) 
	{
		bpY += Map.cellSize;
	};
	if ( isRiver.n && isRiver.s ) 
	{
		bpY = Map.cellSize * 3;
		bpX = 0;
	};
	if ( isRiver.e && isRiver.w ) 
	{
		bpY = Map.cellSize * 3;
		bpX = Map.cellSize * 2;
	};
	if ( isRiver.n && isRiver.s && isRiver.e && isRiver.w ) 
	{
		bpY = Map.cellSize * 3;
		bpX = Map.cellSize * 1;
	};
	if ( isRiver.n && isRiver.s && isRiver.e && isRiver.w &&
		 isRiver.ne && isRiver.se && isRiver.nw && isRiver.sw ) 
	{
		bpY = Map.cellSize * 1;
		bpX = Map.cellSize * 1;
	};

	cell.elem.style.backgroundPosition = "-" + bpX + "px -" + bpY + "px";
}

function MapSetBridgeTileOffset( cell )
{
	var DIR = {
		NORTH: { x: -1, y: 0 },
		SOUTH: { x: 1, y: 0 },
		EAST: { x: 0, y: 1 },
		WEST: { x: 0, y: -1 }
	}

	if( cell.Neighbor( DIR.NORTH ) && (cell.Neighbor( DIR.NORTH ).type.name == "river" ) )
		cell.elem.style.backgroundPosition = "0px 0px";
	if( cell.Neighbor( DIR.EAST ) && (cell.Neighbor( DIR.EAST ).type.name == "river" ) )
		cell.elem.style.backgroundPosition = "-" + Map.cellSize + "px 0px";
}

function TypeObject(name, cClass)
{
	this.name = name;
	this.connectionClass = cClass;

	return this;
}