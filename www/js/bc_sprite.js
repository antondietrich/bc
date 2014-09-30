var DIRECTION = {
	N: 1,
	S: 2,
	E: 4,
	W: 8,
	Ne: 16,
	Nw: 32,
	Se: 64,
	Sw: 128
}

var SIDE = {
	NONE: 0,
	N: DIRECTION.N,
	S: DIRECTION.S,
	E: DIRECTION.E,
	W: DIRECTION.W,
	NE: DIRECTION.N | DIRECTION.E,
	NW: DIRECTION.N | DIRECTION.W,
	SE: DIRECTION.S | DIRECTION.E,
	SW: DIRECTION.S | DIRECTION.W,
	NS: DIRECTION.N | DIRECTION.S,
	EW: DIRECTION.E | DIRECTION.W,
	NSEW: DIRECTION.N | DIRECTION.S | DIRECTION.E | DIRECTION.W,
	NNeE: DIRECTION.N | DIRECTION.Ne | DIRECTION.E,
	NNwW: DIRECTION.N | DIRECTION.Nw | DIRECTION.W,
	SSeE: DIRECTION.S | DIRECTION.Se | DIRECTION.E,
	SSwW: DIRECTION.S | DIRECTION.Sw | DIRECTION.W,
	NEW: DIRECTION.N | DIRECTION.E | DIRECTION.W,
	SEW: DIRECTION.S | DIRECTION.E | DIRECTION.W,
	NSE: DIRECTION.N | DIRECTION.S | DIRECTION.E,
	NSW: DIRECTION.N | DIRECTION.S | DIRECTION.W,
	NNeNwEW: DIRECTION.N | DIRECTION.Ne | DIRECTION.Nw | DIRECTION.E | DIRECTION.W,
	SSeSwEW: DIRECTION.S | DIRECTION.Se | DIRECTION.Sw | DIRECTION.E | DIRECTION.W,
	NNeSSeE: DIRECTION.N | DIRECTION.Ne | DIRECTION.S | DIRECTION.Se | DIRECTION.E,
	NNwSSwW: DIRECTION.N | DIRECTION.Nw | DIRECTION.S | DIRECTION.Sw | DIRECTION.W,
	ALL: 255
}

var Sprites = {
	Initialize: SpritesInit,
	Apply: SpritesApply,

	size: 0,

	grass: 0,
	river: 0,
	road: 0,
	bridge: 0,

	bad: 0
}

function SpritesInit( size )
{
	Sprites.size = size;
	Sprites.grass = new Sprite( "grass.png", [ 0 ] );
	Sprites.river = new Sprite( "river.png", [ SIDE.NE, SIDE.NW, SIDE.SE, SIDE.SW, SIDE.NS, SIDE.EW, SIDE.NEW, SIDE.SEW, SIDE.NSE, SIDE.NSW ]);
	Sprites.road = new Sprite( "road.png", [ SIDE.NE, SIDE.NW, SIDE.SE, SIDE.SW, SIDE.NS, SIDE.EW, SIDE.NEW, SIDE.SEW, SIDE.NSE, SIDE.NSW, SIDE.NSEW ]);
	Sprites.bridge = new Sprite( "bridge.png", [ SIDE.NS, SIDE.EW ]);
	Sprites.wall = new Sprite( "wall.png", [ 0 ]);

	Sprites.bad = new Sprite( "bad.png", [ 0 ] );
}

function Sprite( image, sides )
{
	this.image = image;
	this.imageSize = (sides.length * 100) + "% 100%";
	this.sides = sides;
	this.GetTile = function( side ) {
		if( side > 0 )
			return "-" + (Sprites.size * BestMatch( side, this.sides ) ) + "px 0px";
		else
			return "0px 0px";
	};
}

function SpritesApply( elem, sprite, sides )
{
	elem.style.backgroundImage = "url(/sprites/" + sprite.image + ")";
	elem.style.backgroundSize = sprite.imageSize;
	elem.style.backgroundPosition = sprite.GetTile( sides );
}

function BestMatch( side, sidesArray )
{
	var index = 0;
	var match = 0;
	for( key in sidesArray )
	{
		/*if ( side === sidesArray[key] ) 
		{
			return key;
		}
		else*/ if( (side & sidesArray[key]) > match )
		{
			match = side & sidesArray[key];
			index = key;
		}
	}
	return index;
}