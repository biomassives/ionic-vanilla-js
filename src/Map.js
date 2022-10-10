   		 const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmdHpqbHpyb3RlanBxcWRvdnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTUzMjY1NDksImV4cCI6MTk3MDkwMjU0OX0.edZGvym_mX4Kz5VGfg4f6UZhV6_MUseugokWE5UCbyQ"
		 const supabaseUrl = "https://yftzjlzrotejpqqdovyb.supabase.co"	 
		 const _supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);


		if (!('bluetooth' in navigator)) {
			console.log('Bluetooth API not supported on your browser.');
		}

		console.log("love");

/*
		function fetchJSON(url) {
			return fetch(url)
			  .then(function(response) {
				return response.json();
			  });
		  }
		var data = fetchJSON('/garbagemap_google_export_jun15_2022/Waste-Pile-Photos.geojson')
		.then(function(data) { return data; alert("got here") })
*/


		if (localStorage.getItem("user") == null) {

			const random = (length = 8) => {
				// Declare all characters
				let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';			
				// Pick characers randomly
				let str = '';
				for (let i = 0; i < length; i++) {
					str += chars.charAt(Math.floor(Math.random() * chars.length));
				}			
				return str;			
			};
			localStorage.setItem('userhash', random(20));
			localStorage.setItem('user', random(20));
 			console.log(" user initialized ");
		}
		var userhash = localStorage.getItem("userhash");

		var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			osm = L.tileLayer(osmUrl, {maxZoom: 29, attribution: osmAttrib}),
			map = new L.Map('map', {layers: [osm], center: new L.LatLng( -1.5365, 37.1357 ), zoom: 10 });

		var drawnItems = new L.FeatureGroup();
		map.addLayer(drawnItems);



		// get user hash signifier
		var localuserhash = localStorage.getItem('userhash');
		var polyLayers = [];
		var markerLayers = [];
			


		// display individual features from local storage lookuptable

		//
		//  features index lookup table from localstorage
		//  them load each feature individually
		//
		//
		var layer = [];

		if (localStorage.getItem("leafletFeatureIndex") !== null) {
			var featureindex = localStorage.getItem("leafletFeatureIndex");
			const newArr = featureindex.split(',');

			console.log("Feature index");
			console.log(featureindex);

			const markerIcon = L.icon({
				iconSize: [25, 41],
				iconAnchor: [10, 41],
				popupAnchor: [2, -40],
				// specify the path here
				iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
				shadowUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png"
			});

			// initialize variable array for use in building polygons from polylines
			var newPolygonLatlngArray = [];

			// loop through index and add features from individual localStorage entries	
			newArr.forEach(element => {
				const loopi = localStorage.getItem(element);
				console.log("loop")
				console.log(loopi)
				const obj = JSON.parse(loopi)
				console.log(obj.data)
				console.log("featuretype 0 ")

				console.log(obj.featuretype[0])
				
				if (obj.featuretype[0] === "polygon" || obj.featuretype[0] === "rectangle") {

					var polygon5 =	 L.polygon(obj.data).bindPopup("<b>"+ obj.featuretype[0]+
					obj.featureid+"</b><br/>Density:"+obj.density+"<br/>"+"Description:"+
					obj.description+"<br/>Tags:"+
					obj.rating);
					polyLayers.push(polygon5)

				} else if (obj.featuretype[0] === "polyline") {

					var polygon5 =	 L.polyline(obj.data).bindPopup("<b>"+ obj.featuretype[0]+
					obj.featureid+"</b><br/>Density:"+
					obj.density+"<br/>"+"Description:"+
					obj.description+"<br/>Tags:"+
					obj.rating);
					polyLayers.push(polygon5) 
//					
//
					obj.data.forEach( function(element) {
						console.log('element');
						console.log(JSON.stringify(element));
						newPolygonLatlngArray.push(L.latLng(element))

					});
				
				} else if (obj.featuretype[0] === "marker") {


				//	var markers = new L.FeatureGroup();
				//	map.addLayer(markers);
					const marker = L.marker({ lat: obj.data[0][0], lng: obj.data[0][1]  },{icon:markerIcon}).bindPopup("<b>"+ obj.featuretype[0]+
					obj.featureid+"</b><br/>Density:"+obj.density+
					"<br/>"+"Description:"+
					obj.description+"<br/>Tags:"+
					obj.rating); 
//					alert(obj.data)
					markerLayers.push(marker) 

				} else {
				// circle

				}
			
				console.log(element);
			});	
				
			console.log(newArr);
		}
		
/*
		function showConvexHull(newPolygonLatlngArray) {  
						

	//		layer = e.layer;
	
			newPolygonLatlngArray.forEach(function(element) { L.marker(element).addTo(map)});
			var points = newPolygonLatlngArray.map(function (element) {
				return {
					x: element.lat,
					y: element.lng
					}
				}
			)
			var convexHullPoints = convexHull(points);
			var leafletHull = convexHullPoints.map(function (element) {return ([element.x,element.y])})


 

 

//			const Hull = grid.addTo(grid)
//			var grid2 =	leafletHull.addData(grid);
			// add proper format for convexHull
			var convexHullPolygon = L.polygon(leafletHull).addTo(map);
			
//			var convexHullGrid = L.polygon(grid).addTo(map);

			
			var drawnGrid = new L.FeatureGroup();
			map.addLayer(drawnGrid);

			//var bounds = convexHullPolygon.getBounds();
			//		map.fitBounds(bounds);
			//		drawnItems.addLayer(layer);
		}

		// call polygon construction from collection of polylines
		if ( newPolygonLatlngArray !== undefined ) {

			if ( newPolygonLatlngArray[1] !== undefined ) {
				showConvexHull( newPolygonLatlngArray );
				var drawnItems = new L.FeatureGroup();
				map.addLayer(drawnItems);
			}
		}

		for(layer of polyLayers) {
			drawnItems.addLayer(layer);
		}
*/

		// Add the layers to the drawnItems feature group 
		for(layer of markerLayers) {
			console.log("loopio marker, marker, markers now!!!")
			drawnItems.addLayer(layer);
		}
	
		// Set the title to show on the polygon button
		L.drawLocal.draw.toolbar.buttons.polygon = 'Create a polygon';
		var drawControl = new L.Control.Draw({
			position: 'bottomleft',
			draw: {
				polyline: {
					metric: true
				},
				polygon: {
					allowIntersection: true,
					showArea: true,
					drawError: {
						color: '#b00b00',
						timeout: 1000
					},
					shapeOptions: {
						color: '#4cc817'
					}
				},
				marker: true
			},
			edit: {
				featureGroup: drawnItems,
				remove: true
			}
		});
		map.addControl(drawControl);


		var locator = L.control.locate({
			position: 'bottomleft',
			strings: {
			title: "Show your current position"
			}
		}).addTo(map);

		map.on('draw:created', function (e) {
			var type = e.layerType,
				layer = e.layer;

			console.log("type");
			console.log(type);




			if (type === 'marker') {
				console.log("love")
				layer.bindPopup('A popup!');
/*				newMarker.bindPopup("objectID " + currentID);
				var tempMarker2 = featureGroup.addLayer(newLayerGroup);
				newMarker.openPopup();		
				var newButton = document.createElement("button");
				newButton.innerHTML = "Remove objectID " + currentID;
*/				
				//alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
				//alert("Lat, Lon : " + layer.lat + ", " + layer.lng)
			}


			// set the point, circle format of one point or multiple points 
			var latlong = e.layer._latlng;
			if (type === 'polygon' || type === 'rectangle' || type === 'polyline') {
				console.log(e.layer._latlngs);
				var latlong = e.layer._latlngs;
			}


			//alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)

			var featureGroup = L.featureGroup().addTo(map);
			// var coords = layer._latlng;
			var tempMarker = featureGroup.addLayer(e.layer);
			var layerId = featureGroup.getLayerId(layer);
//			var theRadius = layer.getRadius();

			console.log("radius_element");


			// if area is to be filled with data from pre-existing entry.. :)
			// add it!


			var popupMarkerForm = '<form role="form" name="test" id="markerform" enctype="multipart/form-data" action="#" class = "form-horizontal">'+
			'<table><tr><td valign=top>'+
			'<div class="form-group">'+
			'<input type="hidden" name="datalayerid" id="datalayerid" value="' + layerId + '">'+
			'<input type="hidden" name="latlong" id="latlong" value="' + latlong + '">'+
			'<input type="hidden" name="featuretype" id="featuretype" value="' + type + '">'+				
			'</div>'+
	
			'<div id="imagedest"><img src="/icons/densitynull.svg" class="shownum" id="shownum" width=183 height=183></div>'+
				'<div class="form-group">'+
			    
				'<label class="control-label col-sm-5"><strong>Tags: </strong></label>'+
				'<input type="text" size="20" class="form-control" id="rating" name="rating">'+ 
			    
		//		'<label class="control-label col-sm-5"><strong>Density: </strong></label>'+
				'<select class="form-control" onchange=\'check_value()\' id="density" name="density">'+
				'<option value="five">High</option>'+
				'<option value="four">Med High</option>'+
				'<option value="three">Medium</option>'+
				'<option value="two">Low-Med</option>'+
				'<option value="one">Low</option>'+
				'<option value="zero">None</option>'+
				'</select>'+ 
			'</div>'+

			'<div class="form-group">'+
			'<div style="text-align:center;" class="col-xs-4">'+
			'<button type="button" id="btn_marker" onclick="furbur();" class="btn btn-success btn-lg btn-block" id="saveMarkerForm"> Save </button></div>'+
			'</div>'+
			'</td><td valign=top><div class="form-group">'+
				'<label class="control-label col-sm-5"><strong>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Description: </strong></label>'+
				'<textarea class="form-control" rows="6" id="descrip" name="descrip"></textarea>'+
			'</div>'+
			'</form></td></tr></table>';


			// check to see if this marker has a popup already


			tempMarker.bindPopup(popupMarkerForm,{
			  keepInView: true,
			  closeButton: true
			  }).openPopup();
  
			if (type === 'polygon') {

				// structure the geojson object
				var geojson = {};
				geojson['type'] = 'Feature';
				geojson['geometry'] = {};
				geojson['geometry']['type'] = "Polygon";
		
				// export the coordinates from the layer
				var coordinates = [];
				var latlngs = layer.getLatLngs();
				for (var i = 0; i < latlngs.length; i++) {
					coordinates.push([latlngs[i].lng, latlngs[i].lat])
				}
		
				// push the coordinates to the json geometry
				geojson['geometry']['coordinates'] = [coordinates];
		
				// Finally, show the poly as a geojson object in the console
				console.log(JSON.stringify(geojson));
		
	   			}

			drawnItems.addLayer(layer);
		});


		map.on('draw:deleted', function (e) {


			var temp = []
			e.layers.eachLayer(layer => {
				var popupSplits = layer._popup._content.split('<br\/>');
				var popupSplit = popupSplits[0].replace("<b>","").replace("<\/b>","")
				//alert("meow" + popupSplit)
				//tablulate entries into array
				temp.push(popupSplit)
			})

				// write a new list of p
				if (localStorage.getItem("leafletFeatureIndex") !== null) {
					var featureindex = localStorage.getItem("leafletFeatureIndex");
					var newArr = featureindex.split(',');
				}

				// iterate through array of entries and

				temp.forEach(function(val){
				//	console.log("log")
				//	console.log(val)
				localStorage.removeItem(val);
					var foundIndex = newArr.indexOf(val);
					if(foundIndex != -1){
						newArr.splice(foundIndex, 1);
					}
				});

 				localStorage.setItem("leafletFeatureIndex",newArr);

		})


		map.on('draw:edited', function (e) {

			// update localhost with updates to leaflet draw edited features 
		
			var countOfEditedLayers = 0;
			e.layers.eachLayer(function(layer) {

				countOfEditedLayers++;
				console.log ("e.layer.FeatureGroup")
				console.log (layer._leaflet_id)
				console.log (layer)
				console.log ("layer")
				console.log (layer._popup._content)

				var popupSplits = layer._popup._content.split('<br\/>');
				console.log( popupSplits[0].replace("<b>","") )
				var popupSplit = popupSplits[0].replace("<b>","").replace("<\/b>","")

				popupSplits[4] = popupSplits[1].replace("Density:","");

				console.log("before popupsplits5: "+popupSplits[5])
				popupSplits[5] = popupSplits[2].replace("Description:","");
				console.log("after popupsplits5: "+popupSplits[5])

				console.log("before popupsplits6: "+popupSplits[6])
				popupSplits[6] = popupSplits[3].replace("Tags:","");
				console.log("after popupsplits6: "+popupSplits[6])

			
				if (popupSplit.slice(0, 9) === "rectangle") { 
					
					console.log(layer._latlngs)
					console.log(JSON.stringify(layer._latlngs))

				//	for (let x in layer._latlngs) {
						console.log("rectangle")
						var temp =  JSON.stringify(layer._latlngs)
						var temp = temp.replaceAll("\"lat\":","[").replaceAll("\"lng\":","").replaceAll("}","]").replaceAll("{","").replaceAll("[[[","").replaceAll("]]]","")
						//console.log(temp)
						//	 }

					var featureid = popupSplit.slice(9, 13)
					localStorage.setItem(popupSplit, "{ \"data\": [ ["+
					 temp +"] ], \"density\":[\""+
					 popupSplits[4]+"\"],\"rating\":[\""+
					 popupSplits[5]+"\"],\"description\":[\""+
					 popupSplits[6]+"\"],\"featureid\":[\""+
					 featureid+"\"],\"featuretype\":[\"rectangle\"] }");
			
			}			
							// check first 6 letters is it marker?
				if (popupSplit.slice(0, 6) === "marker") { 
					
					console.log("marker")
					var featureid = popupSplit.slice(6, 10)
					localStorage.setItem(popupSplit, "{ \"data\": [ ["+
					 layer._latlng.lat +","+ layer._latlng.lng +"] ], \"density\":[\""+
					 popupSplits[4]+"\"],\"rating\":[\""+
					 popupSplits[5]+"\"],\"description\":[\""+
					 popupSplits[6]+"\"],\"featureid\":[\""+
					 featureid+"\"],\"featuretype\":[\"marker\"] }");
			
			}
				// check first 7 letters is it polygon?
				if (popupSplit.slice(0, 7) === "polygon") { 
					

					var temp =  JSON.stringify(layer._latlngs)
					var temp = temp.replaceAll("\"lat\":","[").replaceAll("\"lng\":","").replaceAll("}","]").replaceAll("{","").replaceAll("[[[","").replaceAll("]]]","")

					console.log("polygon")
					var featureid = popupSplit.slice(7, 11)
					localStorage.setItem(popupSplit, "{ \"data\": [ ["+ 
					temp +"] ], \"density\":[\""+
					popupSplits[4]+"\"],\"rating\":[\""+
					popupSplits[5]+"\"],\"description\":[\""+
					popupSplits[6]+"\"],\"featureid\":[\""+
					featureid+"\"],\"featuretype\":[\"polygon\"] }");
			
			}

				// check first 7 letters is it polygon?
				if (popupSplit.slice(0, 8) === "polyline") { 

					var temp =  JSON.stringify(layer._latlngs)
					var temp = temp.replaceAll("\"lat\":","[").replaceAll("\"lng\":","").replaceAll("}","]").replaceAll("{","").replaceAll("[[[","").replaceAll("]]]","")

					console.log("polyline")
					var featureid = popupSplit.slice(8, 12)
					localStorage.setItem(popupSplit, "{ \"data\": "+ 
					temp +", \"density\":[\""+
					popupSplits[4]+"\"],\"rating\":[\""+
					popupSplits[5]+"\"],\"description\":[\""+
					popupSplits[6]+"\"],\"featureid\":[\""+
					featureid+"\"],\"featuretype\":[\"polyline\"] }");
			
			}


			});
			console.log("Edited " + countOfEditedLayers + " layers");
			// 
 
			var previousindex = localStorage.getItem("leafletFeatureIndex");
			console.log(previousindex)
			// construct new leafletFeatureIndex

			drawnItems.toGeoJSON()

		});

		L.control
		.scale({
		  imperial: false,
		  position: 'bottomright'
		})
		.addTo(map);
		
		var logo = L.control({position: 'bottomright'});
		logo.onAdd = function(map){
			var div = L.DomUtil.create('div', 'myclass');
			div.innerHTML= "<img src='/garbagemap_logo_80px_h_june_16_2022.png' height=80 />";
			return div;
		}
		logo.addTo(map);



		// save button actions
		//
		//
		//
		//
		document.getElementById("mapdata").addEventListener("click", function () {

			let nodata = '{"type":"FeatureCollection","features":[]}';
			let jsonData = (JSON.stringify(drawnItems.toGeoJSON()));
			let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(jsonData);
			let datenow = new Date();
			let datenowstr = datenow.toLocaleDateString('en-GB');
			let exportFileDefaultName = 'export_draw_'+ datenowstr + '.geojson';
			let linkElement = document.createElement('a');
			linkElement.setAttribute('href', dataUri);
			linkElement.setAttribute('download', exportFileDefaultName);
			if (jsonData == nodata) {
			alert('No features are drawn');
			} else {
			linkElement.click();
			}
		});
		function clearItems() {
                        document.getElementById("map").style.display = "none";
                        document.getElementById("resourcemap").style.display = "none";
                        document.getElementById("mapbuttons").style.display = "none";
			document.getElementById("orodha").style.display = "none";
                        document.getElementById("greeting").style.display = "none";
                        document.getElementById("selecta").style.display = "none";
                        document.getElementById("kusafisha").style.display = "none";
                        document.getElementById("kwachk").style.display = "none";
                        document.getElementById("arega").style.display = "none";
                        document.getElementById("mabroker").style.display = "none";
                        document.getElementById("footsoldiers").style.display = "none";
                        document.getElementById("pusha").style.display = "none";
                        document.getElementById("presha").style.display = "none";
                        document.getElementById("dizo").style.display = "none";
                        document.getElementById("gascooker").style.display = "none";
                        document.getElementById("gastangi").style.display = "none";
                        document.getElementById("kumaintain").style.display = "none";
                        document.getElementById("stingozandifu").style.display = "none";
                        document.getElementById("maxchange").style.display = "none";	
                        document.getElementById("carboncredit").style.display = "none";	
                        document.getElementById("nfthub").style.display = "none";	
                        document.getElementById("profile").style.display = "none";	
                        document.getElementById("pakuayako").style.display = "none";
                        document.getElementById("compost").style.display = "none";	
                        document.getElementById("trees").style.display = "none";	
                        document.getElementById("nursery").style.display = "none";	
                        document.getElementById("mbinu").style.display = "none";	
                        document.getElementById("jinsiya").style.display = "none";
			document.getElementById("settings").style.display = "none";
			document.getElementById("chaimocha").style.display = "none";
		}

		document.getElementById("switch_to_comp").addEventListener("click", function () {
			clearItems()
                        document.getElementById("compost").style.display = "block";
                });
            	document.getElementById("0compost").addEventListener("click", function () {
			clearItems()
                        document.getElementById("compost").style.display = "block";
                        document.getElementById("menu_header").style.bakground = "url(compost-and-nursery_header.png)";
			
                });
		document.getElementById("switch_to_nurs").addEventListener("click", function () {
			clearItems()
                        document.getElementById("nursery").style.display = "block";
                });
		document.getElementById("switch_to_nursery").addEventListener("click", function () {
			clearItems()
                        document.getElementById("nursery").style.display = "block";
                });
            	document.getElementById("0nursery").addEventListener("click", function () {
			clearItems()
                        document.getElementById("nursery").style.display = "block";
                });
		document.getElementById("switch_to_tree").addEventListener("click", function () {
			clearItems()
                        document.getElementById("trees").style.display = "block";
                });
            	document.getElementById("0trees").addEventListener("click", function () {
			clearItems()
                        document.getElementById("trees").style.display = "block";
                });

            	document.getElementById("0pakuayako").addEventListener("click", function () {
			clearItems()
                        document.getElementById("pakuayako").style.display = "block";
                });
            	document.getElementById("switch_to_mbinu").addEventListener("click", function () {
			clearItems()
                        document.getElementById("mbinu").style.display = "block";
                });
            	document.getElementById("0mbinu").addEventListener("click", function () {
			clearItems()
                        document.getElementById("mbinu").style.display = "block";
                });
		document.getElementById("switch_to_jinsiya").addEventListener("click", function () {
			clearItems()
                        document.getElementById("jinsiya").style.display = "block";
                });
		document.getElementById("switch_to_jins").addEventListener("click", function () {
			clearItems()
                        document.getElementById("jinsiya").style.display = "block";
                });
            	document.getElementById("0jinsiya").addEventListener("click", function () {
			clearItems()
                        document.getElementById("jinsiya").style.display = "block";
                });
		document.getElementById("switch_to_home").addEventListener("click", function () {
			clearItems()
                        document.getElementById("greeting").style.display = "block";
                });
		document.getElementById("switch_to_homee").addEventListener("click", function () {
			clearItems()
                        document.getElementById("greeting").style.display = "block";
                });
		document.getElementById("0maleaf").addEventListener("click", function () {
			clearItems()
                        document.getElementById("resourcemap").style.display = "block";
                        document.getElementById("map").style.display = "block";
			document.getElementById("mapbuttons").style.display = "block";

                });
		document.getElementById("avatar").addEventListener("click", function () {
			clearItems()
                        document.getElementById("profile").style.display = "block";
                });

		document.getElementById("switch_to_resourcemap").addEventListener("click", function () {
			clearItems()
			document.getElementById("resourcemap").style.display = "block";
                        document.getElementById("map").style.display = "block";
			document.getElementById("mapbuttons").style.display = "block";
                });
		document.getElementById("switch_to_map").addEventListener("click", function () {
			clearItems()
			document.getElementById("resourcemap").style.display = "block";
                        document.getElementById("map").style.display = "block";
			document.getElementById("mapbuttons").style.display = "block";
                });
		document.getElementById("switch_to_mapp").addEventListener("click", function () {
			clearItems()
			document.getElementById("resourcemap").style.display = "block";
                        document.getElementById("map").style.display = "block";
			document.getElementById("mapbuttons").style.display = "block";
                });
		document.getElementById("switch_to_mappo").addEventListener("click", function () {
			clearItems()
			document.getElementById("resourcemap").style.display = "block";
                        document.getElementById("map").style.display = "block";
			document.getElementById("mapbuttons").style.display = "block";
                });
		document.getElementById("switch_to_selecta").addEventListener("click", function () {
			clearItems()
                        document.getElementById("selecta").style.display = "block";
		});
		document.getElementById("switch_to_sele").addEventListener("click", function () {
			clearItems()
                        document.getElementById("selecta").style.display = "block";
		});
                document.getElementById("0selecta").addEventListener("click", function () {
			clearItems()
			document.getElementById("selecta").style.display = "block";
                });
                document.getElementById("0orodha").addEventListener("click", function () {
			clearItems()
			document.getElementById("orodha").style.display = "block";
                });
		document.getElementById("switch_to_orod").addEventListener("click", function () {
			clearItems()
                        document.getElementById("orodha").style.display = "block";
                });
		document.getElementById("switch_to_orodha").addEventListener("click", function () {
			clearItems()
                        document.getElementById("orodha").style.display = "block";
                });
                document.getElementById("switch_to_kusa").addEventListener("click", function () {
			clearItems()
			document.getElementById("kusafisha").style.display = "block";
                });
                document.getElementById("switch_to_kusafisha").addEventListener("click", function () {
			clearItems()
			document.getElementById("kusafisha").style.display = "block";
                });
                document.getElementById("0kusafisha").addEventListener("click", function () {
			clearItems()
			document.getElementById("kusafisha").style.display = "block";
                });
                document.getElementById("switch_to_kwachk").addEventListener("click", function () {			
			clearItems()         
			document.getElementById("kwachk").style.display = "block";			
                });
                document.getElementById("switch_to_kwac").addEventListener("click", function () {			
			clearItems()         
			document.getElementById("kwachk").style.display = "block";			
                });
                document.getElementById("0kwachk").addEventListener("click", function () {			
			clearItems()         
			document.getElementById("kwachk").style.display = "block";			
                });
		document.getElementById("switch_to_kwachk").addEventListener("click", function () { 
			clearItems()         
			document.getElementById("kwachk").style.display = "block";						
		});
                document.getElementById("switch_to_arega").addEventListener("click", function () {			
			clearItems()         
			document.getElementById("arega").style.display = "block";			
                });
                document.getElementById("switch_to_areg").addEventListener("click", function () {			
			clearItems()         
			document.getElementById("arega").style.display = "block";			
                });
                document.getElementById("0arega").addEventListener("click", function () {
			clearItems()
			document.getElementById("arega").style.display = "block";
                });
                document.getElementById("switch_to_mabr").addEventListener("click", function () {			
			clearItems()         
			document.getElementById("mabroker").style.display = "block";			
                });
                document.getElementById("switch_to_mabroker").addEventListener("click", function () {			
			clearItems()         
			document.getElementById("mabroker").style.display = "block";			
                });
                document.getElementById("0mabroker").addEventListener("click", function () {
			clearItems()
			document.getElementById("mabroker").style.display = "block";
                });
                document.getElementById("switch_to_mafo").addEventListener("click", function () {
			clearItems()
                        document.getElementById("footsoldiers").style.display = "block";
                });
                document.getElementById("switch_to_mafo2").addEventListener("click", function () {
			clearItems()
                        document.getElementById("footsoldiers").style.display = "block";
                });
                document.getElementById("switch_to_footsoldiers").addEventListener("click", function () {
			clearItems()
                        document.getElementById("footsoldiers").style.display = "block";
                });
                document.getElementById("0footsoldiers").addEventListener("click", function () {
			clearItems()
                        document.getElementById("footsoldiers").style.display = "block";
                });
                document.getElementById("switch_to_push").addEventListener("click", function () {
			clearItems()
                        document.getElementById("pusha").style.display = "block";
                });
                document.getElementById("0pusha").addEventListener("click", function () {
			clearItems()
                        document.getElementById("pusha").style.display = "block";
                });
		document.getElementById("switch_to_boilerpusha").addEventListener("click", function () {			
			clearItems()         
			document.getElementById("pusha").style.display = "block";			
                });
                document.getElementById("switch_to_pusha").addEventListener("click", function () {			
			clearItems()         
			document.getElementById("pusha").style.display = "block";			
                });
                document.getElementById("switch_to_moldya").addEventListener("click", function () {			
			clearItems()         
			document.getElementById("presha").style.display = "block";			
                });
                document.getElementById("0presha").addEventListener("click", function () {
			clearItems()
                        document.getElementById("presha").style.display = "block";
                });
                document.getElementById("0dizo").addEventListener("click", function () {
			clearItems()
                        document.getElementById("dizo").style.display = "block";
                });
                document.getElementById("switch_to_dizoo").addEventListener("click", function () {
			clearItems()
                        document.getElementById("dizo").style.display = "block";
                });
                document.getElementById("switch_to_dizo").addEventListener("click", function () {
			clearItems()
                        document.getElementById("dizo").style.display = "block";
                });
                document.getElementById("switch_to_gasacooker").addEventListener("click", function () {
			clearItems()
                        document.getElementById("gascooker").style.display = "block";
                });
                document.getElementById("switch_to_gasc").addEventListener("click", function () {
			clearItems()
                        document.getElementById("gascooker").style.display = "block";
                });
                document.getElementById("0gascooker").addEventListener("click", function () {
			clearItems()
                        document.getElementById("gascooker").style.display = "block";
                });
                document.getElementById("switch_to_gastangi").addEventListener("click", function () {
			clearItems()
                        document.getElementById("gastangi").style.display = "block";
                });
                document.getElementById("0gastangi").addEventListener("click", function () {
			clearItems()
                        document.getElementById("gastangi").style.display = "block";
                });
                document.getElementById("switch_to_gastangi").addEventListener("click", function () {
			clearItems()
                        document.getElementById("gastangi").style.display = "block";
                });
                document.getElementById("switch_to_gast").addEventListener("click", function () {
			clearItems()
                        document.getElementById("gastangi").style.display = "block";
                });
                document.getElementById("switch_to_kuma").addEventListener("click", function () {
			clearItems()
                        document.getElementById("kumaintain").style.display = "block";
                });
                document.getElementById("switch_to_kumaintain").addEventListener("click", function () {
			clearItems()
                        document.getElementById("kumaintain").style.display = "block";
                });
                document.getElementById("0kumaintain").addEventListener("click", function () {
			clearItems()
                        document.getElementById("kumaintain").style.display = "block";
                });
                document.getElementById("switch_to_stingozandifu").addEventListener("click", function () {
			clearItems()
                        document.getElementById("stingozandifu").style.display = "block";
                });
                document.getElementById("switch_to_stin").addEventListener("click", function () {
			clearItems()
                        document.getElementById("stingozandifu").style.display = "block";
                });
                document.getElementById("0stingozandifu").addEventListener("click", function () {
			clearItems()
                        document.getElementById("stingozandifu").style.display = "block";
                });
                document.getElementById("switch_to_maxc").addEventListener("click", function () {
			clearItems()
                        document.getElementById("maxchange").style.display = "block";
                });
                document.getElementById("switch_to_maxchange").addEventListener("click", function () {
			clearItems()
                        document.getElementById("maxchange").style.display = "block";
                });
                document.getElementById("0maxchange").addEventListener("click", function () {
			clearItems()
                        document.getElementById("maxchange").style.display = "block";
                });
                document.getElementById("0carboncredit").addEventListener("click", function () {
			clearItems()
                        document.getElementById("carboncredit").style.display = "block";
                });
                document.getElementById("switch_to_carboncredit").addEventListener("click", function () {
			clearItems()
                        document.getElementById("carboncredit").style.display = "block";
                });
                document.getElementById("switch_to_nfthub").addEventListener("click", function () {
			clearItems()
                        document.getElementById("nfthub").style.display = "block";
                });
                document.getElementById("switch_to_nfth").addEventListener("click", function () {
			clearItems()
                        document.getElementById("nfthub").style.display = "block";
                });
                document.getElementById("0nfthub").addEventListener("click", function () {
			clearItems()
                        document.getElementById("nfthub").style.display = "block";
                });
                document.getElementById("0profile").addEventListener("click", function () {
			clearItems()
                        document.getElementById("profileAdmin").style.display = "block";
                });
                document.getElementById("switch_to_profile").addEventListener("click", function () {
			clearItems()
                        document.getElementById("profileAdmin").style.display = "block";
                });

  /*              document.getElementById("addawitnessbutton").addEventListener("click", function () {
			clearItems()			
			document.getElementById("addawitness").style.display = "block";
                });
	
                document.getElementById("addawitnessbutton").addEventListener("click", function () {

			let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
			width=330,height=700`;

			open('/js/', 'test', params);
                });
*/	

		// save button actions
		//
		//
		//
		//



		document.getElementById("saveleafletdata").addEventListener("click", function () {

			localStorage.setItem("user", JSON.stringify(drawnItems.toGeoJSON(), null, 2) );
			// console.log(JSON.stringify(drawnItems.toGeoJSON(), null, 2));

			async function insertData() {
				const { data, error } = await _supabase
					.from('leafletjson')
					  .insert([
						{ json:  JSON.stringify(drawnItems.toGeoJSON(), null, 2), userhash: userhash }
					]);		
			}
			insertData();
		});

		// newbuttom
		//
		//
		//
		//
		document.getElementById("newbutton").addEventListener("click", function () {
			async function newbutton() {

// 			var obj = JSON.parse(JSON.stringify( data ));
			console.log( "JSON.stringify(drawnItems.toGeoJSON().value.json" );

//			var obj = JSON.parse(JSON.stringify( data6 ));

			console.log( JSON.stringify(drawnItems.toGeoJSON()).json );
			console.log( "drawnItems" );
			console.log( drawnItems.features );

//			var drawnItems2 =  JSON.stringify(drawnItems.toGeoJSON()).json ;
			console.log( "features0" );
//			console.log( drawnItems2.features );

			var obj = JSON.parse(JSON.stringify( drawnItems.toGeoJSON() ));


			// var features0 = JSON.parse(obj.value.json);

			var result = obj.features;
			console.log(result);
//			console.log(drawnItems);


			for (var i = 0; i < result.length; i++) {

				var featuretype = JSON.stringify(result[i].geometry.type);
//				var polygon = JSON.stringify(result[i].geometry.coordinates[0]);

				if (featuretype == "Polygon")
					var polygon0 = JSON.stringify(result[i].geometry.coordinates[0]);
				else (featuretype == "Linestring")
					var polygon0 = JSON.stringify(result[i].geometry.coordinates);

					console.log(featuretype);
					console.log(polygon0);
				}


//			var features0 = JSON.parse(obj.value.json


// push current data object to supabase 
/*
 				const { data, error } = await _supabase
						.from('leafletjson')
						  .insert([
//							{ json:  JSON.stringify(drawnItems.toGeoJSON(), null, 2), userhash: userhash }
							{ json:  JSON.stringify(drawnItems.toGeoJSON(), null, 2), userhash: "userhash" }
					]);		
				//	console.log(data);
				//	console.log(error);
*/


				}
				newbutton();
		});



		// loadData2 button actions
		//
		//
		//
		//

		document.getElementById("loadData2").addEventListener("click", function () {
			console.log(localuserhash);
			async function loadData2() {
				try {
				const { data, error } = await _supabase
						.from('leafletjson')
						.select('json')  
						.eq('id', '50') 
						.limit(1)
						.single()
						;

				return data;
				} catch (error) {
					console.log(error.message);
				}
		}

		Promise.allSettled([loadData2()]).then(arr => {
			const data = arr[0];

			var obj = JSON.parse(JSON.stringify( data ));

			var features0 = JSON.parse(obj.value.json);
 
			var coordinates = [];
			console.log("coordsloop6");


			var result = features0.features;
			for (var i = 0; i < result.length; i++) {

//				var polygon = JSON.stringify(result[i].geometry.coordinates[0]);
				var polygon0 = result[i].geometry.coordinates[0];

			  alert(polygon);
			  console.log(polygon)
			  var polygon4 = L.polygon(polygon);
			  polyLayers.push(polygon4);
			  
			  for(layer of polyLayers) {
				  console.log("flag2")
				  drawnItems.addLayer(layer);
			  }

			}


/*			for (var i = 0; i < features0.length; i++) {
				console.log("coordsloop");


				coordinates.push([features0[i].geometry.coordinates[0][0]])
				console.log( features0[i].geometry.coordinates[0][0] );
				polygonCoords += ("[" + [ features0[i].geometry.coordinates[0][0]] + "],");

			}
*/
			console.log("coordsloop6");

			
		console.log(" Map.js line 1072");
		localStorage.setItem("user", JSON.stringify(drawnItems.toGeoJSON(), null, 2) );
		});
			

});

// check user data
/*				const { data, error } = await _supabase
						.from('leafletjson')
						.select('json')  
						.eq('userhash', localuserhash) 
						.limit(1)
						.single()
						;
*/				
		document.getElementById("loadData").addEventListener("click", function () {
		
			console.log(localuserhash);
			async function loadData() {		
				try {
				const { data, error } = await _supabase
						.from('leafletjson')
						.select('json')  
						.eq('id', 1) 
						.limit(1)
						.single()
						;
						
				console.log(data);
				return data;

				} catch (error) {
					console.log(error.message);
				}
		}
				
			console.log("hello...");

			Promise.allSettled([loadData()]).then(arr => {
//				const data = arr[0];
				// merge them here...
		

//			loadData().then(drawnItems.addLayer(polyLayers.push(L.polygon(data))));
//			.then(drawnItems.addLayer.bind(drawnItems)).catch(e => {
			console.log(arr[0]);
			console.log("ehlloow");
			console.log(arr[0].value);
			console.log(arr[0].value.json.features);
			console.log("e11111111111111w");

			// });
//
//var polygon3 = loadData().then(L.polygon).then(data));


			L.geoJson(arr).addTo(map);

			console.log("e11111111111111w");


			var polygon5 =	 L.polygon(arr[0].value.json.features);
			polyLayers.push(polygon5);
			
			for(layer of polyLayers) {
				drawnItems.addLayer(layer);
			}

			console.log("ehlloow2");
			localStorage.setItem("user", JSON.stringify(drawnItems.toGeoJSON(), null, 2) );


				// check user data
/*				const { data, error } = await _supabase
						.from('leafletjson')
						.select('json')  
						.eq('userhash', localuserhash) 
						.limit(1)
						.single()
						;
*/				





	});

		/*	var polygon3 = L.polygon([
			
				[51.50852877586289,-0.08754730224609376],
				[51.50623162095866,-0.09518623352050783],
				[51.50436175821088,-0.08368492126464844],
				[51.50612477372582,-0.08205413818359376],
				[51.5081548283056,-0.08394241333007814],
				[51.50852877586289,-0.08754730224609376],]
			);
			polyLayers.push(polygon3);
	
			for(layer of polyLayers) {
				drawnItems.addLayer(layer);
			}
		*/	
  //          var featureGroup = L.featureGroup().addTo(map);
	//		L.geoJson(returnedGeojson).addTo(map);
//			layer.addTo(map);
			console.log("ehlloow3");


		});
