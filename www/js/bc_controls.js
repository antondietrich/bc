//********************/
//	Layers Control
//********************/

var LayersControl = {
	container: 0,
	layers: {},

	Initialize: LayerControlInit,
	AddLayer: LayerControlAdd

}

function LayerControlInit( width )
{
	var div = document.createElement("div");
		div.id = "layersControl";
		//div.style.width = width - 10 + "px";

	var header = document.createElement("h3");
		header.innerHTML = "Layers";

	div.appendChild(header);
	LayersControl.container = div;
	Engine.controlsArea.elem.appendChild(div);
}

function LayerControlAdd( layer )
{
	var div = document.createElement("div");

	var checkBox = document.createElement("input");
		checkBox.type="checkbox";
		checkBox.checked = true;
	var span = document.createElement("span");
	var label = document.createElement("label");
		label.title = "Toggle visibility";

	var name = layer.name.replace(" ", "_");

	checkBox.id = name + "VisibilityControl";
	label.htmlFor = checkBox.id;
	label.innerHTML = name;

	LayersControl.layers[name] = layer;

	checkBox.onchange = function() {
		var id = this.id.substr( 0, this.id.indexOf("VisibilityControl") );
		if( !this.checked )
			LayersControl.layers[ id ].elem.style.visibility = "hidden";
		else
			LayersControl.layers[ id ].elem.style.visibility = "visible";
	}

	label.appendChild(checkBox);
	label.appendChild(span);
	div.appendChild(label);
		LayersControl.container.appendChild(div);
}