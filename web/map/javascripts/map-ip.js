// Set initial values for drawing the map image
var mapW, mapH;	// integers: width and height of map image
var zoom = 15; // integer: zoom level -- should always default to 0
var latitude = 39.634419;	// integer: western bound of map image (per IMS map API) 
var longitude = -79.954054;	// integer: northern bound of map image (per IMS map API)
var hasMoved = false;	// boolean: has the map been scrolled or zoomed?
var mapType = "roadmap"; // base map type to use in displaying the google static map
var maxZoom = 17;	// integer: max zoom-in level
var minZoom = 12;	// integer: max zoom-out level
var mapBaseURL = "http://maps.google.com/staticmap";	// base URL for an image served by the mapping engine
var detailBaseURL = "detail.php?";	// base URL for the normal map detail screen
var fullscreenBaseURL = "detail-fullscreen.php?";	// base URL for the fullscreen map detail screen


function jumpbrowse(objSelect) {
// Use the value of the 'browse by' select control to jump to a different browse page
	if(objSelect) {
		switch(objSelect.value) {
			case "number":
				document.location.href="building-number.html";
				break;
			case "name":
				document.location.href="building-name.html";
				break;
			case "residences":
				document.location.href="residences.html";
				break;
			case "rooms":
				document.location.href="rooms.html";
				break;
			case "streets":
				document.location.href="streets.html";
				break;
			case "courts":
				document.location.href="courts.html";
				break;
			case "food":
				document.location.href="food.html";
				break;
			case "parking":
				document.location.href="parking.html";
				break;
		}
	}
}


function loadImage(imageURL,imageID) {
    // Loads an image from the given URL into the image with the specified ID
	var objMap = document.getElementById(imageID);
	show("loadingimage");
	if(objMap) {
		if(imageURL!="") {
			objMap.src = imageURL;
		} else {
			objMap.src = "../../images/ip/blank.png";
		}
	}
	// Since we're loading a new map image, update the link(s) to switch between fullscreen and smallscreen modes
	var objFullscreen = document.getElementById("fullscreen");
	if(objFullscreen) {
		objFullscreen.href = getMapURL(fullscreenBaseURL, true);
	}
	var objSmallscreen = document.getElementById("smallscreen");
	if(objSmallscreen) {
		objSmallscreen.href = getMapURL(detailBaseURL, true);
	}
}


function getMapURL(strBaseURL, includeSelect) {
	// Returns a full URL for a map page or map image, using strBaseURL as the base
	var newURL = strBaseURL+"&"+"maptype="+mapType+"&"+"key="+"ABQIAAAAgl5MtLeiQwCMBX7FdoPP_BTfAZWzJoh_gYMfdqhKwTyraOPtpRSIZm3YBA6TbcecvlyiMX_gNejDzg"+"&"+"size="+mapW+"x"+mapH+"&"+"center="+latitude+","+longitude+"&"+"zoom="+zoom+"&"+"sensor="+"false",
	return(newURL);
}


function scroll(dir) {
// Scrolls the map image in the cardinal direction given by dir; amount of scrolling is scaled to zoom level and the pixel dimensions of the map image
	var objMap = document.getElementById("mapimage");
	if(objMap) {
		var mapDX, mapDY;
		if(zoom<maxZoom) {
			mapDX = mapW*(1-(zoom/2));
			mapDY = mapH*(1-(zoom/2));
		} else {
			mapDX = mapW/2.3;
			mapDY = mapH/2.3;
		}
		switch(dir) {
			case "n":
				mapBoxN = mapBoxN + mapDY;
				mapBoxS = mapBoxS + mapDY;
				loadImage(getMapURL(mapBaseURL),'mapimage');
				break;
			case "s":
				mapBoxN = mapBoxN - mapDY;
				mapBoxS = mapBoxS - mapDY;
				loadImage(getMapURL(mapBaseURL),'mapimage');
				break;
			case "e":
				mapBoxE = mapBoxE + mapDX;
				mapBoxW = mapBoxW + mapDX;
				loadImage(getMapURL(mapBaseURL),'mapimage');
				break;
			case "w":
				mapBoxE = mapBoxE - mapDX;
				mapBoxW = mapBoxW - mapDX;
				loadImage(getMapURL(mapBaseURL),'mapimage');
				break;
			case "ne":
				mapBoxN = mapBoxN + mapDY;
				mapBoxS = mapBoxS + mapDY;
				mapBoxE = mapBoxE + mapDX;
				mapBoxW = mapBoxW + mapDX;
				loadImage(getMapURL(mapBaseURL),'mapimage');
				break;
			case "nw":
				mapBoxN = mapBoxN + mapDY;
				mapBoxS = mapBoxS + mapDY;
				mapBoxE = mapBoxE - mapDX;
				mapBoxW = mapBoxW - mapDX;
				loadImage(getMapURL(mapBaseURL),'mapimage');
				break;
			case "se":
				mapBoxN = mapBoxN - mapDY;
				mapBoxS = mapBoxS - mapDY;
				mapBoxE = mapBoxE + mapDX;
				mapBoxW = mapBoxW + mapDX;
				loadImage(getMapURL(mapBaseURL),'mapimage');
				break;
			case "sw":
				mapBoxN = mapBoxN - mapDY;
				mapBoxS = mapBoxS - mapDY;
				mapBoxE = mapBoxE - mapDX;
				mapBoxW = mapBoxW - mapDX;
				loadImage(getMapURL(mapBaseURL),'mapimage');
				break;
		}
		checkIfMoved();		
	}
}


function recenter() {
// Reset the map image to its initially selected coordinates -- only if it's not already there
	if(hasMoved) {
		hasMoved = false;
		mapBoxW = selectMapBoxW;
		mapBoxN = selectMapBoxN;
		mapBoxS = selectMapBoxS;
		mapBoxE = selectMapBoxE;
		zoom = 0;	// reset zoom level
		loadImage(getMapURL(mapBaseURL),'mapimage');
		enable('zoomin');
		enable('zoomout');
		disable('recenter');
	} 
}


function zoomout() {
// Zoom the map out by an amount scaled to the pixel dimensions of the map image
	enable('zoomin');
	if(zoom > minZoom) {
		mapBoxN = mapBoxN + (mapH/2);
		mapBoxS = mapBoxS - (mapH/2);
		mapBoxE = mapBoxE + (mapW/2);
		mapBoxW = mapBoxW - (mapW/2);
		loadImage(getMapURL(mapBaseURL),'mapimage');
		zoom--;
	}
	if(zoom <= minZoom) {	// If we've reached the min zoom level
		disable('zoomout');
	}
	checkIfMoved();		
}


function zoomin() {
// Zoom the map in by an amount scaled to the pixel dimensions of the map image
	enable('zoomout');
	if(zoom < maxZoom) {
		mapBoxN = mapBoxN - (mapH/2);
		mapBoxS = mapBoxS + (mapH/2);
		mapBoxE = mapBoxE - (mapW/2);
		mapBoxW = mapBoxW + (mapW/2);
		loadImage(getMapURL(mapBaseURL),'mapimage');
		zoom++;
	}
	if(zoom >= maxZoom) {	// If we've reached the max zoom level
		disable('zoomin');
	}
	checkIfMoved();		
}


function rotateMap() {
// Load a rotated map image
	var objMap = document.getElementById("mapimage");
	
	// insert some code here to calculate the full URL w/ arguments for the map graphic in both tall (tallMapURL) and wide (wideMapURL) versions
	
	if(objMap) {
		show("loadingimage");
		switch(window.orientation)
		{
			case 0:
			case 180:
				mapW = 320;
				mapH = 416;
			break;
	
			case -90:
			case 90:
				mapW = 480;
				mapH = 268;
			break;
	
		}
		loadImage(getMapURL(mapBaseURL),'mapimage'); 
	}
}



function rotateMapAlternate() {
// Load a rotated map image - needs work to get innerWidth and innerHeight working correctly -- will be required once firmware 2.0 is released enabling full-screen chromeless browsing
	var objMap = document.getElementById("mapimage");
	if(objMap) {
		show("loadingimage");
		mapW = window.innerWidth;
		mapH = window.innerHeight;
		loadImage(getMapURL(mapBaseURL),'mapimage'); 
		alert(mapW + " x " + mapH);
	}
}



function checkIfMoved() {
// Check to see if the map has been moved (zoomed or scrolled) away from its initial position, and disable/enable the 'recenter' button accordingly
	hasMoved = !((mapBoxW == selectMapBoxW) && (mapBoxN == selectMapBoxN) && (mapBoxS == selectMapBoxS) && (mapBoxE == selectMapBoxE));
	if(hasMoved) {
		enable('recenter');
	} else {
		disable('recenter');
	}

}


function disable(strID) {
// Visually dims and disables the anchor whose id is strID
	var objA = document.getElementById(strID);
	if(objA) {
		if(objA.className.indexOf("disabled") == -1) { // only disable if it's not already disabled!
			objA.className = objA.className + " disabled";
		}
	}
}


function enable(strID) {
// Visually undims and re-enables the anchor whose id is strID
	var objA = document.getElementById(strID);
	if(objA) {
		objA.className = objA.className.replace("disabled","");
	}
}


function saveOptions(strFormID) {
// Applies full-screen map-option changes and hides the form
	var newLayers = "Towns,Hydro,Greenspace,Sport,Courtyards,Roads,Rail,Landmarks,Parking,Other+Buildings,Buildings,";
	
	// Code to manipulate the string newLayers should go here, based on what the user toggled in the form
	
	if(document.mapform.chkLabelBuildings.checked) { newLayers = newLayers + "," + document.mapform.chkLabelBuildings.value; }
	if(document.mapform.chkLabelRoads.checked) { newLayers = newLayers + "," + document.mapform.chkLabelRoads.value; }
	if(document.mapform.chkLabelCourts.checked) { newLayers = newLayers + "," + document.mapform.chkLabelCourts.value; }
	if(document.mapform.chkLabelLandmarks.checked) { newLayers = newLayers + "," + document.mapform.chkLabelLandmarks.value; }
	if(document.mapform.chkLabelParking.checked) { newLayers = newLayers + "," + document.mapform.chkLabelParking.value; }
	
	if(newLayers!=mapLayers) { 	// Only load a new map image if the user actually changed some options
		mapLayers = newLayers;
		loadImage(getMapURL(mapBaseURL),'mapimage'); 
	}

	hide("options");
}


function cancelOptions(strFormID) {
// Should cancel map-option changes and hide the form; this is just a stub for future real function
	var objForm = document.getElementById(strFormID);
	if(objForm) { objForm.reset() }
	hide("options"); 
}


