/*var TypeNames = {
	G: "grass",
	W: "river",
	B: "bridge"
}*/

function TileType( name, cClass, passability, sprite )
{
	this.name = name;
	this.connectionClass = cClass;
	//this.connectsTo = cClassTo;
	this.sprite = sprite;
	this.passability = passability;
}

var TileTypes = {
	Initialize: TileTypeInit,

	G: 0, // grass
	W: 0, // water
	B: 0, // bridge
	R: 0,

	bad: 0
}

function TileTypeInit()
{
	TileTypes.G = new TileType( "grass", null, 1.0, Sprites.grass );
	TileTypes.W = new TileType( "river", "river, bridge", 0.0, Sprites.river );
	TileTypes.B = new TileType( "bridge", "river", 1.2, Sprites.bridge );
	TileTypes.R = new TileType( "road", "road, bridge", 1.6, Sprites.road );
	TileTypes.C = new TileType( "wall", null, 0.0, Sprites.wall );

	TileTypes.bad = new TileType( "bad", null, 0.0, Sprites.bad );
}