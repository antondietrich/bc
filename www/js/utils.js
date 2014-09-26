function TokenStream( string )
{
	this.position = 0;
	this.stream = string;
	this.eol = false;
	this.NextToken = function( delimiter ) {
		var token = "";
		while( this.stream.substr( this.position, delimiter.length ) === delimiter )
			this.position += delimiter.length;
		if ( this.position >= this.stream.length ) 
			return false;

		var endPosition = this.stream.indexOf( delimiter, this.position );
		if ( endPosition === -1 )
		{
			endPosition = this.stream.length;
			this.eol = true;
		}
		token = this.stream.substring( this.position, endPosition );
		this.position = endPosition;
		return token;
	}
	return this;
}

function GetIndex( item, array )
{
	for( key in array )
	{
		if( item === array[key] )
			return key;
	}
	return null;
}