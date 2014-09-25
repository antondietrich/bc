var Debugger = {
	lines: [],
	window: 0,

	Initialize: DebuggerInit,
	SetLine: DebuggerSetLine,
	Update: DebuggerUpdate
}

function DebuggerInit( viewport )
{
	Debugger.window = document.createElement("div");
	Debugger.window.id = "debug";
	viewport.appendChild(Debugger.window);
}

function DebuggerSetLine( lineId, text )
{
	if(!__DEBUG__)
		return;
	Debugger.lines[ lineId ] = lineId + ": " + text;
	Debugger.Update();
}

function DebuggerUpdate()
{
	var text = "";
	for( var key in Debugger.lines )
	{
		text += "<p>" + Debugger.lines[key] + "</p>";
	}
	Debugger.window.innerHTML = text;
}
