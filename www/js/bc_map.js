var Map = {
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
	var width = parseInt( stream.NextToken( " " ) );
	var height = parseInt( stream.NextToken( " " ) );
	var token = "";

	Map.cellSize = Math.round( Map.container.width / width );

	if( Map.cellSize * height > Engine.clientArea.height )
	{
		Map.cellSize = Math.round( Engine.clientArea.height / height );
	}

	Map.container.height = height * Map.cellSize;

	Map.cells = new Array( height );
	for( var i = 0; i < height; i++ ) 
	{
		Map.cells[i] = new Array(width);
		for (var t = 0; t < Map.cells[i].length; t++)
		{
			Map.cells[i][t] = { elem: 0, type: 0 };
			if (!stream.eof)
				token = stream.NextToken( " " );
			else
				token = "";

			//alert( token );

			switch( token )
			{
				case "G":
				{
					Map.cells[i][t].type = "grass";
					break;
				}
				case "W":
				{
					Map.cells[i][t].type = "river";
					break;
				}
				default:
				{
					Map.cells[i][t].type = "bad";
				}
			}
		}
	};


	Debugger.SetLine( "map size: ", width + " &times; " + height );
	Debugger.SetLine( "cell size: ", Map.cellSize );

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
			td.className = Map.cells[x][y].type;
			tr.appendChild( td );

			Map.cells[x][y].elem = td;
		}
		table.appendChild( tr );
	};
	Map.container.elem.appendChild( table );
}