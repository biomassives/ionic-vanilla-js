   		 const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmdHpqbHpyb3RlanBxcWRvdnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTUzMjY1NDksImV4cCI6MTk3MDkwMjU0OX0.edZGvym_mX4Kz5VGfg4f6UZhV6_MUseugokWE5UCbyQ"
		 const supabaseUrl = "https://yftzjlzrotejpqqdovyb.supabase.co"	 
		 const _supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);


		if (!('bluetooth' in navigator)) {
			console.log('Bluetooth API not supported on your browser.');
		}

		console.log("love");


		function fetchJSON(url) {
			return fetch(url)
			  .then(function(response) {
				return response.json();
			  });
		  }

		var data = fetchJSON('/garbagemap_google_export_jun15_2022/Waste-Pile-Photos.geojson')
		.then(function(data) { return data; alert("got here") })



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
		document.getElementById("0checkin").addEventListener("click", function () {

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
		}


            	document.getElementById("0compost").addEventListener("click", function () {
			clearItems()
                        document.getElementById("compost").style.display = "block";
                });
            	document.getElementById("0nursery").addEventListener("click", function () {
			clearItems()
                        document.getElementById("nursery").style.display = "block";
                });
            	document.getElementById("0trees").addEventListener("click", function () {
			clearItems()
                        document.getElementById("trees").style.display = "block";
                });

            	document.getElementById("0download").addEventListener("click", function () {
			clearItems()
                        document.getElementById("pakuayako").style.display = "block";
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
		document.getElementById("switch_to_map").addEventListener("click", function () {
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
                        document.getElementById("profile").style.display = "block";
                });
                document.getElementById("switch_to_profile").addEventListener("click", function () {
			clearItems()
                        document.getElementById("profile").style.display = "block";
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

			
			
//		 	NFT Token Data Object - ecocommunitydao
			
/*			var valuechainDbTables =
			Name		Data Type		Format
			id		bigint			int8
			created_at	timestamp with time     zonetimestamptz	
			user		character varying	varchar	
			description	text			text	
			action		character varying	varchar	
			quantity	numeric			numeric	
			sessionvar	character varying	varchar	
			date		date			date	
			time		time without time zone	time	
			sharetoteam	boolean			bool	
			latlong		character varying	varchar	
			units		character varying	varchar	
			newsitem	boolean			bool	
			nft		character varying	varchar	
			dao		character varying	varchar	
			wallet_id	character varying	varchar	
			transaction_hashcharacter varying	varchar	
			signed_by	character varying	varchar	
			signers_address	character varying	varchar	
			recieved_by	character varying	varchar	
			recievers_addresscharacter varying	varchar	
			reviewer	character varying	varchar	
			reviewew_addresscharacter varying	varchar";
*/			

		var datatemp = {
				"type": "FeatureCollection",
				"name": "Waste Pile Photos",
				"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
				"features": [
				{ "type": "Feature", "properties": { "Name": "1.0", "description": "<img src=\"https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/rtvcouqj245gl380aadsmoumpc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY99FGX9Jx8jsAwdOa5-bnhri5MAqRF_LuBdsGuEjFEfKndw02Om7kWcqHCQuDzXvhkPM12gplDA5jrp1Dc0ru1xCQjXjy3EPMCO6_5yBzE70mwa9I4wn7u9XRptLBBjNs_hImLt0_iou3prZcHHBfcurS4n42J8dwm7Xxdhfn0AAFfuOYkmX-oGWfcPGXtas4t?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 140<br>N: -1.5199429<br>E: 37.2677612<br>Altitude_m: 1,607.7<br>DateTime: 11\/02\/2021 7:47:19<br>FileName: IMG-20211101-WA0014.jpg<br><br><img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/26fmev2pg7hpuilva9i0nvh8rc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY-nfIHNHjKCKi70rrHp5pvE3pEDRYBIUhfEd3suhy9nG-B6eZ3qdr6Wz6C8qcWBW_n1WLnHr18yUnA45cU6qwrnv6J2G5f_VmP81VQWAh8bCJWi6QewXj8VQNR83p-BlMQqTJQeiSiupMcui4dA_vdAjZRqeTlC2SLbhvpquOnf9rKzO1g22aY6Gj9aI7QkA1Q?session=0&fife\" height=\"200\" width=\"auto\" \/>", "IndexNo": "140.0", "N": "-1.5199429", "E": "37.2677612", "Altitude_m": "1607.7", "DateTime": "11\/02\/2021 7:47:19", "FileName": "IMG-20211101-WA0014.jpg", "gx_media_links": "https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/rtvcouqj245gl380aadsmoumpc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY99FGX9Jx8jsAwdOa5-bnhri5MAqRF_LuBdsGuEjFEfKndw02Om7kWcqHCQuDzXvhkPM12gplDA5jrp1Dc0ru1xCQjXjy3EPMCO6_5yBzE70mwa9I4wn7u9XRptLBBjNs_hImLt0_iou3prZcHHBfcurS4n42J8dwm7Xxdhfn0AAFfuOYkmX-oGWfcPGXtas4t?session=0&fife https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/26fmev2pg7hpuilva9i0nvh8rc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY-nfIHNHjKCKi70rrHp5pvE3pEDRYBIUhfEd3suhy9nG-B6eZ3qdr6Wz6C8qcWBW_n1WLnHr18yUnA45cU6qwrnv6J2G5f_VmP81VQWAh8bCJWi6QewXj8VQNR83p-BlMQqTJQeiSiupMcui4dA_vdAjZRqeTlC2SLbhvpquOnf9rKzO1g22aY6Gj9aI7QkA1Q?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2677612, -1.5199429 ] } },
				{ "type": "Feature", "properties": { "Name": "2.0", "description": "<img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/jgu18vvlooccs2b49kj3ud8mh8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vac92x9OM7Znkt2l9D8zTNxfUCMAeM1QOJrfdAYAB7HDjlBx56oCAWTQGJcxthJOUiv5jw2R4I-TEKvBHmo3EehDlN-h62b5aPiT8HKRYRwIK_jTnXAuIw4mJaHU4ZtIpflR57LW6wvpbN3M-R-Flyl2Etxp0ZIKcpfy0AmTvYFXqd1pFPYJACaqsykYmTUuvc?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 140<br>N: -1.5260086<br>E: 37.2670375<br>Altitude_m: <br>DateTime: 11\/02\/2021 7:47:21<br>FileName: IMG-20211101-WA0015.jpg<br><br><img src=\"https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/26tod1urj6ujqvptqg8vu42oi8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYBdytVOMfeQv25mD_onpRNXTyAdcLaxkIokx9TxWGiFNbEnF2I2ilY4KzruWH-oFY13e_7E_mXeApO4nrQR91dRByycb_6mWI1W3SJrplcW7M_KGsU0KMmzypcSv03P1L1M3c2Nd4fDfln_gd0b3ElN9lYo3pcs06rJez8ru3f7aPL0MpSEY0Kc-bACzWPkZ8?session=0&fife\" height=\"200\" width=\"auto\" \/>", "IndexNo": "140.0", "N": "-1.5260086", "E": "37.2670375", "Altitude_m": "", "DateTime": "11\/02\/2021 7:47:21", "FileName": "IMG-20211101-WA0015.jpg", "gx_media_links": "https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/jgu18vvlooccs2b49kj3ud8mh8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vac92x9OM7Znkt2l9D8zTNxfUCMAeM1QOJrfdAYAB7HDjlBx56oCAWTQGJcxthJOUiv5jw2R4I-TEKvBHmo3EehDlN-h62b5aPiT8HKRYRwIK_jTnXAuIw4mJaHU4ZtIpflR57LW6wvpbN3M-R-Flyl2Etxp0ZIKcpfy0AmTvYFXqd1pFPYJACaqsykYmTUuvc?session=0&fife https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/26tod1urj6ujqvptqg8vu42oi8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYBdytVOMfeQv25mD_onpRNXTyAdcLaxkIokx9TxWGiFNbEnF2I2ilY4KzruWH-oFY13e_7E_mXeApO4nrQR91dRByycb_6mWI1W3SJrplcW7M_KGsU0KMmzypcSv03P1L1M3c2Nd4fDfln_gd0b3ElN9lYo3pcs06rJez8ru3f7aPL0MpSEY0Kc-bACzWPkZ8?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2670375, -1.5260086 ] } },
				{ "type": "Feature", "properties": { "Name": "3.0", "description": "<img src=\"https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/02af6mubdro10jlnahl7q8e1sk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYc4z8M2PfOT-8qtWL8KPW_WFOH7_aWYvAMo5uMleWLKarW0FFfQArZvrVa6p3MfEsfoggVjki4Dd3J7J7_onAtHRAeFIOmvRuQzm2zB8Ys-WTra2dOlBKT3Ky211mUaJacIOd7FaHYdGUxY1eLrOJGoo-2tlriAKG0tMwYIjDi4mblJIvHUXAuz1KPj5Y-Z5Io?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 146<br>N: -1.5218706<br>E: 37.2688771<br>Altitude_m: 1,603.3<br>DateTime: 11\/02\/2021 18:30:49<br>FileName: IMG-20211102-WA0001.jpg", "IndexNo": "146.0", "N": "-1.5218706", "E": "37.2688771", "Altitude_m": "1603.3", "DateTime": "11\/02\/2021 18:30:49", "FileName": "IMG-20211102-WA0001.jpg", "gx_media_links": "https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/02af6mubdro10jlnahl7q8e1sk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYc4z8M2PfOT-8qtWL8KPW_WFOH7_aWYvAMo5uMleWLKarW0FFfQArZvrVa6p3MfEsfoggVjki4Dd3J7J7_onAtHRAeFIOmvRuQzm2zB8Ys-WTra2dOlBKT3Ky211mUaJacIOd7FaHYdGUxY1eLrOJGoo-2tlriAKG0tMwYIjDi4mblJIvHUXAuz1KPj5Y-Z5Io?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2688771, -1.5218706 ] } },
				{ "type": "Feature", "properties": { "Name": "4.0", "description": "<img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/0g362rcb3tc4dltnd29r7sak3c\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZ2JqE0yVCokak4AMeR-snpJZmUah0ZvJ_8pam07L4tfEBSnr-pdmAzWe4ivHX2FtS8R0Osf8RBj5Cshv4lFwPywBaOHgLVXwaxD9hYkKOUYhjkqX9NJmLWJJlv0nur_hYQdJw5lEA4Y4z-e5hkCPGTFg5tRFRe9louQ4B1kojv5KZ0IjA6wn4uQb53e7FF8fQ?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 144<br>N: -1.2376261<br>E: 37.4277949<br>Altitude_m: <br>DateTime: 11\/02\/2021 16:03:30<br>FileName: IMG-20211102-WA0002.jpg", "IndexNo": "144.0", "N": "-1.2376261", "E": "37.4277949", "Altitude_m": "", "DateTime": "11\/02\/2021 16:03:30", "FileName": "IMG-20211102-WA0002.jpg", "gx_media_links": "https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/0g362rcb3tc4dltnd29r7sak3c\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZ2JqE0yVCokak4AMeR-snpJZmUah0ZvJ_8pam07L4tfEBSnr-pdmAzWe4ivHX2FtS8R0Osf8RBj5Cshv4lFwPywBaOHgLVXwaxD9hYkKOUYhjkqX9NJmLWJJlv0nur_hYQdJw5lEA4Y4z-e5hkCPGTFg5tRFRe9louQ4B1kojv5KZ0IjA6wn4uQb53e7FF8fQ?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.4277949, -1.2376261 ] } },
				{ "type": "Feature", "properties": { "Name": "5.0", "description": "<img src=\"https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/qck45p0eudddtlrtap5jtpvhm0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vb74zHTJMw30eZBIzY5cYSVMRv8JKTEWysAvAiM00foRhlcdNlJbH8gx0pPYE0a4PmZq1fmH0Gk1eMaqK75Hk38CalJxs1ndqd864IUNwvTioZ1g7QgFrQu_FomabN6T6qZQz6zjZ_SBjuutIP0FZgOdQWGuU9As1VooerVHI4usS5RyJR_lGdqc2i2WJT48tg?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 144<br>N: -1.2376261<br>E: 37.4277949<br>Altitude_m: <br>DateTime: 11\/02\/2021 16:03:32<br>FileName: IMG-20211102-WA0003.jpg<br><br><img src=\"https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/n3om7nbcira887me77jakiqbds\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaTDunooF2kA-78hzzyFMobGIi8UZSh3SNr-EoXqs8iuLcwjZt3b6rXP2H6bAzpjGL26fXUA0ij0kGR12a6IQA1U080Ycgel_wn4HdavAGEtoqzleIEozYv91QVhCuIGB1-yfEVqJ11NZj_ZoIOQL5lxHO1KwkRH9Md47JuL_gLmzrvfXePg-87IOrYVBNyvOc?session=0&fife\" height=\"200\" width=\"auto\" \/>", "IndexNo": "144.0", "N": "-1.2376261", "E": "37.4277949", "Altitude_m": "", "DateTime": "11\/02\/2021 16:03:32", "FileName": "IMG-20211102-WA0003.jpg", "gx_media_links": "https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/qck45p0eudddtlrtap5jtpvhm0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vb74zHTJMw30eZBIzY5cYSVMRv8JKTEWysAvAiM00foRhlcdNlJbH8gx0pPYE0a4PmZq1fmH0Gk1eMaqK75Hk38CalJxs1ndqd864IUNwvTioZ1g7QgFrQu_FomabN6T6qZQz6zjZ_SBjuutIP0FZgOdQWGuU9As1VooerVHI4usS5RyJR_lGdqc2i2WJT48tg?session=0&fife https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/n3om7nbcira887me77jakiqbds\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaTDunooF2kA-78hzzyFMobGIi8UZSh3SNr-EoXqs8iuLcwjZt3b6rXP2H6bAzpjGL26fXUA0ij0kGR12a6IQA1U080Ycgel_wn4HdavAGEtoqzleIEozYv91QVhCuIGB1-yfEVqJ11NZj_ZoIOQL5lxHO1KwkRH9Md47JuL_gLmzrvfXePg-87IOrYVBNyvOc?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.4277949, -1.2376261 ] } },
				{ "type": "Feature", "properties": { "Name": "6.0", "description": "<img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/0048deqjempc0rib2jccu949bo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_va4P5M7oNxG1MivC3lS08aLkKyNa39ypSIczkvNhpza0WwduW11wSDwPxZkX4Nwh4jFFMOqaY1DakVfJ0Z_w5PRdhCgAdS_TOvRccEw305-sK2qXI9gv1KX0o4ne_PpgqVbXMGIhFu6CTjWin7co7fb64wJ9Lh07yd6kPG6LLEDbz7PJHWA9YqNSUA5aPfcrBU?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 15<br>N: -1.51812<br>E: 37.268175<br>Altitude_m: 1,624.6<br>DateTime: 10\/12\/2021 14:40:01<br>FileName: IMG-20211013-WA0010.jpg<br><br><img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/tvgv6m8bic4fh5modj96ceiotk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZVRCiRTgiv01ZyFsE93iVnaV4NK3L4D_2Ql-Gnrzrl6SF_Gqu2iEqNia6otNJoL8IV-Xy76XKoR1Pi59ipAiLm4VJW4k4dw88VS3VXHnO_p0939Uviu6YO4oS-cMeToAMJbkjb3sqDyhro1w2fuGnfNS6924UazfBDUbs-eE-U1zNGTBg9Jcn4xLOgEIppiZo?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/etbpee8dhr9910bn017ilqmlc4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbnMHbgFAq6qwb8UuuPpmRNcuMYqYiWqAx6Y_Ric21n7uEvHvb3zJlk5-zBmQGLtlyx5a14Qqt3SArxzhWBZjTxzmEvk2EDIm5RSxblAXJFigQ-eLXaL8Ogbu3U_TiLqqRSnnkJ8cZ4iU2PRkR7Y_8G9FjakLLMk8OA8ZB8TCqKg-l4sreSw36vw7-TKfLv08w?session=0&fife\" height=\"200\" width=\"auto\" \/>", "IndexNo": "15.0", "N": "-1.51812", "E": "37.268175", "Altitude_m": "1624.6", "DateTime": "10\/12\/2021 14:40:01", "FileName": "IMG-20211013-WA0010.jpg", "gx_media_links": "https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/0048deqjempc0rib2jccu949bo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_va4P5M7oNxG1MivC3lS08aLkKyNa39ypSIczkvNhpza0WwduW11wSDwPxZkX4Nwh4jFFMOqaY1DakVfJ0Z_w5PRdhCgAdS_TOvRccEw305-sK2qXI9gv1KX0o4ne_PpgqVbXMGIhFu6CTjWin7co7fb64wJ9Lh07yd6kPG6LLEDbz7PJHWA9YqNSUA5aPfcrBU?session=0&fife https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/tvgv6m8bic4fh5modj96ceiotk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZVRCiRTgiv01ZyFsE93iVnaV4NK3L4D_2Ql-Gnrzrl6SF_Gqu2iEqNia6otNJoL8IV-Xy76XKoR1Pi59ipAiLm4VJW4k4dw88VS3VXHnO_p0939Uviu6YO4oS-cMeToAMJbkjb3sqDyhro1w2fuGnfNS6924UazfBDUbs-eE-U1zNGTBg9Jcn4xLOgEIppiZo?session=0&fife https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/etbpee8dhr9910bn017ilqmlc4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbnMHbgFAq6qwb8UuuPpmRNcuMYqYiWqAx6Y_Ric21n7uEvHvb3zJlk5-zBmQGLtlyx5a14Qqt3SArxzhWBZjTxzmEvk2EDIm5RSxblAXJFigQ-eLXaL8Ogbu3U_TiLqqRSnnkJ8cZ4iU2PRkR7Y_8G9FjakLLMk8OA8ZB8TCqKg-l4sreSw36vw7-TKfLv08w?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.268175, -1.51812 ] } },
				{ "type": "Feature", "properties": { "Name": "7.0", "description": "<img src=\"https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/3knb1uoa8pcrgc5k6oeqg2n4qk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYAsy1CHsprDqSxT6rcH_-RCuzhAVVz7-euaPEqHXwHVEoYrIfJKhnBLy_ucxJviXD2uUUqymluT0L1wJpQF9QrIt8pnFHvfJ0x466km1Dfen8C-ejFFCh3fLlpVZuxQaQ00kTdVlCGnXkIeQ1SGOqvFW6Xxavs0BqYFDWwAmmU-ZZ1kBkfCF7Hd5RbqhSJYvVH?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 54<br>N: -1.5120467<br>E: 37.25589<br>Altitude_m: 1,661.4<br>DateTime: 10\/18\/2021 18:30:50<br>FileName: IMG-20211018-WA0004.jpg", "IndexNo": "54.0", "N": "-1.5120467", "E": "37.25589", "Altitude_m": "1661.4", "DateTime": "10\/18\/2021 18:30:50", "FileName": "IMG-20211018-WA0004.jpg", "gx_media_links": "https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/3knb1uoa8pcrgc5k6oeqg2n4qk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYAsy1CHsprDqSxT6rcH_-RCuzhAVVz7-euaPEqHXwHVEoYrIfJKhnBLy_ucxJviXD2uUUqymluT0L1wJpQF9QrIt8pnFHvfJ0x466km1Dfen8C-ejFFCh3fLlpVZuxQaQ00kTdVlCGnXkIeQ1SGOqvFW6Xxavs0BqYFDWwAmmU-ZZ1kBkfCF7Hd5RbqhSJYvVH?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.25589, -1.5120467 ] } },
				{ "type": "Feature", "properties": { "Name": "8.0", "description": "<img src=\"https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/eopp7n0r14l2fu83rr13hav7nc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY8L1dIIhdWN_OFdxknViVOMNOM22c1nEusmuIn4mAtYKuLHq8rSP2V1yDe_6x-hh95y0vuRWw3uOp12nWuqFtsjxCo6I2rO2f1M5eFv74RKYkHNT5kD1eu7YD4cEX-T4NFhrn8CGwiEOtpg3_7bXGZHjgwtFrzvN-znlXsN8Xhs8iYgWspS46AeAKRZp_Mn0ed?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 50<br>N: -1.5120467<br>E: 37.2557183<br>Altitude_m: 1,651.7<br>DateTime: 10\/18\/2021 18:30:36<br>FileName: IMG-20211018-WA0005.jpg", "IndexNo": "50.0", "N": "-1.5120467", "E": "37.2557183", "Altitude_m": "1651.7", "DateTime": "10\/18\/2021 18:30:36", "FileName": "IMG-20211018-WA0005.jpg", "gx_media_links": "https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/eopp7n0r14l2fu83rr13hav7nc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY8L1dIIhdWN_OFdxknViVOMNOM22c1nEusmuIn4mAtYKuLHq8rSP2V1yDe_6x-hh95y0vuRWw3uOp12nWuqFtsjxCo6I2rO2f1M5eFv74RKYkHNT5kD1eu7YD4cEX-T4NFhrn8CGwiEOtpg3_7bXGZHjgwtFrzvN-znlXsN8Xhs8iYgWspS46AeAKRZp_Mn0ed?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2557183, -1.5120467 ] } },
				{ "type": "Feature", "properties": { "Name": "9.0", "description": "<img src=\"https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/875rcht937gqlrman10a3r0fo0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYN73wPyypFvPs14h7dLkH9rcbiAS1uFaSyi9k7g0ZY1OzZvJAMTQIGLOvT1V8rHAQ5E8oO0zgT8fLqUU1Ll8jGopSfjmQvn8IvccgXRfXf3acmPODFKfunx9QlKHuR10D_Ix_o4vsQYmoFeFTxVkt_E00VCGE6LGcLcoME2lM2RSVVhTsiv7tNDWMt33lKR7rp?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 53<br>N: -1.5120667<br>E: 37.255785<br>Altitude_m: 1,659.3<br>DateTime: 10\/18\/2021 18:30:44<br>FileName: IMG-20211018-WA0008.jpg", "IndexNo": "53.0", "N": "-1.5120667", "E": "37.255785", "Altitude_m": "1659.3", "DateTime": "10\/18\/2021 18:30:44", "FileName": "IMG-20211018-WA0008.jpg", "gx_media_links": "https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/875rcht937gqlrman10a3r0fo0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYN73wPyypFvPs14h7dLkH9rcbiAS1uFaSyi9k7g0ZY1OzZvJAMTQIGLOvT1V8rHAQ5E8oO0zgT8fLqUU1Ll8jGopSfjmQvn8IvccgXRfXf3acmPODFKfunx9QlKHuR10D_Ix_o4vsQYmoFeFTxVkt_E00VCGE6LGcLcoME2lM2RSVVhTsiv7tNDWMt33lKR7rp?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.255785, -1.5120667 ] } },
				{ "type": "Feature", "properties": { "Name": "10.0", "description": "IndexNo: 46<br>N: -1.514731667<br>E: 37.25488167<br>Altitude_m: 1,578.4<br>DateTime: 10\/18\/2021 18:26:40<br>FileName: IMG-20211018-WA0010.jpg", "IndexNo": "46.0", "N": "-1.514731667", "E": "37.25488167", "Altitude_m": "1578.4", "DateTime": "10\/18\/2021 18:26:40", "FileName": "IMG-20211018-WA0010.jpg", "gx_media_links": null }, "geometry": { "type": "Point", "coordinates": [ 37.25488167, -1.514731667 ] } },
				{ "type": "Feature", "properties": { "Name": "11.0", "description": "IndexNo: 46<br>N: -1.514731667<br>E: 37.25488167<br>Altitude_m: 1,578.4<br>DateTime: 10\/18\/2021 18:26:38<br>FileName: IMG-20211018-WA0011.jpg", "IndexNo": "46.0", "N": "-1.514731667", "E": "37.25488167", "Altitude_m": "1578.4", "DateTime": "10\/18\/2021 18:26:38", "FileName": "IMG-20211018-WA0011.jpg", "gx_media_links": null }, "geometry": { "type": "Point", "coordinates": [ 37.25488167, -1.514731667 ] } },
				{ "type": "Feature", "properties": { "Name": "12.0", "description": "<img src=\"https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/l9ukfqnl6r9ufsvgv3jlduqrss\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_va3jD8NWkuzE794x-kgDoi0l97FURsy5r8PGrygWp-OuxMGjblBGWslsdwn22U5NWBT7RbwllkZPftOqa4MpkHTKQE_7VYEcZ4-JaTdHGjEJRB1algGibCB-JtsBKWIFVWISe_hoG6NLkp8zODVG_t5LmT5XaIBFV6yxMh8HBjLL4Dhqo2xVohOnepWXxmsJ7A?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 46<br>N: -1.5147317<br>E: 37.2548817<br>Altitude_m: 1,590.6<br>DateTime: 10\/18\/2021 18:26:46<br>FileName: IMG-20211018-WA0012.jpg", "IndexNo": "46.0", "N": "-1.5147317", "E": "37.2548817", "Altitude_m": "1590.6", "DateTime": "10\/18\/2021 18:26:46", "FileName": "IMG-20211018-WA0012.jpg", "gx_media_links": "https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/l9ukfqnl6r9ufsvgv3jlduqrss\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_va3jD8NWkuzE794x-kgDoi0l97FURsy5r8PGrygWp-OuxMGjblBGWslsdwn22U5NWBT7RbwllkZPftOqa4MpkHTKQE_7VYEcZ4-JaTdHGjEJRB1algGibCB-JtsBKWIFVWISe_hoG6NLkp8zODVG_t5LmT5XaIBFV6yxMh8HBjLL4Dhqo2xVohOnepWXxmsJ7A?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2548817, -1.5147317 ] } },
				{ "type": "Feature", "properties": { "Name": "19.0", "description": "<img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/v75pk49vsoska25klj99n4294c\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vb9LbXti46yPqWckLQ6QxgcJqdEm0BN7O0f-09Zd42dBpe5nyQFfLaVbPmgMnWyRnKVf72p-of2jKRW_2vaFfpigAZtHO1V8Yvb5SQd-FCtKqfg7gpRMOrzZueFAJywP2a6jSsppdfrBnLrsDqEYczYmlTBkDDUKr79Tw4f_c79FQd7-0lp8l4fqRMVJ5Qp6wDa?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 29<br>N: -1.5289033<br>E: 37.26701<br>Altitude_m: 1,631.3<br>DateTime: 11\/16\/2021 15:00:50<br>FileName: IMG-20211116-WA0003.jpg", "IndexNo": "29.0", "N": "-1.5289033", "E": "37.26701", "Altitude_m": "1631.3", "DateTime": "11\/16\/2021 15:00:50", "FileName": "IMG-20211116-WA0003.jpg", "gx_media_links": "https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/v75pk49vsoska25klj99n4294c\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vb9LbXti46yPqWckLQ6QxgcJqdEm0BN7O0f-09Zd42dBpe5nyQFfLaVbPmgMnWyRnKVf72p-of2jKRW_2vaFfpigAZtHO1V8Yvb5SQd-FCtKqfg7gpRMOrzZueFAJywP2a6jSsppdfrBnLrsDqEYczYmlTBkDDUKr79Tw4f_c79FQd7-0lp8l4fqRMVJ5Qp6wDa?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.26701, -1.5289033 ] } },
				{ "type": "Feature", "properties": { "Name": "13.0", "description": "<img src=\"https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/qiboaemffl46dsqo2g3gs33530\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZrLehcIJFtyEP5MlcdY678iHRkDl2frtx1hmxh2JoOudJvKugRi9RAb2d1ieT3NYFtrwK5-h6pGRaIL15ZqPKfgb3IU_2v8EIMVW16XQaJ4DBdJifHta4j8I2Sj9i1tPE0fi2r7lOwYhP5feWEmiJ-JxCU5vBJt4qfb4MN-O8YyvrbCZXWLJpMZsx93XgWtAM?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 55<br>N: -1.508844<br>E: 37.2569363<br>Altitude_m: 1,617.8<br>DateTime: 10\/18\/2021 18:58:03<br>FileName: IMG-20211018-WA0014.jpg<br><br><img src=\"https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/0m8con0uhdpok3q49t9di4u790\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbPE9c_qT0GjlwJ2Zx2-600MHJS-gOaZ_O3G_Dz5ps0MPrAHoGkTn4efgNCIGV6xAVFtffIrQNQM1QlDvVzyksgYNbqrlig8IMEX-cZCe0eSV-S2N-hm2s6pFbZgKBMbrF5Ql7rsywyQEFtPEfN_ZT-BswrRMahizeF1SCh7JkBJI5gpYr8I9DOutDE6xgNV74?session=0&fife\" height=\"200\" width=\"auto\" \/>", "IndexNo": "55.0", "N": "-1.508844", "E": "37.2569363", "Altitude_m": "1617.8", "DateTime": "10\/18\/2021 18:58:03", "FileName": "IMG-20211018-WA0014.jpg", "gx_media_links": "https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/qiboaemffl46dsqo2g3gs33530\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZrLehcIJFtyEP5MlcdY678iHRkDl2frtx1hmxh2JoOudJvKugRi9RAb2d1ieT3NYFtrwK5-h6pGRaIL15ZqPKfgb3IU_2v8EIMVW16XQaJ4DBdJifHta4j8I2Sj9i1tPE0fi2r7lOwYhP5feWEmiJ-JxCU5vBJt4qfb4MN-O8YyvrbCZXWLJpMZsx93XgWtAM?session=0&fife https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/0m8con0uhdpok3q49t9di4u790\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbPE9c_qT0GjlwJ2Zx2-600MHJS-gOaZ_O3G_Dz5ps0MPrAHoGkTn4efgNCIGV6xAVFtffIrQNQM1QlDvVzyksgYNbqrlig8IMEX-cZCe0eSV-S2N-hm2s6pFbZgKBMbrF5Ql7rsywyQEFtPEfN_ZT-BswrRMahizeF1SCh7JkBJI5gpYr8I9DOutDE6xgNV74?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2569363, -1.508844 ] } },
				{ "type": "Feature", "properties": { "Name": "14.0", "description": "<img src=\"https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/rksetpi02b7s0v6rjhq8rkpih4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaBlk5Nrk7dBE4GA00RNO0LmailLenOtiCnFM1LyuFPlvsrJSI-WItTjpHgkib2npo6D5hH0shnOSqYK0pdCv4g7CDytViYs0C_a-Bx7C35-jwCoY3JkHvi-X3M0CQWgTLa8Zf_yYzmxkoovNbEjAVuwfWMFkabGgUuTpdAGQHnOkvHvcDgXNXQZVJI6fsAm9M?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 55<br>N: -1.508844<br>E: 37.2569363<br>Altitude_m: 1,617.8<br>DateTime: 10\/18\/2021 18:58:07<br>FileName: IMG-20211018-WA0015.jpg", "IndexNo": "55.0", "N": "-1.508844", "E": "37.2569363", "Altitude_m": "1617.8", "DateTime": "10\/18\/2021 18:58:07", "FileName": "IMG-20211018-WA0015.jpg", "gx_media_links": "https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/rksetpi02b7s0v6rjhq8rkpih4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaBlk5Nrk7dBE4GA00RNO0LmailLenOtiCnFM1LyuFPlvsrJSI-WItTjpHgkib2npo6D5hH0shnOSqYK0pdCv4g7CDytViYs0C_a-Bx7C35-jwCoY3JkHvi-X3M0CQWgTLa8Zf_yYzmxkoovNbEjAVuwfWMFkabGgUuTpdAGQHnOkvHvcDgXNXQZVJI6fsAm9M?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2569363, -1.508844 ] } },
				{ "type": "Feature", "properties": { "Name": "15.0", "description": "<img src=\"https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/amn5cnq1i0jnk0ivli2fdeid0o\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaITe7IVckk7Lr2PF1E_8uyuAzXilDEO40CnnyvSxU557tuj06CJdcREq_37x8WMlYTf9MAoq4jgxyFIU9VVE1rBg1IWxOMMr6XAB8vQuEK45eeGz4r2BSKucioVQB5c9X5qn-aGej3ISEkExJk7wDil0R4joMu7SsnUtsawLC3hsMtKRJnYYVCq6lBclcde-s?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 149<br>N: -1.7520466<br>E: 37.202551<br>Altitude_m: <br>DateTime: 11\/03\/29\/06<br>FileName: IMG-20211104-WA0000.jpg", "IndexNo": "149.0", "N": "-1.7520466", "E": "37.202551", "Altitude_m": "", "DateTime": "11\/03\/29\/06", "FileName": "IMG-20211104-WA0000.jpg", "gx_media_links": "https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/amn5cnq1i0jnk0ivli2fdeid0o\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaITe7IVckk7Lr2PF1E_8uyuAzXilDEO40CnnyvSxU557tuj06CJdcREq_37x8WMlYTf9MAoq4jgxyFIU9VVE1rBg1IWxOMMr6XAB8vQuEK45eeGz4r2BSKucioVQB5c9X5qn-aGej3ISEkExJk7wDil0R4joMu7SsnUtsawLC3hsMtKRJnYYVCq6lBclcde-s?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.202551, -1.7520466 ] } },
				{ "type": "Feature", "properties": { "Name": "16.0", "description": "<img src=\"https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/fio5hie985st7j384lhases79o\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZcTNRy9Opa7J-mx3G23jgtqHXo-rTc0nNEHFpHhmCRMDpHyfMx8xiLGwf0H8XpcamZM09CkHIri0G80HfZEUD0uoOlFeesNu7X6bHYhsXUoPeknjHQsFlQL1itITdGbiWC7mob0f8O1RoDXE41bPVYEHxWsmt2EZcHLq0406bZb3M7gidS40kqaE1fzJKVqjM?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 23<br>N: -1.5243137<br>E: 37.2666034<br>Altitude_m: <br>DateTime: 11\/16\/2021 14:58:08<br>FileName: IMG-20211116-WA0000.jpg", "IndexNo": "23.0", "N": "-1.5243137", "E": "37.2666034", "Altitude_m": "", "DateTime": "11\/16\/2021 14:58:08", "FileName": "IMG-20211116-WA0000.jpg", "gx_media_links": "https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/fio5hie985st7j384lhases79o\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZcTNRy9Opa7J-mx3G23jgtqHXo-rTc0nNEHFpHhmCRMDpHyfMx8xiLGwf0H8XpcamZM09CkHIri0G80HfZEUD0uoOlFeesNu7X6bHYhsXUoPeknjHQsFlQL1itITdGbiWC7mob0f8O1RoDXE41bPVYEHxWsmt2EZcHLq0406bZb3M7gidS40kqaE1fzJKVqjM?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2666034, -1.5243137 ] } },
				{ "type": "Feature", "properties": { "Name": "17.0", "description": "<img src=\"https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/hbbmgf17ctohgqvgduobq6ske4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYtUqZaF7kKaupV7eYQ3fzXDzsEPuht2JbXJj5yRmr3P6nSsMeEkVrPk5xMn8t6gwnAb5hQ3kXTskOXEuQ8xzVIpQUDfmMFRvIm_ZVvBGHZIxM4FdydZHTzCfpC6LACky1m3f3KJvoRsMXp5078LjyFDDIKdGFeVpXiYOdQEpYol1myvn1xFRYJ8ZTLOwwaslk?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 41<br>N: -1.5453167<br>E: 37.2550283<br>Altitude_m: 1,615.8<br>DateTime: 11\/16\/2021 15:14:27<br>FileName: IMG-20211116-WA0001.jpg", "IndexNo": "41.0", "N": "-1.5453167", "E": "37.2550283", "Altitude_m": "1615.8", "DateTime": "11\/16\/2021 15:14:27", "FileName": "IMG-20211116-WA0001.jpg", "gx_media_links": "https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/hbbmgf17ctohgqvgduobq6ske4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYtUqZaF7kKaupV7eYQ3fzXDzsEPuht2JbXJj5yRmr3P6nSsMeEkVrPk5xMn8t6gwnAb5hQ3kXTskOXEuQ8xzVIpQUDfmMFRvIm_ZVvBGHZIxM4FdydZHTzCfpC6LACky1m3f3KJvoRsMXp5078LjyFDDIKdGFeVpXiYOdQEpYol1myvn1xFRYJ8ZTLOwwaslk?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2550283, -1.5453167 ] } },
				{ "type": "Feature", "properties": { "Name": "18.0", "description": "<img src=\"https:\/\/doc-0g-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/g4keoevqu3tin454f2g7vv54bc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZV4fnT2Y_DJXVUJ2S_au2s7QcHkv0zGKIDy3q4S7LKke3vlQwsJfh1o2Kv1mR7dpgzek23u-vM87sQPGl459-Vi1Ti5MV_WCGKpc13Owc9teedPkPpncouDNVyooVLb8uP1EN8aZNYmacKnbgExA36pKyuKwTf6Hj0HqlqTxI8TS4fYM_vWDg5ttlYeppTPdKB?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 34<br>N: -1.5239595<br>E: 37.2625556<br>Altitude_m: <br>DateTime: 11\/16\/2021 15:00:50<br>FileName: IMG-20211116-WA0002.jpg", "IndexNo": "34.0", "N": "-1.5239595", "E": "37.2625556", "Altitude_m": "", "DateTime": "11\/16\/2021 15:00:50", "FileName": "IMG-20211116-WA0002.jpg", "gx_media_links": "https:\/\/doc-0g-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/g4keoevqu3tin454f2g7vv54bc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZV4fnT2Y_DJXVUJ2S_au2s7QcHkv0zGKIDy3q4S7LKke3vlQwsJfh1o2Kv1mR7dpgzek23u-vM87sQPGl459-Vi1Ti5MV_WCGKpc13Owc9teedPkPpncouDNVyooVLb8uP1EN8aZNYmacKnbgExA36pKyuKwTf6Hj0HqlqTxI8TS4fYM_vWDg5ttlYeppTPdKB?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2625556, -1.5239595 ] } },
				{ "type": "Feature", "properties": { "Name": "20.0", "description": "<img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/3hrhe0p9j5tci14apl3rq2839s\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYh77McLjlJaAC32TZGnJENxGPezc0bNcMZJUY8CQDS3qDKwvuetSQ32luZvAtGWo9sY2oQNSq9JQmFMnzFb6BzDdCYzwdLkX1AXYgSY8MSksU8h7AX3nc4XD2QtH1iManiOYFNKPIZMxb9VeJGhbGVLTb7GrslzCnDN5LwvKs42y8rdOpBb1eHbov0X9n_yu4?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 10<br>N: -1.5120132<br>E: 37.2285115<br>Altitude_m: <br>DateTime: 11\/16\/2021 11:59:43<br>FileName: IMG-20211116-WA0004.jpg", "IndexNo": "10.0", "N": "-1.5120132", "E": "37.2285115", "Altitude_m": "", "DateTime": "11\/16\/2021 11:59:43", "FileName": "IMG-20211116-WA0004.jpg", "gx_media_links": "https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/3hrhe0p9j5tci14apl3rq2839s\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYh77McLjlJaAC32TZGnJENxGPezc0bNcMZJUY8CQDS3qDKwvuetSQ32luZvAtGWo9sY2oQNSq9JQmFMnzFb6BzDdCYzwdLkX1AXYgSY8MSksU8h7AX3nc4XD2QtH1iManiOYFNKPIZMxb9VeJGhbGVLTb7GrslzCnDN5LwvKs42y8rdOpBb1eHbov0X9n_yu4?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2285115, -1.5120132 ] } },
				{ "type": "Feature", "properties": { "Name": "21.0", "description": "<img src=\"https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/27s2j067gbfvfp5s9ut4qlf14k\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbAY5QprVO0ZEuXWW9KcFt96A77yK5eMv0gYLEhoAiZ-7Uiqx24U_yo-xdnfA_qSzzJtinpOYaM7RXM1tCOtFiLtHczLW5wAxBpMk-uKL-7P0NTnOZRqgkz4oQOd1jP9BfAH1f_Bw42ZAs_axgTXnYZa3Gu30j09aoNX3D6tm-qIzutRRwy0eZ6-Lt3CKDV1MEY?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 33<br>N: -1.5239595<br>E: 37.2625556<br>Altitude_m: <br>DateTime: 11\/16\/2021 15:05:44<br>FileName: IMG-20211116-WA0005.jpg", "IndexNo": "33.0", "N": "-1.5239595", "E": "37.2625556", "Altitude_m": "", "DateTime": "11\/16\/2021 15:05:44", "FileName": "IMG-20211116-WA0005.jpg", "gx_media_links": "https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/27s2j067gbfvfp5s9ut4qlf14k\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbAY5QprVO0ZEuXWW9KcFt96A77yK5eMv0gYLEhoAiZ-7Uiqx24U_yo-xdnfA_qSzzJtinpOYaM7RXM1tCOtFiLtHczLW5wAxBpMk-uKL-7P0NTnOZRqgkz4oQOd1jP9BfAH1f_Bw42ZAs_axgTXnYZa3Gu30j09aoNX3D6tm-qIzutRRwy0eZ6-Lt3CKDV1MEY?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2625556, -1.5239595 ] } },
				{ "type": "Feature", "properties": { "Name": "22.0", "description": "<img src=\"https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/d17t8e5as6mthe18h11keinp78\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaM37R5QTkIUUdkKgZobVWuUkHOboC3XtHp6f2ZclirC-hcrQ3HAYXYE-n2h2_fizVo13sxPoDFRqJSWetu0JP-quZYTjK5yoqagC-BT542lqQ-tmxLOd-X4t1_J__-5peOPvUtGnPTvdf7g14_CsNkT4f7aXFIj6B6RunVAA5QooYfh4CfToXBKdX0vILzBHg?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 12<br>N: -1.5352083<br>E: 37.193165<br>Altitude_m: 1,625.9<br>DateTime: 11\/16\/2021 12:03:56<br>FileName: IMG-20211116-WA0006.jpg", "IndexNo": "12.0", "N": "-1.5352083", "E": "37.193165", "Altitude_m": "1625.9", "DateTime": "11\/16\/2021 12:03:56", "FileName": "IMG-20211116-WA0006.jpg", "gx_media_links": "https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/d17t8e5as6mthe18h11keinp78\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaM37R5QTkIUUdkKgZobVWuUkHOboC3XtHp6f2ZclirC-hcrQ3HAYXYE-n2h2_fizVo13sxPoDFRqJSWetu0JP-quZYTjK5yoqagC-BT542lqQ-tmxLOd-X4t1_J__-5peOPvUtGnPTvdf7g14_CsNkT4f7aXFIj6B6RunVAA5QooYfh4CfToXBKdX0vILzBHg?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.193165, -1.5352083 ] } },
				{ "type": "Feature", "properties": { "Name": "23.0", "description": "<img src=\"https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/l27ji8p48kkg8fpsrkeo2sskvo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vabWkgkiRGav-mLYx43m_X4YsA1__S9kALrM0_Cc08YH5TcPXU2j0VsFdNtNn6ZMaskmaSR6X7TP9kVBop5EbwN6b6LnBMYidmuXB9gYzy83MZikCnkBUYf5jG_D1prp4fht21sBJOramuVUQaN_kiDdchLjGqt6aG3DbMFqqZ5GhpzeQbfI4fXNzUsUetin_Y?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 15<br>N: -1.51812<br>E: 37.268175<br>Altitude_m: 1,624.6<br>DateTime: 10\/13\/2021 14:40:01<br>FileName: IMG-20211013-WA0010.jpg", "IndexNo": "15.0", "N": "-1.51812", "E": "37.268175", "Altitude_m": "1624.6", "DateTime": "10\/13\/2021 14:40:01", "FileName": "IMG-20211013-WA0010.jpg", "gx_media_links": "https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/l27ji8p48kkg8fpsrkeo2sskvo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vabWkgkiRGav-mLYx43m_X4YsA1__S9kALrM0_Cc08YH5TcPXU2j0VsFdNtNn6ZMaskmaSR6X7TP9kVBop5EbwN6b6LnBMYidmuXB9gYzy83MZikCnkBUYf5jG_D1prp4fht21sBJOramuVUQaN_kiDdchLjGqt6aG3DbMFqqZ5GhpzeQbfI4fXNzUsUetin_Y?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.268175, -1.51812 ] } },
				{ "type": "Feature", "properties": { "Name": "24.0", "description": "<img src=\"https:\/\/doc-0g-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/8acog5u3quat3g07k2ji8383ok\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbW2U7RmZ-XUgIGj5kfTo-HNmv4bRSsf9y_ovKyc5pmLbS6AptYzyc_gN5mg7jrxWwCfRJCcW-p4GFrW3H8cqbprf8HxxRuyXijPmVmagvXcqWzDccSLhKpWbJsawvOV5KdRUKv4ZnC2FNOIPEadWOttlmt0EccQhN-QSCWaSbZa4_LY4chfvfJndtWQbW1AktD?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 31<br>N: -1.5239595<br>E: 37.2625556<br>Altitude_m: <br>DateTime: 11\/16\/2021 15:03:50<br>FileName: IMG-20211116-WA0007.jpg", "IndexNo": "31.0", "N": "-1.5239595", "E": "37.2625556", "Altitude_m": "", "DateTime": "11\/16\/2021 15:03:50", "FileName": "IMG-20211116-WA0007.jpg", "gx_media_links": "https:\/\/doc-0g-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/8acog5u3quat3g07k2ji8383ok\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbW2U7RmZ-XUgIGj5kfTo-HNmv4bRSsf9y_ovKyc5pmLbS6AptYzyc_gN5mg7jrxWwCfRJCcW-p4GFrW3H8cqbprf8HxxRuyXijPmVmagvXcqWzDccSLhKpWbJsawvOV5KdRUKv4ZnC2FNOIPEadWOttlmt0EccQhN-QSCWaSbZa4_LY4chfvfJndtWQbW1AktD?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2625556, -1.5239595 ] } },
				{ "type": "Feature", "properties": { "Name": "25.0", "description": "<img src=\"https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/0ado9v7me9h47pqbg3gl6ooo5c\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYdV91QcAtt8vMXUXgnAKUAXf4_JW8nFnIwjnGdnGYblRzYMscrHLstf5GF1hA89hmngq2zCrB0WZiFUDkUi4HvULPLPC00qFtUsRcdRhrvysHb1Ixt3Z0c8NiQgIfWjBJdXNEpishBPQTRl9D6lmeJb_h4PeDkvbYnU8qD2Sp803TPyKiSEncPXOYxSWpOgDWS?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 46<br>N: -1.5239595<br>E: 37.2625556<br>Altitude_m: <br>DateTime: 11\/16\/2021 15:17:39<br>FileName: IMG-20211116-WA0008.jpg", "IndexNo": "46.0", "N": "-1.5239595", "E": "37.2625556", "Altitude_m": "", "DateTime": "11\/16\/2021 15:17:39", "FileName": "IMG-20211116-WA0008.jpg", "gx_media_links": "https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/0ado9v7me9h47pqbg3gl6ooo5c\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYdV91QcAtt8vMXUXgnAKUAXf4_JW8nFnIwjnGdnGYblRzYMscrHLstf5GF1hA89hmngq2zCrB0WZiFUDkUi4HvULPLPC00qFtUsRcdRhrvysHb1Ixt3Z0c8NiQgIfWjBJdXNEpishBPQTRl9D6lmeJb_h4PeDkvbYnU8qD2Sp803TPyKiSEncPXOYxSWpOgDWS?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2625556, -1.5239595 ] } },
				{ "type": "Feature", "properties": { "Name": "26.0", "description": "<img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/ukck5q69t3tqmoblp07gj4l2bs\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZ9Tb9wrQiPbgzEmCuc4NdXj8WgwyBvpsi9uolizHQE_70U6vx1TdqhfunRR2CJIiwHkrFK2MSuM-YxREIDr7BH0OidPC4dDsfMZ58resQFADv3jxyAA2_LGbE7qVIPesPUwBaVYSIKYcqLccAadxqKAL9VizLHeG7EJi5F8b9oUIrBgax6GowbgQ8mOnuuLi4?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 30<br>N: -1.5287433<br>E: 37.26789<br>Altitude_m: 1,641.7<br>DateTime: 11\/16\/2021 15:01:04<br>FileName: IMG-20211116-WA0009.jpg", "IndexNo": "30.0", "N": "-1.5287433", "E": "37.26789", "Altitude_m": "1641.7", "DateTime": "11\/16\/2021 15:01:04", "FileName": "IMG-20211116-WA0009.jpg", "gx_media_links": "https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/ukck5q69t3tqmoblp07gj4l2bs\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZ9Tb9wrQiPbgzEmCuc4NdXj8WgwyBvpsi9uolizHQE_70U6vx1TdqhfunRR2CJIiwHkrFK2MSuM-YxREIDr7BH0OidPC4dDsfMZ58resQFADv3jxyAA2_LGbE7qVIPesPUwBaVYSIKYcqLccAadxqKAL9VizLHeG7EJi5F8b9oUIrBgax6GowbgQ8mOnuuLi4?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.26789, -1.5287433 ] } },
				{ "type": "Feature", "properties": { "Name": "27.0", "description": "<img src=\"https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/tfon8b6ssf64a3dfaumb9mluek\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZ4ZDXA7FhoB0Un2WZxbxBDWKFNME1Qe9wa16S-gWdJ36EM1Wn-Rl24qYnxayatdm48a5ho2jI-5fhBrjJi2tzFvUlZeblwd5M6iLyokBDWTFFmgAKZdSUjHUXNkRGbU76q-JuuTqFX6yQZ1giwJ8Iik5ewxUuCwWBCEJTVuRfncQk4r62Rn1VMmEXa7Bgf3rBB?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 39<br>N: -1.5407065<br>E: 37.2546967<br>Altitude_m: <br>DateTime: 11\/16\/2021 15:13:30<br>FileName: IMG-20211116-WA0010.jpg", "IndexNo": "39.0", "N": "-1.5407065", "E": "37.2546967", "Altitude_m": "", "DateTime": "11\/16\/2021 15:13:30", "FileName": "IMG-20211116-WA0010.jpg", "gx_media_links": "https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/tfon8b6ssf64a3dfaumb9mluek\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZ4ZDXA7FhoB0Un2WZxbxBDWKFNME1Qe9wa16S-gWdJ36EM1Wn-Rl24qYnxayatdm48a5ho2jI-5fhBrjJi2tzFvUlZeblwd5M6iLyokBDWTFFmgAKZdSUjHUXNkRGbU76q-JuuTqFX6yQZ1giwJ8Iik5ewxUuCwWBCEJTVuRfncQk4r62Rn1VMmEXa7Bgf3rBB?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2546967, -1.5407065 ] } },
				{ "type": "Feature", "properties": { "Name": "28.0", "description": "<img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/1662nk8kctpc5ar7ptcil4uq34\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYwkB42s2gjBoJMmmES7pKdXIzUKirCcxA7sRJ4BPMRsUpjQj_gkbVXds49HYw2v8pU0X4efj5eWDFy_vghFLe9tNVlIuYD8mKUT_JmHO1ntC9prL9R-TuW2Pv8s1vpkEf3f9BmOBqLtyFCriGiMcboCj38Z_QgqoLy3n4K8W63n46y5x1rTKFeUDQmBKi8JC4s?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 17<br>N: -1.5243137<br>E: 37.2666034<br>Altitude_m: <br>DateTime: 11\/16\/2021 14:54:31<br>FileName: IMG-20211116-WA0011.jpg", "IndexNo": "17.0", "N": "-1.5243137", "E": "37.2666034", "Altitude_m": "", "DateTime": "11\/16\/2021 14:54:31", "FileName": "IMG-20211116-WA0011.jpg", "gx_media_links": "https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/1662nk8kctpc5ar7ptcil4uq34\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYwkB42s2gjBoJMmmES7pKdXIzUKirCcxA7sRJ4BPMRsUpjQj_gkbVXds49HYw2v8pU0X4efj5eWDFy_vghFLe9tNVlIuYD8mKUT_JmHO1ntC9prL9R-TuW2Pv8s1vpkEf3f9BmOBqLtyFCriGiMcboCj38Z_QgqoLy3n4K8W63n46y5x1rTKFeUDQmBKi8JC4s?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2666034, -1.5243137 ] } },
				{ "type": "Feature", "properties": { "Name": "29.0", "description": "<img src=\"https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/e35nob88sk34dp28643bt8j6t8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaGwA0dMVUoQOVFadV6czRzDVss3YewSQC7VZEAqnGiKEkvKzXJ7aV4U803o90u7MIoQFckfUo5a1onEDLOjgsYRKrwu9W6rourkoT4dPBA01R7nLqoFuDjp-Z0Fwnz7ECE6qromiyKm23Ufy3R78Kj71g-oOVb8v4nJ3i2-UrmL1TWXRahW8d4iuvnhAxtx9Jr?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 38<br>N: -1.5239595<br>E: 37.2625556<br>Altitude_m: <br>DateTime: 11\/16\/2021 15:09:25<br>FileName: IMG-20211116-WA0012.jpg<br><br><img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/hrmq9e63jiina14996g0ubncmc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYIsC4cDwvD6WxCX2Ua-iHy7d721b7YFdyofl8m79gp_oJ1cz2RA9h8JhJ1y7AJA_bla1e_K0Q2XdlThSQd1eJ50NNaum0_LbyFkuUPVEJYN_hSFMMZbV4nWOyvxyDT713YanxIx9MSXJs2WgM5H5q0-4z0iFPv8nn2WFqrmZ_DTElyiZoFeAiQg1uLFJAsSfUs?session=0&fife\" height=\"200\" width=\"auto\" \/>", "IndexNo": "38.0", "N": "-1.5239595", "E": "37.2625556", "Altitude_m": "", "DateTime": "11\/16\/2021 15:09:25", "FileName": "IMG-20211116-WA0012.jpg", "gx_media_links": "https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/e35nob88sk34dp28643bt8j6t8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaGwA0dMVUoQOVFadV6czRzDVss3YewSQC7VZEAqnGiKEkvKzXJ7aV4U803o90u7MIoQFckfUo5a1onEDLOjgsYRKrwu9W6rourkoT4dPBA01R7nLqoFuDjp-Z0Fwnz7ECE6qromiyKm23Ufy3R78Kj71g-oOVb8v4nJ3i2-UrmL1TWXRahW8d4iuvnhAxtx9Jr?session=0&fife https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/hrmq9e63jiina14996g0ubncmc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYIsC4cDwvD6WxCX2Ua-iHy7d721b7YFdyofl8m79gp_oJ1cz2RA9h8JhJ1y7AJA_bla1e_K0Q2XdlThSQd1eJ50NNaum0_LbyFkuUPVEJYN_hSFMMZbV4nWOyvxyDT713YanxIx9MSXJs2WgM5H5q0-4z0iFPv8nn2WFqrmZ_DTElyiZoFeAiQg1uLFJAsSfUs?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2625556, -1.5239595 ] } },
				{ "type": "Feature", "properties": { "Name": "30.0", "description": "<img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/e5fdd7969aimeldlbg6qhl4m9k\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY9RWJ36iVRmCZ7l2njpc14LvATOlYxGhfku4lE27lRQrcmAyQUXzHFNejqwIWP0yt5AGKLGp2yRGlNsAtrMQXrs9r-xFAh2LpqJDSrdnEDjOBjxQxYfsBsaVbvleZ93auIYO2ZVVxLMuPh9F2GH7q6bAZFbdsqmngIAWc7LxP0w8KlNHdj8bRkSqCLUGeyEWM?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 13<br>N: -1.5350895<br>E: 37.1838515<br>Altitude_m: <br>DateTime: 11\/16\/2021 12:30:44<br>FileName: IMG-20211116-WA0013.jpg", "IndexNo": "13.0", "N": "-1.5350895", "E": "37.1838515", "Altitude_m": "", "DateTime": "11\/16\/2021 12:30:44", "FileName": "IMG-20211116-WA0013.jpg", "gx_media_links": "https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/e5fdd7969aimeldlbg6qhl4m9k\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY9RWJ36iVRmCZ7l2njpc14LvATOlYxGhfku4lE27lRQrcmAyQUXzHFNejqwIWP0yt5AGKLGp2yRGlNsAtrMQXrs9r-xFAh2LpqJDSrdnEDjOBjxQxYfsBsaVbvleZ93auIYO2ZVVxLMuPh9F2GH7q6bAZFbdsqmngIAWc7LxP0w8KlNHdj8bRkSqCLUGeyEWM?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.1838515, -1.5350895 ] } },
				{ "type": "Feature", "properties": { "Name": "31.0", "description": "<img src=\"https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/ot8bi4eqceir3j9e3qdlnm9lfg\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYXs_hp4sU4zShtSnd85nlB1g0Smtqq72uSpz8lItd9YnFCxbIxjUvxceXLysaXF0Y4XXBr1Mgaqu4yetwCLxQtfqymEOUZFyq_2ZuNerujc33ritPyY4lkocSR3dOEBTAclyD3bwxcMVnDGpPEXTsseX87HE8mJmEwYzstrNz-s5aFXh7-Hmxmz43T_sRAjZ89?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 44<br>N: -1.54297<br>E: 37.2667683<br>Altitude_m: 2072<br>DateTime: 11\/16\/2021 15:16:38<br>FileName: IMG-20211116-WA0014.jpg", "IndexNo": "44.0", "N": "-1.54297", "E": "37.2667683", "Altitude_m": "2072.0", "DateTime": "11\/16\/2021 15:16:38", "FileName": "IMG-20211116-WA0014.jpg", "gx_media_links": "https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/ot8bi4eqceir3j9e3qdlnm9lfg\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYXs_hp4sU4zShtSnd85nlB1g0Smtqq72uSpz8lItd9YnFCxbIxjUvxceXLysaXF0Y4XXBr1Mgaqu4yetwCLxQtfqymEOUZFyq_2ZuNerujc33ritPyY4lkocSR3dOEBTAclyD3bwxcMVnDGpPEXTsseX87HE8mJmEwYzstrNz-s5aFXh7-Hmxmz43T_sRAjZ89?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2667683, -1.54297 ] } },
				{ "type": "Feature", "properties": { "Name": "32.0", "description": "<img src=\"https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/6940v5vm2phqgq0rr7dadhdu2k\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZc0tTbBGvDjUj87D1bvR1I89_foPaIYZCVVLGHJVMU9kepGeJUK6yX8bq3w1ec8tJ3SE-oRZriEYK-Y3qvj0ugyNcVNX3SrPGZAqwu7qte9t03PN6zHk1q_6IliYS5jdaICELXSdCml-54GRhiInR1Atf2hiQPu88jhrmwxlA3nnqA3WboarAI4Rj38m75aPGo?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 18<br>N: -1.5243137<br>E: 37.2666034<br>Altitude_m: <br>DateTime: 11\/16\/2021 14:54:34<br>FileName: IMG-20211116-WA0015.jpg", "IndexNo": "18.0", "N": "-1.5243137", "E": "37.2666034", "Altitude_m": "", "DateTime": "11\/16\/2021 14:54:34", "FileName": "IMG-20211116-WA0015.jpg", "gx_media_links": "https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/6940v5vm2phqgq0rr7dadhdu2k\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZc0tTbBGvDjUj87D1bvR1I89_foPaIYZCVVLGHJVMU9kepGeJUK6yX8bq3w1ec8tJ3SE-oRZriEYK-Y3qvj0ugyNcVNX3SrPGZAqwu7qte9t03PN6zHk1q_6IliYS5jdaICELXSdCml-54GRhiInR1Atf2hiQPu88jhrmwxlA3nnqA3WboarAI4Rj38m75aPGo?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2666034, -1.5243137 ] } },
				{ "type": "Feature", "properties": { "Name": "33.0", "description": "<img src=\"https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/884rp105rtncnfk7989kmscl4k\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vapjDq4-dmMKMXJIDQnqXeY11IPCIrLBiqBlIjrlBBm9fcq6YVLAyqG6QL601oOUnZ7CAU_Q-4FQkwX5C2lFG3Jx4jFqe1Tu3eZpARkkf8GsTdiJvjLjLQBU7J32BxWYktlwUk6fTjeooA8MiS1EaxlR3iia4cG5UfFyQfCM-aQxXd94USwzbEvbyY2nPpZmHMY?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 39<br>N: -1.5407065<br>E: 37.254696<br>Altitude_m: <br>DateTime: 11\/16\/2021 15:13:32<br>FileName: IMG-20211116-WA0016.jpg", "IndexNo": "39.0", "N": "-1.5407065", "E": "37.254696", "Altitude_m": "", "DateTime": "11\/16\/2021 15:13:32", "FileName": "IMG-20211116-WA0016.jpg", "gx_media_links": "https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/884rp105rtncnfk7989kmscl4k\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vapjDq4-dmMKMXJIDQnqXeY11IPCIrLBiqBlIjrlBBm9fcq6YVLAyqG6QL601oOUnZ7CAU_Q-4FQkwX5C2lFG3Jx4jFqe1Tu3eZpARkkf8GsTdiJvjLjLQBU7J32BxWYktlwUk6fTjeooA8MiS1EaxlR3iia4cG5UfFyQfCM-aQxXd94USwzbEvbyY2nPpZmHMY?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.254696, -1.5407065 ] } },
				{ "type": "Feature", "properties": { "Name": "34.0", "description": "<img src=\"https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/d65j7u8nj9j4nudptejqd7jtp4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYPTXc-ROw76Z6AhoM5w9roPzTtXXukJ1sVh6-TR-xDZupKpRtcpQNmrPgs9rA140GqZ31FNAp2KSQMyef9hZ81VmmfXSSonQsHQ1X2wmFGCkPQ9LNik2BGFeE5Zpj9q6q_YTaBRM-7ynExU79bztad6q4nUOOgWkvvNZEgAsitika4WtAuc-UcNPIbERT35QC_?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 3<br>N: -1.518435<br>E: 37.24101<br>Altitude_m: 1,612.4<br>DateTime: 11\/16\/2021 11:46:59<br>FileName: IMG-20211116-WA0017.jpg", "IndexNo": "3.0", "N": "-1.518435", "E": "37.24101", "Altitude_m": "1612.4", "DateTime": "11\/16\/2021 11:46:59", "FileName": "IMG-20211116-WA0017.jpg", "gx_media_links": "https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/d65j7u8nj9j4nudptejqd7jtp4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYPTXc-ROw76Z6AhoM5w9roPzTtXXukJ1sVh6-TR-xDZupKpRtcpQNmrPgs9rA140GqZ31FNAp2KSQMyef9hZ81VmmfXSSonQsHQ1X2wmFGCkPQ9LNik2BGFeE5Zpj9q6q_YTaBRM-7ynExU79bztad6q4nUOOgWkvvNZEgAsitika4WtAuc-UcNPIbERT35QC_?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.24101, -1.518435 ] } },
				{ "type": "Feature", "properties": { "Name": "35.0", "description": "<img src=\"https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/bu7v4cbe5f20072uoi1145likk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYxmTaV5VIZuHs2Cplrafsz56PpafBzaRGzUjfiEpktkA4xYSW320gwaoz2rq6SpHJUcBp0zWpnWkWDh-2onaTBgLfguFiwZUngJ5zrqknPCsBo-vlus2fYuKqZrnOFvqHTHB-KOTr-A5uWgJ4twWAtRqi9piRZhuquzcjxQ-MPdG3I_psg8bdzgzy8NBY2IuLS?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 26<br>N: -1.5239595<br>E: 37.2625556<br>Altitude_m: <br>DateTime: 11\/16\/2021 15:00:12<br>FileName: IMG-20211116-WA0018.jpg", "IndexNo": "26.0", "N": "-1.5239595", "E": "37.2625556", "Altitude_m": "", "DateTime": "11\/16\/2021 15:00:12", "FileName": "IMG-20211116-WA0018.jpg", "gx_media_links": "https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/bu7v4cbe5f20072uoi1145likk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYxmTaV5VIZuHs2Cplrafsz56PpafBzaRGzUjfiEpktkA4xYSW320gwaoz2rq6SpHJUcBp0zWpnWkWDh-2onaTBgLfguFiwZUngJ5zrqknPCsBo-vlus2fYuKqZrnOFvqHTHB-KOTr-A5uWgJ4twWAtRqi9piRZhuquzcjxQ-MPdG3I_psg8bdzgzy8NBY2IuLS?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2625556, -1.5239595 ] } },
				{ "type": "Feature", "properties": { "Name": "36.0", "description": "<img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/g96foqlnpg028s090ciqmc898c\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYR3-RY7qX0ULrpA0ybVT4gXSTTS9U2JLyi-BVs9YThbJxfO5EhVFk-8_E2E0eyNW_z121kGHbmdAUnF70dFLesW2hfUheQ6v5cF1KoaYBBFsXMRtvhfKWn4KFrjzgfD_D0JlIMlpI99cXQAVf0VvvmweiRfg2I4vMArhcU8xdH8cmDhF_dxZEZ2cANQA3A4jY?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 8<br>N: -1.5201317<br>E: 37.2285115<br>Altitude_m: <br>DateTime: 11\/16\/2021 11:53:55<br>FileName: IMG-20211116-WA0019.jpg<br><br><img src=\"https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/p6n9dfqsb9e86vuiriua495q4g\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaCLmFAtc9iw64Hjh1xGG9lK9El6O5UENOmjtuqbAUp-Nas9xS-3FWCxse7ZqQUr7whUtjifwdpDFAo-Y86Zj7mHsYiajk_2DrL0mPlkPbzdPBiNI2FVCLj7kwNnB7J8sf22KDtwdilEmEVzTb_Z4sLS5F0j7IlQ93HgRfMI4wu8VfENns5sMVMYqZbpKQNWjo?session=0&fife\" height=\"200\" width=\"auto\" \/>", "IndexNo": "8.0", "N": "-1.5201317", "E": "37.2285115", "Altitude_m": "", "DateTime": "11\/16\/2021 11:53:55", "FileName": "IMG-20211116-WA0019.jpg", "gx_media_links": "https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/g96foqlnpg028s090ciqmc898c\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYR3-RY7qX0ULrpA0ybVT4gXSTTS9U2JLyi-BVs9YThbJxfO5EhVFk-8_E2E0eyNW_z121kGHbmdAUnF70dFLesW2hfUheQ6v5cF1KoaYBBFsXMRtvhfKWn4KFrjzgfD_D0JlIMlpI99cXQAVf0VvvmweiRfg2I4vMArhcU8xdH8cmDhF_dxZEZ2cANQA3A4jY?session=0&fife https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/p6n9dfqsb9e86vuiriua495q4g\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaCLmFAtc9iw64Hjh1xGG9lK9El6O5UENOmjtuqbAUp-Nas9xS-3FWCxse7ZqQUr7whUtjifwdpDFAo-Y86Zj7mHsYiajk_2DrL0mPlkPbzdPBiNI2FVCLj7kwNnB7J8sf22KDtwdilEmEVzTb_Z4sLS5F0j7IlQ93HgRfMI4wu8VfENns5sMVMYqZbpKQNWjo?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2285115, -1.5201317 ] } },
				{ "type": "Feature", "properties": { "Name": "37.0", "description": "<img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/7qo3ho8besvqqhldbes6t7bbm8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_varnZ7Yw6gOrrGrWfYYt5klBaM6_EsXzgKDFudZ6o2nDdIaHbtgHZU1mY99M81aPnJEWERZ0ZWtnJLA0CuTlMUjJpSMhSAvpripP-cgG6P4oYV7vBP7TahGjdW3C1bmkSRdiUt0cwi-oArF77iVDDr15txY6QuK0Sb1INQryhfY-CfyhZODlDbFo_gf6_GOjmk0?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 4<br>N: -1.5190767<br>E: 37.2388567<br>Altitude_m: 1,678.9<br>DateTime: 11\/16\/2021 11:50:22<br>FileName: IMG-20211116-WA0021.jpg", "IndexNo": "4.0", "N": "-1.5190767", "E": "37.2388567", "Altitude_m": "1678.9", "DateTime": "11\/16\/2021 11:50:22", "FileName": "IMG-20211116-WA0021.jpg", "gx_media_links": "https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/7qo3ho8besvqqhldbes6t7bbm8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_varnZ7Yw6gOrrGrWfYYt5klBaM6_EsXzgKDFudZ6o2nDdIaHbtgHZU1mY99M81aPnJEWERZ0ZWtnJLA0CuTlMUjJpSMhSAvpripP-cgG6P4oYV7vBP7TahGjdW3C1bmkSRdiUt0cwi-oArF77iVDDr15txY6QuK0Sb1INQryhfY-CfyhZODlDbFo_gf6_GOjmk0?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2388567, -1.5190767 ] } },
				{ "type": "Feature", "properties": { "Name": "38.0", "description": "<img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/r9eqtk23rqs2md3cctodl9qmuk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vafZ8X1kcfnRO7WH-7-pklH8c34RTwseQpVEOvUdwSVJObcEat6juTPGnJWzZ7tmrJdonzNoAQXm9zh9wgWg7vm6ydWhwlDeBeDRugqo5PCCaFRZo55MqCFIrKWEuHt4f5E6bDel4jr58SIsFFdAcZyirUKN4NWbFi1qRxQmU2nbPqxcphq1jdBufP3qZ8g9Snn?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 45<br>N: -1.5239595<br>E: 37.2625556<br>Altitude_m: <br>DateTime: 11\/16\/2021 15:17:37<br>FileName: IMG-20211116-WA0022.jpg", "IndexNo": "45.0", "N": "-1.5239595", "E": "37.2625556", "Altitude_m": "", "DateTime": "11\/16\/2021 15:17:37", "FileName": "IMG-20211116-WA0022.jpg", "gx_media_links": "https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/r9eqtk23rqs2md3cctodl9qmuk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vafZ8X1kcfnRO7WH-7-pklH8c34RTwseQpVEOvUdwSVJObcEat6juTPGnJWzZ7tmrJdonzNoAQXm9zh9wgWg7vm6ydWhwlDeBeDRugqo5PCCaFRZo55MqCFIrKWEuHt4f5E6bDel4jr58SIsFFdAcZyirUKN4NWbFi1qRxQmU2nbPqxcphq1jdBufP3qZ8g9Snn?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2625556, -1.5239595 ] } },
				{ "type": "Feature", "properties": { "Name": "39.0", "description": "<img src=\"https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/eo2u3hke6761h6tbldlri213uk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZnyziPvRE0R5VGDKLMoBEfK31rRUh3LhgkDz3xhG4Mr01egB-5Hs8kOhqVXlSs6xkfQMiK3viZQiKE57oSOOimJBWvhz2dRphOaoBzoe3tMFdrSuY616drC3Hjr_lzL8CItjRnKY7Ju46JpE-vkXp_U4mh2LvosAptjeiO4PftxEtPSsa2v23-Moldybblo7dB?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 5<br>N: -1.5193067<br>E: 37.2390733<br>Altitude_m: 1,623.9<br>DateTime: 11\/16\/2021 11:50:25<br>FileName: IMG-20211116-WA0023.jpg", "IndexNo": "5.0", "N": "-1.5193067", "E": "37.2390733", "Altitude_m": "1623.9", "DateTime": "11\/16\/2021 11:50:25", "FileName": "IMG-20211116-WA0023.jpg", "gx_media_links": "https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/eo2u3hke6761h6tbldlri213uk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZnyziPvRE0R5VGDKLMoBEfK31rRUh3LhgkDz3xhG4Mr01egB-5Hs8kOhqVXlSs6xkfQMiK3viZQiKE57oSOOimJBWvhz2dRphOaoBzoe3tMFdrSuY616drC3Hjr_lzL8CItjRnKY7Ju46JpE-vkXp_U4mh2LvosAptjeiO4PftxEtPSsa2v23-Moldybblo7dB?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2390733, -1.5193067 ] } },
				{ "type": "Feature", "properties": { "Name": "40.0", "description": "<img src=\"https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/96sl2str9g6qtmm7kdou67usic\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYhO4uUXdxB2aLoNN4KuwvQVMUxWj1zMSQO20h19gRzSyQBT9p_c7RQ8fmhAd5K_28YcFgaBE9_1GlFE0zgfEbwISIqkGnTz_dw4E6QRzfIVhmCIBYMJl0t1_nVETpMUnKJjPqJfsPAa44M92L8xWsM78e5FGVS2QOtj_IKRczcAZN5UXmVABeDyl0cFx2vfwt0?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 6<br>N: -1.5201317<br>E: 37.228511<br>Altitude_m: <br>DateTime: 11\/16\/2021 11:53:25<br>FileName: IMG-20211116-WA0025.jpg", "IndexNo": "6.0", "N": "-1.5201317", "E": "37.228511", "Altitude_m": "", "DateTime": "11\/16\/2021 11:53:25", "FileName": "IMG-20211116-WA0025.jpg", "gx_media_links": "https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/96sl2str9g6qtmm7kdou67usic\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYhO4uUXdxB2aLoNN4KuwvQVMUxWj1zMSQO20h19gRzSyQBT9p_c7RQ8fmhAd5K_28YcFgaBE9_1GlFE0zgfEbwISIqkGnTz_dw4E6QRzfIVhmCIBYMJl0t1_nVETpMUnKJjPqJfsPAa44M92L8xWsM78e5FGVS2QOtj_IKRczcAZN5UXmVABeDyl0cFx2vfwt0?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.228511, -1.5201317 ] } },
				{ "type": "Feature", "properties": { "Name": "41.0", "description": "<img src=\"https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/fga77epg6spe3tjubbdaotcar8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZ1y4N4ynBB_ws0gt5bWoOFjYPP5zMnjeeKZRJ30u-us74C9Eu2pqT4y02Bxux_4fZCukiIdp_7Wlb2Dz5pGfv4BrMD4-nXaJRYSWQAN4FmzjWrJn22rPryDHBE8Mv1Jo7_FjjaGe5Cc797JbhXptNgwLO_mrYJ3AUGlO0qft8AvRYnHMDA3A8zjmE1nxnKDxli?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 21<br>N: -1.5239595<br>E: 37.2625556<br>Altitude_m: <br>DateTime: 11\/16\/2021 14:56:30<br>FileName: IMG-20211116-WA0026.jpg<br><br><img src=\"https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/7a9hjqjm69k5trthgledvr9t98\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYb0HzsAZ_YT4YPSiB2w0E4Zzfn5UBVKVt9a8xLim0ZjuFldZ0CNa-ci_GvfJo_dFVqg0C9Bcdqwo2C55xE26dyLuMZl6p6WlSVXbwd6exsyGjFmnAWgmCCtGpqs5TqKDO9AY429HHhn5FW6tolRtpY75OalFcCl567i8sesvepdU_LxDodnCLc3Klp4Cf4gf8r?session=0&fife\" height=\"200\" width=\"auto\" \/>", "IndexNo": "21.0", "N": "-1.5239595", "E": "37.2625556", "Altitude_m": "", "DateTime": "11\/16\/2021 14:56:30", "FileName": "IMG-20211116-WA0026.jpg", "gx_media_links": "https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/fga77epg6spe3tjubbdaotcar8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZ1y4N4ynBB_ws0gt5bWoOFjYPP5zMnjeeKZRJ30u-us74C9Eu2pqT4y02Bxux_4fZCukiIdp_7Wlb2Dz5pGfv4BrMD4-nXaJRYSWQAN4FmzjWrJn22rPryDHBE8Mv1Jo7_FjjaGe5Cc797JbhXptNgwLO_mrYJ3AUGlO0qft8AvRYnHMDA3A8zjmE1nxnKDxli?session=0&fife https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/7a9hjqjm69k5trthgledvr9t98\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYb0HzsAZ_YT4YPSiB2w0E4Zzfn5UBVKVt9a8xLim0ZjuFldZ0CNa-ci_GvfJo_dFVqg0C9Bcdqwo2C55xE26dyLuMZl6p6WlSVXbwd6exsyGjFmnAWgmCCtGpqs5TqKDO9AY429HHhn5FW6tolRtpY75OalFcCl567i8sesvepdU_LxDodnCLc3Klp4Cf4gf8r?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2625556, -1.5239595 ] } },
				{ "type": "Feature", "properties": { "Name": "42.0", "description": "<img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/88ieq0c417iltgdtoif6hagmeo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZNxCDrM0r4mwET3vPJ36VuSqFxIgudmNF_vbEbfXfzMnolwWCNcicjkSEPAV_nchpnJUqvKLJ7SMWc92OTJH0rJlaCw8j3oGsod9T0S2I6j4ZHqMul8E3bvaai26SgrIuG3NoBamKZPly6aQIfTUuiqcwN1rcR0DwdtQ-xvQWyp0UnjK966DQCm7JT1jQC4xbP?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 27<br>N: -1.5289383<br>E: 37.2667733<br>Altitude_m: 1,660.4<br>DateTime: 11\/16\/2021 15:00:46<br>FileName: IMG-20211116-WA0027.jpg", "IndexNo": "27.0", "N": "-1.5289383", "E": "37.2667733", "Altitude_m": "1660.4", "DateTime": "11\/16\/2021 15:00:46", "FileName": "IMG-20211116-WA0027.jpg", "gx_media_links": "https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/88ieq0c417iltgdtoif6hagmeo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZNxCDrM0r4mwET3vPJ36VuSqFxIgudmNF_vbEbfXfzMnolwWCNcicjkSEPAV_nchpnJUqvKLJ7SMWc92OTJH0rJlaCw8j3oGsod9T0S2I6j4ZHqMul8E3bvaai26SgrIuG3NoBamKZPly6aQIfTUuiqcwN1rcR0DwdtQ-xvQWyp0UnjK966DQCm7JT1jQC4xbP?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2667733, -1.5289383 ] } },
				{ "type": "Feature", "properties": { "Name": "43.0", "description": "<img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/3rv112epmtmumr96a148gpsb0o\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaueIbkMyewz-8O7afDKqQW1meaigqkk--gOad9YP05qtv7R0-DCaJ3LjDX0i1oVh5Qp3JXN6uk1MzRwZn5BHsj0-RlDPCpUGX6xzH3Uvr2UabptimkyN8ITJvmciSsuC01YppHRpnKGlF3AK_58vcbGczrkhHqPJzVAXm8s2KgsZpmj1xDlqr5jSQ4ToIIPyV1?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 20<br>N: -1.5241768<br>E: 37.2645795<br>Altitude_m: <br>DateTime: 11\/16\/2021 14:55:12<br>FileName: IMG-20211116-WA0028.jpg", "IndexNo": "20.0", "N": "-1.5241768", "E": "37.2645795", "Altitude_m": "", "DateTime": "11\/16\/2021 14:55:12", "FileName": "IMG-20211116-WA0028.jpg", "gx_media_links": "https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/3rv112epmtmumr96a148gpsb0o\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaueIbkMyewz-8O7afDKqQW1meaigqkk--gOad9YP05qtv7R0-DCaJ3LjDX0i1oVh5Qp3JXN6uk1MzRwZn5BHsj0-RlDPCpUGX6xzH3Uvr2UabptimkyN8ITJvmciSsuC01YppHRpnKGlF3AK_58vcbGczrkhHqPJzVAXm8s2KgsZpmj1xDlqr5jSQ4ToIIPyV1?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2645795, -1.5241768 ] } },
				{ "type": "Feature", "properties": { "Name": "44.0", "description": "<img src=\"https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/reklm7nrlno7oikkv64ll6h63g\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vac0pTqMuvLfvbSCoI4CpbUWn2AYNuimAA01TZUQKMfwkHos7g9KyVwhBHxJmJ9PquE22EAzvfAmD4sDTNNdHz4emxvs5Cd_NFq0QTb8uwYHsHf9dfN85rVSvEi4-hGgybAX5I3g26O6SMZlkEbyuICwTcdjN5v6ZYJFLfBtc1rm8EvvSW3Ff12wLJhZO65-AYU?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 35<br>N: -1.5239595<br>E: 37.2625556<br>Altitude_m: <br>DateTime: 11\/16\/2021 15:07:04<br>FileName: IMG-20211116-WA0029.jpg", "IndexNo": "35.0", "N": "-1.5239595", "E": "37.2625556", "Altitude_m": "", "DateTime": "11\/16\/2021 15:07:04", "FileName": "IMG-20211116-WA0029.jpg", "gx_media_links": "https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/reklm7nrlno7oikkv64ll6h63g\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vac0pTqMuvLfvbSCoI4CpbUWn2AYNuimAA01TZUQKMfwkHos7g9KyVwhBHxJmJ9PquE22EAzvfAmD4sDTNNdHz4emxvs5Cd_NFq0QTb8uwYHsHf9dfN85rVSvEi4-hGgybAX5I3g26O6SMZlkEbyuICwTcdjN5v6ZYJFLfBtc1rm8EvvSW3Ff12wLJhZO65-AYU?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2625556, -1.5239595 ] } },
				{ "type": "Feature", "properties": { "Name": "45.0", "description": "<img src=\"https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/jod25fm8mhn7jri4s6chi4dsdo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYJH_FVlzug4nhGF0dy_c2DkBuaUFkgkbrUnrrRGadUFiSu5RSEQPJFGndzJx_L52Dw8G-soY9JwI38KiAIimLkefHDKIdmt5yhk9ilwrZhEypcPe18ZaddikslVy5Tel-sQu7q0vuT2xH3nUcOYWH-WIyt3CxRDmn0Cv_U8rYoiqVZFKFMhWYZWpXFUDbH3zST?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 19<br>N: -1.5241366<br>E: 37.2645795<br>Altitude_m: <br>DateTime: 11\/16\/2021 14:55:10<br>FileName: IMG-20211116-WA0030.jpg", "IndexNo": "19.0", "N": "-1.5241366", "E": "37.2645795", "Altitude_m": "", "DateTime": "11\/16\/2021 14:55:10", "FileName": "IMG-20211116-WA0030.jpg", "gx_media_links": "https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/jod25fm8mhn7jri4s6chi4dsdo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYJH_FVlzug4nhGF0dy_c2DkBuaUFkgkbrUnrrRGadUFiSu5RSEQPJFGndzJx_L52Dw8G-soY9JwI38KiAIimLkefHDKIdmt5yhk9ilwrZhEypcPe18ZaddikslVy5Tel-sQu7q0vuT2xH3nUcOYWH-WIyt3CxRDmn0Cv_U8rYoiqVZFKFMhWYZWpXFUDbH3zST?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2645795, -1.5241366 ] } },
				{ "type": "Feature", "properties": { "Name": "46.0", "description": "<img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/s299rakkqc2itup3dod0v9h2jo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYk0q_kuOB52KCYDZatU8g1vek6SGZnuzpfKwk7BjTLyk3M67DMmr2KVsZ0Hvj6jsygtBDSxGDn4IxdfBrC_Jh04o0xWMlTekF82Izt4ZImv3xahmZea-EBw5aFDqINMJDgoefCOG83PJjJgcC2DhCt9FlscLt88qVsokIoCvu3BeOngwY7WctDtq6_n4vA1cc?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 42<br>N: -1.5453417<br>E: 37.2550167<br>Altitude_m: 1,615.4<br>DateTime: 11\/16\/2021 15:14:29<br>FileName: IMG-20211116-WA0031.jpg", "IndexNo": "42.0", "N": "-1.5453417", "E": "37.2550167", "Altitude_m": "1615.4", "DateTime": "11\/16\/2021 15:14:29", "FileName": "IMG-20211116-WA0031.jpg", "gx_media_links": "https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/s299rakkqc2itup3dod0v9h2jo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYk0q_kuOB52KCYDZatU8g1vek6SGZnuzpfKwk7BjTLyk3M67DMmr2KVsZ0Hvj6jsygtBDSxGDn4IxdfBrC_Jh04o0xWMlTekF82Izt4ZImv3xahmZea-EBw5aFDqINMJDgoefCOG83PJjJgcC2DhCt9FlscLt88qVsokIoCvu3BeOngwY7WctDtq6_n4vA1cc?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2550167, -1.5453417 ] } },
				{ "type": "Feature", "properties": { "Name": "47.0", "description": "<img src=\"https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/e9p8q7pjjfc8noe5s5dqtn5tkc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY9Ko3JS-lmttvksqFYiOb7_xju9iqurShjl-BvPQUeF6c2zZXO-N_ToGxZWujTu05xHE9aBpt_nrz1CVIG2BydP6Q7-oLPAGlE3ujyvx8LaxlcxWW38bu3rmSQD77XjSiEiWR6zE5RHHsWpQTISIq5LuRMlp229AmSFCOh6zfJojQzxzVoNIKGNiNJYh9FFkY?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 9<br>N: -1.5201317<br>E: 37.228511<br>Altitude_m: <br>DateTime: 11\/16\/2021 11:53:59<br>FileName: IMG-20211116-WA0033.jpg", "IndexNo": "9.0", "N": "-1.5201317", "E": "37.228511", "Altitude_m": "", "DateTime": "11\/16\/2021 11:53:59", "FileName": "IMG-20211116-WA0033.jpg", "gx_media_links": "https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/e9p8q7pjjfc8noe5s5dqtn5tkc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY9Ko3JS-lmttvksqFYiOb7_xju9iqurShjl-BvPQUeF6c2zZXO-N_ToGxZWujTu05xHE9aBpt_nrz1CVIG2BydP6Q7-oLPAGlE3ujyvx8LaxlcxWW38bu3rmSQD77XjSiEiWR6zE5RHHsWpQTISIq5LuRMlp229AmSFCOh6zfJojQzxzVoNIKGNiNJYh9FFkY?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.228511, -1.5201317 ] } },
				{ "type": "Feature", "properties": { "Name": "48.0", "description": "<img src=\"https:\/\/doc-0g-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/tf3hv0e2354ss0065t9of23eqc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZADPEFTavqEZ6AdMEzkkzMwmw9i5Zvc3nBbK3eLLtAADEurryrvyoWTJX3mDrJiUOZjE_lxUw4pWK8J8Okwhcx6ebjbCH9r9CofWlqRhIj6BNczU5vUDFV3nTTOUGtc0arMift21hGwTp8wjyQa3P2QGi1CsPcEYl-2-rB0cPz2TnXQL00O9wshQYkfKjuO2U?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 13<br>N: -1.5350895<br>E: 37.183851<br>Altitude_m: <br>DateTime: 11\/16\/2021 12:30:42<br>FileName: IMG-20211116-WA0034.jpg", "IndexNo": "13.0", "N": "-1.5350895", "E": "37.183851", "Altitude_m": "", "DateTime": "11\/16\/2021 12:30:42", "FileName": "IMG-20211116-WA0034.jpg", "gx_media_links": "https:\/\/doc-0g-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/tf3hv0e2354ss0065t9of23eqc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZADPEFTavqEZ6AdMEzkkzMwmw9i5Zvc3nBbK3eLLtAADEurryrvyoWTJX3mDrJiUOZjE_lxUw4pWK8J8Okwhcx6ebjbCH9r9CofWlqRhIj6BNczU5vUDFV3nTTOUGtc0arMift21hGwTp8wjyQa3P2QGi1CsPcEYl-2-rB0cPz2TnXQL00O9wshQYkfKjuO2U?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.183851, -1.5350895 ] } },
				{ "type": "Feature", "properties": { "Name": "49.0", "description": "<img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/c16u023r2jv97odglbpefsp9r4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbYCJd8W2SQhm8bmy1or-SVIeg-SR3n59h0eHww-V-pB3SbAEVPY1o495z7VeA15BpQ5XCTGFv2Xy3tK0YxHjVetFTLNkIRENF4JhoRGJZuyHa_2gZkeNjPuK7eneRhkd3R1ijRxgiT_v1w-GHqIoPWaqDjFyXTWEnWHZUfnaKXpRhoMZbbtRW0kuJjbS6naWmw?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 28<br>N: -1.52894<br>E: 37.2668983<br>Altitude_m: 1,645.3<br>DateTime: 11\/16\/2021 15:00:48<br>FileName: IMG-20211116-WA0035.jpg", "IndexNo": "28.0", "N": "-1.52894", "E": "37.2668983", "Altitude_m": "1645.3", "DateTime": "11\/16\/2021 15:00:48", "FileName": "IMG-20211116-WA0035.jpg", "gx_media_links": "https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/c16u023r2jv97odglbpefsp9r4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbYCJd8W2SQhm8bmy1or-SVIeg-SR3n59h0eHww-V-pB3SbAEVPY1o495z7VeA15BpQ5XCTGFv2Xy3tK0YxHjVetFTLNkIRENF4JhoRGJZuyHa_2gZkeNjPuK7eneRhkd3R1ijRxgiT_v1w-GHqIoPWaqDjFyXTWEnWHZUfnaKXpRhoMZbbtRW0kuJjbS6naWmw?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2668983, -1.52894 ] } },
				{ "type": "Feature", "properties": { "Name": "50.0", "description": "<img src=\"https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/e12hvmu2tauf58ebh0bt8na5c0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZ5AQX50LOEhA8UkPq5FwVyQT3kRoPWrU7Rjp-ZDyt_ZqCJUlhSKNwfgpGPVqYRKqKovF3skAul_NaQEUqS-mGRIs7pZJvHWYRJr11nMATar1z8Ag0bOSe22xsVilqJItiVROde9Aoo9tdBxKe82DwtPTDkC_AjVXj6kDDN-A3jVNxyGGdRuUOQaHNB10alwsyU?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 37<br>N: -1.5239595<br>E: 37.262556<br>Altitude_m: <br>DateTime: 11\/16\/2021 15:09:23<br>FileName: IMG-20211116-WA0036.jpg", "IndexNo": "37.0", "N": "-1.5239595", "E": "37.262556", "Altitude_m": "", "DateTime": "11\/16\/2021 15:09:23", "FileName": "IMG-20211116-WA0036.jpg", "gx_media_links": "https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/e12hvmu2tauf58ebh0bt8na5c0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZ5AQX50LOEhA8UkPq5FwVyQT3kRoPWrU7Rjp-ZDyt_ZqCJUlhSKNwfgpGPVqYRKqKovF3skAul_NaQEUqS-mGRIs7pZJvHWYRJr11nMATar1z8Ag0bOSe22xsVilqJItiVROde9Aoo9tdBxKe82DwtPTDkC_AjVXj6kDDN-A3jVNxyGGdRuUOQaHNB10alwsyU?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.262556, -1.5239595 ] } },
				{ "type": "Feature", "properties": { "Name": "51.0", "description": "<img src=\"https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/c50n21c9jerditaep6hnni4svs\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaONewgRq-WRDPQrIr1BQ9FCSakMUkD5g_BobWf_m79ZZUvMloE2fUIS96nyEdoUdUm9W05NkRRxTDLQXjjmcj4hfm48f6VWSqVQEemFoNJ55i5neEINRZER1dtQms2Xc9KePQ73YgPeVBVGdBRBRf6PFhiZinpY2zR9xQTt7eyKPi1a0A_1oBHh2gsEmYhIok?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 15<br>N: -1.5243137<br>E: 37.2666034<br>Altitude_m: <br>DateTime: 11\/16\/2021 14:52:38<br>FileName: IMG-20211116-WA0037.jpg", "IndexNo": "15.0", "N": "-1.5243137", "E": "37.2666034", "Altitude_m": "", "DateTime": "11\/16\/2021 14:52:38", "FileName": "IMG-20211116-WA0037.jpg", "gx_media_links": "https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/c50n21c9jerditaep6hnni4svs\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaONewgRq-WRDPQrIr1BQ9FCSakMUkD5g_BobWf_m79ZZUvMloE2fUIS96nyEdoUdUm9W05NkRRxTDLQXjjmcj4hfm48f6VWSqVQEemFoNJ55i5neEINRZER1dtQms2Xc9KePQ73YgPeVBVGdBRBRf6PFhiZinpY2zR9xQTt7eyKPi1a0A_1oBHh2gsEmYhIok?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2666034, -1.5243137 ] } },
				{ "type": "Feature", "properties": { "Name": "52.0", "description": "<img src=\"https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/l9lgfuh7brpc2ljrb72ef0a17k\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbkFGeGo7HVbiG6P9qiDk9_zB9gncOa9x3-jQlCvMxzRdYcFrum2Jhnz2PwiIjuzNXlcMatIUlkFM4y8YkOGwO_DmHfqvL8aTY91Pthr59HZZXCjcYdHp0hhFPcUJqOPH2vYM56Riek4FngbUWYR_2WBXIsen6LpJ1WW0zUbGygp8TBXST-XWIYl3i8NKQ9rWpU?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 36<br>N: -1.5239595<br>E: 37.262556<br>Altitude_m: <br>DateTime: 11\/16\/2021 15:07:06<br>FileName: IMG-20211116-WA0038.jpg", "IndexNo": "36.0", "N": "-1.5239595", "E": "37.262556", "Altitude_m": "", "DateTime": "11\/16\/2021 15:07:06", "FileName": "IMG-20211116-WA0038.jpg", "gx_media_links": "https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/l9lgfuh7brpc2ljrb72ef0a17k\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbkFGeGo7HVbiG6P9qiDk9_zB9gncOa9x3-jQlCvMxzRdYcFrum2Jhnz2PwiIjuzNXlcMatIUlkFM4y8YkOGwO_DmHfqvL8aTY91Pthr59HZZXCjcYdHp0hhFPcUJqOPH2vYM56Riek4FngbUWYR_2WBXIsen6LpJ1WW0zUbGygp8TBXST-XWIYl3i8NKQ9rWpU?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.262556, -1.5239595 ] } },
				{ "type": "Feature", "properties": { "Name": "53.0", "description": "<img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/237k6dulk3crns4avcjpin9nc0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaKvx-x0nfwfDArjaKKiPGoMjzgDZauC4BgWU-QE-VaM0qAf0YcPN0UT_NaFRDynuvRpbv3V4U2dJ9NUEqrP2KrQ8AsbU8W8o5hwjbIEf1HtsXeOUIFmGi-hCfoxqlDRqABbbZl6LRihw5PNrmtqC4DFuBCLJqldaqSm0NYAWHyrhLJ8yEVIgAuerfcHOAuB6ZX?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 2<br>N: -1.518435<br>E: 37.2410099<br>Altitude_m: 1,612.4<br>DateTime: 11\/16\/2021 11:46:56<br>FileName: IMG-20211116-WA0039.jpg", "IndexNo": "2.0", "N": "-1.518435", "E": "37.2410099", "Altitude_m": "1612.4", "DateTime": "11\/16\/2021 11:46:56", "FileName": "IMG-20211116-WA0039.jpg", "gx_media_links": "https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/237k6dulk3crns4avcjpin9nc0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaKvx-x0nfwfDArjaKKiPGoMjzgDZauC4BgWU-QE-VaM0qAf0YcPN0UT_NaFRDynuvRpbv3V4U2dJ9NUEqrP2KrQ8AsbU8W8o5hwjbIEf1HtsXeOUIFmGi-hCfoxqlDRqABbbZl6LRihw5PNrmtqC4DFuBCLJqldaqSm0NYAWHyrhLJ8yEVIgAuerfcHOAuB6ZX?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2410099, -1.518435 ] } },
				{ "type": "Feature", "properties": { "Name": "54.0", "description": "<img src=\"https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/jlahaj1ks9fluaeu51kee9pv1o\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbUsEEjvpzqJVg8JKJ5TMnArxq6sNbY9NYoX-NIklWpZzJG51konnCriU7ma95iKUeqFjosZ_RxOADPQWKiPAKy3adTf89gDtkEM_SHnWuOAvrzdQALZr2PuwxlIcVfQ9TW4Wfeh9AOPVSL0WM1zH-0t8rJzN2PjVT_LVF-dpNLXbrzZnwjvtuQcbVir6CIBqiK?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 7<br>N: -1.5201317<br>E: 37.2285115<br>Altitude_m: <br>DateTime: 11\/16\/2021 11:53:27<br>FileName: IMG-20211116-WA0040.jpg", "IndexNo": "7.0", "N": "-1.5201317", "E": "37.2285115", "Altitude_m": "", "DateTime": "11\/16\/2021 11:53:27", "FileName": "IMG-20211116-WA0040.jpg", "gx_media_links": "https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/jlahaj1ks9fluaeu51kee9pv1o\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbUsEEjvpzqJVg8JKJ5TMnArxq6sNbY9NYoX-NIklWpZzJG51konnCriU7ma95iKUeqFjosZ_RxOADPQWKiPAKy3adTf89gDtkEM_SHnWuOAvrzdQALZr2PuwxlIcVfQ9TW4Wfeh9AOPVSL0WM1zH-0t8rJzN2PjVT_LVF-dpNLXbrzZnwjvtuQcbVir6CIBqiK?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2285115, -1.5201317 ] } },
				{ "type": "Feature", "properties": { "Name": "55.0", "description": "<img src=\"https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/pf7bc7trlmjqcj5isae3s2ci3o\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZOOc6HJD3ujCEc1QoDuTtz-dT6m5p0LUwNAikB8vkJTDgXDryq5rBpC9Epm2i9z3CFlOnhJhpMFjmpxEcLkuuc3ikIdyhV1LGviq5O2tBZjaUUybYwr83CmOfD3YqotW4FmdroE3FJjyDe7XJ8y5CtgST03jIxeA1Al8K5Qt7nAyyMLKjFZzI0pgi_qRf3kKo?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 15<br>N: -1.5243137<br>E: 37.2666034<br>Altitude_m: <br>DateTime: 11\/16\/2021 14:52:40<br>FileName: IMG-20211116-WA0041.jpg", "IndexNo": "15.0", "N": "-1.5243137", "E": "37.2666034", "Altitude_m": "", "DateTime": "11\/16\/2021 14:52:40", "FileName": "IMG-20211116-WA0041.jpg", "gx_media_links": "https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/pf7bc7trlmjqcj5isae3s2ci3o\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZOOc6HJD3ujCEc1QoDuTtz-dT6m5p0LUwNAikB8vkJTDgXDryq5rBpC9Epm2i9z3CFlOnhJhpMFjmpxEcLkuuc3ikIdyhV1LGviq5O2tBZjaUUybYwr83CmOfD3YqotW4FmdroE3FJjyDe7XJ8y5CtgST03jIxeA1Al8K5Qt7nAyyMLKjFZzI0pgi_qRf3kKo?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2666034, -1.5243137 ] } },
				{ "type": "Feature", "properties": { "Name": "56.0", "description": "<img src=\"https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/gdfvjdbkumei725p2ck8rs4b8k\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbipGc_xhCvuA_iD0vkfauVeXPmdnMU0lmxFK8Z-yLHuKfTaq63JQmbh4PBfrJw55WmFXYSDmBmZEX68AfCJ4rwxToYcyCkgpk5A_HluOqmcmhVk3wJthNxhLeOy1CSM7p_V_Vl6x5GLV2uqu8HcKLOI8YJsVepxMuHLo1sOLUOrlV9lWDXd9M0R41BG_do2q89?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 32<br>N: -1.5306883<br>E: 37.2652717<br>Altitude_m: 1,619.3<br>DateTime: 11\/16\/2016 15:03:56<br>FileName: IMG-20211116-WA0042.jpg", "IndexNo": "32.0", "N": "-1.5306883", "E": "37.2652717", "Altitude_m": "1619.3", "DateTime": "11\/16\/2016 15:03:56", "FileName": "IMG-20211116-WA0042.jpg", "gx_media_links": "https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/gdfvjdbkumei725p2ck8rs4b8k\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbipGc_xhCvuA_iD0vkfauVeXPmdnMU0lmxFK8Z-yLHuKfTaq63JQmbh4PBfrJw55WmFXYSDmBmZEX68AfCJ4rwxToYcyCkgpk5A_HluOqmcmhVk3wJthNxhLeOy1CSM7p_V_Vl6x5GLV2uqu8HcKLOI8YJsVepxMuHLo1sOLUOrlV9lWDXd9M0R41BG_do2q89?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2652717, -1.5306883 ] } },
				{ "type": "Feature", "properties": { "Name": "57.0", "description": "<img src=\"https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/qqfv6jefhp10doe1gi6q23mqgg\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vatLGHk7WK7_RGj0T9um9uwFtlkPnnNTsk7-fc-GhU2AsDM6AMDa35OdbYvRWwdpCTVk6d383M8eG9jJXjwk3YIOn3Itjc0kekYsjsDLEAKU82J9pVqFUIkHuISOvWw3WKM7941LG4Xfo0SaVUSJtQgHbI0QhuekEpuX4qx3obJi11TsNE76Lynk9k6Ti_B1DM?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 24<br>N: -1.5243137<br>E: 37.2666034<br>Altitude_m: <br>DateTime: 11\/16\/2021 14:58:17<br>FileName: IMG-20211116-WA0043.jpg", "IndexNo": "24.0", "N": "-1.5243137", "E": "37.2666034", "Altitude_m": "", "DateTime": "11\/16\/2021 14:58:17", "FileName": "IMG-20211116-WA0043.jpg", "gx_media_links": "https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/qqfv6jefhp10doe1gi6q23mqgg\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vatLGHk7WK7_RGj0T9um9uwFtlkPnnNTsk7-fc-GhU2AsDM6AMDa35OdbYvRWwdpCTVk6d383M8eG9jJXjwk3YIOn3Itjc0kekYsjsDLEAKU82J9pVqFUIkHuISOvWw3WKM7941LG4Xfo0SaVUSJtQgHbI0QhuekEpuX4qx3obJi11TsNE76Lynk9k6Ti_B1DM?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2666034, -1.5243137 ] } },
				{ "type": "Feature", "properties": { "Name": "58.0", "description": "<img src=\"https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/55emltdr0m07n6fks45imv9g50\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYcKCDxHaUDUZurnRxkWzpbe_NEYrWE4lcfTcxk6popQDi2D16FsKqQrno7WOFuERC1mEGSoIuTr5wuR6b01UHCVIfcZruxnF3-xAxnKwWgI6UnxHBRkRP02ZiZ5PnS8AvC6zeVw6jd1zwoDxJCI2_MzHksS_FP0-KH3f2eClf6H-D20eOJaB-yTBlWV_j25APe?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 25<br>N: -1.5239595<br>E: 37.2625556<br>Altitude_m: <br>DateTime: 11\/16\/2021 15:00:09<br>FileName: IMG-20211116-WA0044.jpg", "IndexNo": "25.0", "N": "-1.5239595", "E": "37.2625556", "Altitude_m": "", "DateTime": "11\/16\/2021 15:00:09", "FileName": "IMG-20211116-WA0044.jpg", "gx_media_links": "https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/55emltdr0m07n6fks45imv9g50\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYcKCDxHaUDUZurnRxkWzpbe_NEYrWE4lcfTcxk6popQDi2D16FsKqQrno7WOFuERC1mEGSoIuTr5wuR6b01UHCVIfcZruxnF3-xAxnKwWgI6UnxHBRkRP02ZiZ5PnS8AvC6zeVw6jd1zwoDxJCI2_MzHksS_FP0-KH3f2eClf6H-D20eOJaB-yTBlWV_j25APe?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2625556, -1.5239595 ] } },
				{ "type": "Feature", "properties": { "Name": "59.0", "description": "<img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/oi75fsp87980k1cpnh5c1ak7c8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbYFmWefJFr3UHDGM5lNNs85k39Ij7LHMC9tHH9CGpOcGHZ8lmt28hcEGvtMKD9xkYmzUlXVpl1pEqLHAimnzRYta9qsM8YGdDH3O95JuH4p_aR-5qTlSLvRw0B5nVrsQOuR8nQA6ySRaxy3leeBa-UzvdzMx7O98Znus23rmwK7x4pLRVvyV3GSfgeokjtQ6s?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 29<br>N: -1.5101799<br>E: 37.2567698<br>Altitude_m: <br>DateTime: 12\/06\/2021 13:22:40<br>FileName: IMG-20211206-WA0001.jpg", "IndexNo": "29.0", "N": "-1.5101799", "E": "37.2567698", "Altitude_m": "", "DateTime": "12\/06\/2021 13:22:40", "FileName": "IMG-20211206-WA0001.jpg", "gx_media_links": "https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/oi75fsp87980k1cpnh5c1ak7c8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbYFmWefJFr3UHDGM5lNNs85k39Ij7LHMC9tHH9CGpOcGHZ8lmt28hcEGvtMKD9xkYmzUlXVpl1pEqLHAimnzRYta9qsM8YGdDH3O95JuH4p_aR-5qTlSLvRw0B5nVrsQOuR8nQA6ySRaxy3leeBa-UzvdzMx7O98Znus23rmwK7x4pLRVvyV3GSfgeokjtQ6s?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2567698, -1.5101799 ] } },
				{ "type": "Feature", "properties": { "Name": "60.0", "description": "<img src=\"https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/paqrk5dshlk7ql1f409pap4dn0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZUFNkE2qpfMWTqCApB0afm2fjZpo88sudh02APm8ldzOHheKK8gt2k_s-iRDpr2A18LS19CsfDPyer97dtpAzGCPL8qjbR8XMT1qvJoUW3CSEch-hye1IID-phgAlUFKr4-2DQoxxnX6e-G-jTG119aySO2ytrXHhWgock2FVGD9fKYVaOfCHrWyLPcVEIx6U?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 34<br>N: -1.5239063<br>E: 37.2746833<br>Altitude_m: 1,572.4<br>DateTime: 12\/09\/2091 12:04:24<br><br>FileName: IMG-20211209-WA0000.jpg", "IndexNo": "34.0", "N": "-1.5239063", "E": "37.2746833", "Altitude_m": "1572.4", "DateTime": "12\/09\/2091 12:04:24\n", "FileName": "IMG-20211209-WA0000.jpg", "gx_media_links": "https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/paqrk5dshlk7ql1f409pap4dn0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZUFNkE2qpfMWTqCApB0afm2fjZpo88sudh02APm8ldzOHheKK8gt2k_s-iRDpr2A18LS19CsfDPyer97dtpAzGCPL8qjbR8XMT1qvJoUW3CSEch-hye1IID-phgAlUFKr4-2DQoxxnX6e-G-jTG119aySO2ytrXHhWgock2FVGD9fKYVaOfCHrWyLPcVEIx6U?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2746833, -1.5239063 ] } },
				{ "type": "Feature", "properties": { "Name": "61.0", "description": "<img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/cqb3fq74ohv3lmcth5eb05bhq0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY2a6f7h8VQSKmBMSKClUiebDepuyjuYQ5DelL-_Y8QMmOY1LyvwEA3HwlM23_c2LNMUIbXxzTun9dUD24vZUkWrHUenK5UGHFwe6IrAppoiU7Bxnp2jQWnmz6bX7fHc3bOfhtxdWW4rGQMQHDMcoQOKIcTNJFQ-V08i3JMxk-keuu8UeiK97dSseLpsgLFy6Y?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 38<br>N: -1.4874816<br>E: 37.2640483<br>Altitude_m: 1,383.2<br>DateTime: 12\/13\/2021 13:16:52<br>FileName: IMG-20211213-WA0003.jpg", "IndexNo": "38.0", "N": "-1.4874816", "E": "37.2640483", "Altitude_m": "1383.2", "DateTime": "12\/13\/2021 13:16:52", "FileName": "IMG-20211213-WA0003.jpg", "gx_media_links": "https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/cqb3fq74ohv3lmcth5eb05bhq0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY2a6f7h8VQSKmBMSKClUiebDepuyjuYQ5DelL-_Y8QMmOY1LyvwEA3HwlM23_c2LNMUIbXxzTun9dUD24vZUkWrHUenK5UGHFwe6IrAppoiU7Bxnp2jQWnmz6bX7fHc3bOfhtxdWW4rGQMQHDMcoQOKIcTNJFQ-V08i3JMxk-keuu8UeiK97dSseLpsgLFy6Y?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2640483, -1.4874816 ] } },
				{ "type": "Feature", "properties": { "Name": "62.0", "description": "<img src=\"https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/48nigc393rcj32ot3havucb178\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaICN6GrVbGOC4O6SmkN-1oPCHlM5lQP6RwUGGzwGtHXkp2Wke7Lak6EGhrdJayebunVCg7hiLM2KMWvIVspDtdYhLlWxiVHpiaXt97twA-wALcr05zyimxzypNHZLlRbJsO4bIbO5Hx1ZsTdW94PdvkvLVE0wc6B_3HvnfZDph-mcS-azx7eLmt19622del6w?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 39<br>N: -1.48689<br>E: 37.2634083<br>Altitude_m: 1,390.1<br>DateTime: 12\/13\/2021 13:16:56<br>FileName: IMG-20211213-WA0004.jpg", "IndexNo": "39.0", "N": "-1.48689", "E": "37.2634083", "Altitude_m": "1390.1", "DateTime": "12\/13\/2021 13:16:56", "FileName": "IMG-20211213-WA0004.jpg", "gx_media_links": "https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/48nigc393rcj32ot3havucb178\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaICN6GrVbGOC4O6SmkN-1oPCHlM5lQP6RwUGGzwGtHXkp2Wke7Lak6EGhrdJayebunVCg7hiLM2KMWvIVspDtdYhLlWxiVHpiaXt97twA-wALcr05zyimxzypNHZLlRbJsO4bIbO5Hx1ZsTdW94PdvkvLVE0wc6B_3HvnfZDph-mcS-azx7eLmt19622del6w?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2634083, -1.48689 ] } },
				{ "type": "Feature", "properties": { "Name": "63.0", "description": "<img src=\"https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/arpqo4dfplau48v2bpfo9tqd1s\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vb0AN-SUI3djCq0bABWYCru1sWMMxOHsaXN4TgVn3gcsIumQFObO7GuywONqtXQIf3BqORoHQjFg3HDkN719k_jaE9El3rYpOYVIU9ww9fPSLStjWXPlRr9bMB_qLuiiwVU432zsD421F0olswb50C87pALJHCBRP8njSO5NhN63bJ6DiBbLor3gai5XB8Kq7U?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 47<br>N: -1.45318<br>E: 37.250083<br>Altitude_m: 1,728.1<br>DateTime: 12\/13\/2021 13:42:47<br>FileName: IMG-20211213-WA0005.jpg", "IndexNo": "47.0", "N": "-1.45318", "E": "37.250083", "Altitude_m": "1728.1", "DateTime": "12\/13\/2021 13:42:47", "FileName": "IMG-20211213-WA0005.jpg", "gx_media_links": "https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/arpqo4dfplau48v2bpfo9tqd1s\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vb0AN-SUI3djCq0bABWYCru1sWMMxOHsaXN4TgVn3gcsIumQFObO7GuywONqtXQIf3BqORoHQjFg3HDkN719k_jaE9El3rYpOYVIU9ww9fPSLStjWXPlRr9bMB_qLuiiwVU432zsD421F0olswb50C87pALJHCBRP8njSO5NhN63bJ6DiBbLor3gai5XB8Kq7U?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.250083, -1.45318 ] } },
				{ "type": "Feature", "properties": { "Name": "64.0", "description": "<img src=\"https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/4nbcgmtqbj9567gjqvqaqgtmh8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaBWzTwMPJ2ngTFBvdiPkcYqCGoCslDFZjWbta3vQvbOIY3U0a31JO77Rb7wF0pIfDZFhE0s8Plzt_V5MCSBRfNBSxurtqxRgs3A9BDPxGXvVaI8Yr8mBDKFgcw-Bm9ulUFaEjNY0g2rbpXRSerfGZQ7ghXgNc0ZgMhrqIFLYbTGFzuF3cjhJkD3hpuhmO84RU?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 40<br>N: -1.4986322<br>E: 37.261317<br>Altitude_m: <br>DateTime: 12\/13\/2021 13:18:55<br>FileName: IMG-20211213-WA0006.jpg", "IndexNo": "40.0", "N": "-1.4986322", "E": "37.261317", "Altitude_m": "", "DateTime": "12\/13\/2021 13:18:55", "FileName": "IMG-20211213-WA0006.jpg", "gx_media_links": "https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/4nbcgmtqbj9567gjqvqaqgtmh8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaBWzTwMPJ2ngTFBvdiPkcYqCGoCslDFZjWbta3vQvbOIY3U0a31JO77Rb7wF0pIfDZFhE0s8Plzt_V5MCSBRfNBSxurtqxRgs3A9BDPxGXvVaI8Yr8mBDKFgcw-Bm9ulUFaEjNY0g2rbpXRSerfGZQ7ghXgNc0ZgMhrqIFLYbTGFzuF3cjhJkD3hpuhmO84RU?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.261317, -1.4986322 ] } },
				{ "type": "Feature", "properties": { "Name": "65.0", "description": "<img src=\"https:\/\/doc-0g-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/5gck67h7ld1vdnpnu20f2t0lmo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYdfPKUyEZ5r_rpK7Hi-YUEC9h2ice0POCMjeLEa1zuA-TCDz2jS3F447JsPVMeuq1PYcqgHNBdskDonqUFc6hYCIXdNJsEBbUtHf4f88J_o1bN4mlcB5w8d01EFNsmwJqmWYE_xVVPzswfQfTfyoiiAcvC8DyikQA2PsIszfvxvUt2Z9NXy8lwJ0HQndnQpag?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 43<br>N: -1.454123<br>E: 37.2491616<br>Altitude_m: 1,681.1<br>DateTime: 12\/13\/2021 13:38:08<br>FileName: IMG-20211213-WA0007.jpg", "IndexNo": "43.0", "N": "-1.454123", "E": "37.2491616", "Altitude_m": "1681.1", "DateTime": "12\/13\/2021 13:38:08", "FileName": "IMG-20211213-WA0007.jpg", "gx_media_links": "https:\/\/doc-0g-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/5gck67h7ld1vdnpnu20f2t0lmo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYdfPKUyEZ5r_rpK7Hi-YUEC9h2ice0POCMjeLEa1zuA-TCDz2jS3F447JsPVMeuq1PYcqgHNBdskDonqUFc6hYCIXdNJsEBbUtHf4f88J_o1bN4mlcB5w8d01EFNsmwJqmWYE_xVVPzswfQfTfyoiiAcvC8DyikQA2PsIszfvxvUt2Z9NXy8lwJ0HQndnQpag?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2491616, -1.454123 ] } },
				{ "type": "Feature", "properties": { "Name": "66.0", "description": "<img src=\"https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/4bpvo27a1afai9i7lado5c5id0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaW7ENB2yZXZV0CB8yqeuNRyPu7offmQLNiqp-o064kQlQ93gIjs_Uk22MzyQWOGtWKzeU00ahLfBJ1bK-hp75wfsMIPfDs4yUoNc3p73edxb9NiBi3-fp4_Wkza03IaiQjB2RmDWllqIexVZ38NRtir7KUU53H8MpQNALF4JE48nYFHuLW-dSHXdZQoMPZYX4?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 48<br>N: -1.4554042<br>E: 37.2502657<br>Altitude_m: 1,683.2<br>DateTime: 12\/13\/2021 13:48:42<br><br>FileName: IMG-20211213-WA0008.jpg", "IndexNo": "48.0", "N": "-1.4554042", "E": "37.2502657", "Altitude_m": "1683.2", "DateTime": "12\/13\/2021 13:48:42\n", "FileName": "IMG-20211213-WA0008.jpg", "gx_media_links": "https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/4bpvo27a1afai9i7lado5c5id0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaW7ENB2yZXZV0CB8yqeuNRyPu7offmQLNiqp-o064kQlQ93gIjs_Uk22MzyQWOGtWKzeU00ahLfBJ1bK-hp75wfsMIPfDs4yUoNc3p73edxb9NiBi3-fp4_Wkza03IaiQjB2RmDWllqIexVZ38NRtir7KUU53H8MpQNALF4JE48nYFHuLW-dSHXdZQoMPZYX4?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2502657, -1.4554042 ] } },
				{ "type": "Feature", "properties": { "Name": "67.0", "description": "<img src=\"https:\/\/doc-0g-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/lfcimqkg7itj7qnags9ka7ocbo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYcF5OJcE8sea8hnxbsKsv_fr7wSEQ6_a2foTQpROoM0ZxEMYqR-Q9NfAJigPqRizqpq58fQ96AgouHqeW4wWGa3DfS0lWbYwlhzkMZJ2Nqtu4vYSbvEmQHragmALVR9QpurgRmPjcQ9y6ZyoRzrfhoNsvWYI4Fs2hMt1YcRnGiuHocTFb9x_Wswgh5y1PV2yQ?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 46<br>N: -1.45318<br>E: 37.250083<br>Altitude_m: 1,728.1<br>DateTime: 12\/13\/2021 13:42:42<br>FileName: IMG-20211213-WA0011.jpg", "IndexNo": "46.0", "N": "-1.45318", "E": "37.250083", "Altitude_m": "1728.1", "DateTime": "12\/13\/2021 13:42:42", "FileName": "IMG-20211213-WA0011.jpg", "gx_media_links": "https:\/\/doc-0g-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/lfcimqkg7itj7qnags9ka7ocbo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYcF5OJcE8sea8hnxbsKsv_fr7wSEQ6_a2foTQpROoM0ZxEMYqR-Q9NfAJigPqRizqpq58fQ96AgouHqeW4wWGa3DfS0lWbYwlhzkMZJ2Nqtu4vYSbvEmQHragmALVR9QpurgRmPjcQ9y6ZyoRzrfhoNsvWYI4Fs2hMt1YcRnGiuHocTFb9x_Wswgh5y1PV2yQ?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.250083, -1.45318 ] } },
				{ "type": "Feature", "properties": { "Name": "68.0", "description": "<img src=\"https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/l9u0ap0q4ac3jccv05ivv4gp1g\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaFafKYLaW-LPYDOtR5iXmOybLB3yKvD46n6_LaBfJv4v-ifOYcG4zROIRGFmsDqJ36GbV-tErE17FCwOXzi8YFWZrloXsXM-KyXKbMtL4kpXpWf2YdlsRsX2FjiwFzrWu5_r7op3afNyAh4HCoan1HgenJfHIKse2DJhcTfSD295zKiizfnlXOaUO57y88VP8?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 52<br>N: -1.5174183<br>E: 37.2643<br>Altitude_m: 1,626.9<br>DateTime: 12\/13\/2021 14:15:52<br>FileName: IMG-20211213-WA0013.jpg", "IndexNo": "52.0", "N": "-1.5174183", "E": "37.2643", "Altitude_m": "1626.9", "DateTime": "12\/13\/2021 14:15:52", "FileName": "IMG-20211213-WA0013.jpg", "gx_media_links": "https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/l9u0ap0q4ac3jccv05ivv4gp1g\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaFafKYLaW-LPYDOtR5iXmOybLB3yKvD46n6_LaBfJv4v-ifOYcG4zROIRGFmsDqJ36GbV-tErE17FCwOXzi8YFWZrloXsXM-KyXKbMtL4kpXpWf2YdlsRsX2FjiwFzrWu5_r7op3afNyAh4HCoan1HgenJfHIKse2DJhcTfSD295zKiizfnlXOaUO57y88VP8?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2643, -1.5174183 ] } },
				{ "type": "Feature", "properties": { "Name": "69.0", "description": "<img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/cmmaht93omjedcp00k9lqeq5l0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYYvCasJq74_xw9yzdRgql_SddZIx50IGcPDma8QjoWyX53ctWfu3aVCDTcS8k3_-t-6-orJYnyfUpmQ-nNmBXJVmlx_P9DkiwTk-86O6DAmOznvxaT7Dsj3odewXi3NtLFSY-y2HQePT78AqbgySRc0Lm2HtJ3mqRL_vUcoE1TsyTdp0be-l1JVzSNLvQsFHw?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 53<br>N: -1.5181383<br>E: 37.2651916<br>Altitude_m: 1,621.7<br>DateTime: 12\/13\/2021 14:18:23<br>FileName: IMG-20211213-WA0014.jpg, IMG-20211213-WA0015.jpg<br><br><img src=\"https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/r3koj5ja6gj069dftcov8kv678\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZrKLZHv_pPuw46QYgOlLbiTECkY-L_x4r06JIhKuuFZjnWgspvUenuVdJlWvBIfxvIrvB-FwRCNbTPFJZvPupz2zw0w5l3hDQCK_00EhaaO3qWJzchOjyoJmKQUO6PF1MnpoZz0MAeYN8CdLUGvnj4dNQ4xta1mi_fbS1bNvIleG9ZXPWsSt8tchACe8setGY?session=0&fife\" height=\"200\" width=\"auto\" \/>", "IndexNo": "53.0", "N": "-1.5181383", "E": "37.2651916", "Altitude_m": "1621.7", "DateTime": "12\/13\/2021 14:18:23", "FileName": "IMG-20211213-WA0014.jpg, IMG-20211213-WA0015.jpg", "gx_media_links": "https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/cmmaht93omjedcp00k9lqeq5l0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYYvCasJq74_xw9yzdRgql_SddZIx50IGcPDma8QjoWyX53ctWfu3aVCDTcS8k3_-t-6-orJYnyfUpmQ-nNmBXJVmlx_P9DkiwTk-86O6DAmOznvxaT7Dsj3odewXi3NtLFSY-y2HQePT78AqbgySRc0Lm2HtJ3mqRL_vUcoE1TsyTdp0be-l1JVzSNLvQsFHw?session=0&fife https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/r3koj5ja6gj069dftcov8kv678\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZrKLZHv_pPuw46QYgOlLbiTECkY-L_x4r06JIhKuuFZjnWgspvUenuVdJlWvBIfxvIrvB-FwRCNbTPFJZvPupz2zw0w5l3hDQCK_00EhaaO3qWJzchOjyoJmKQUO6PF1MnpoZz0MAeYN8CdLUGvnj4dNQ4xta1mi_fbS1bNvIleG9ZXPWsSt8tchACe8setGY?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2651916, -1.5181383 ] } },
				{ "type": "Feature", "properties": { "Name": "70.0", "description": "<img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/qnhuakmv7197ndeme7bpsck7gk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY18-yFO7_SjeX-39RB1a5RasAlQz65_paIpPefRD_QbT6B12XaYbX6F49by5wIaMK7gMNKCdSnFkwipg3Fz5qMakH_h3tF6JrCX8v7OvB70CIfleWLUZ8PzXjSKSq6P4lr6WJYUzHmo0xJIXW3Ew5NAVQsRXDXwoCaQSOzmwMIOx2Z8gENrBDt2kZ6dQo-7-0?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 56<br>N: -1.5175624<br>E: 37.2671244<br>Altitude_m: 1,610.9<br>DateTime: 12\/13\/2021 14:23:28<br>FileName: IMG-20211213-WA0016.jpg", "IndexNo": "56.0", "N": "-1.5175624", "E": "37.2671244", "Altitude_m": "1610.9", "DateTime": "12\/13\/2021 14:23:28", "FileName": "IMG-20211213-WA0016.jpg", "gx_media_links": "https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/qnhuakmv7197ndeme7bpsck7gk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY18-yFO7_SjeX-39RB1a5RasAlQz65_paIpPefRD_QbT6B12XaYbX6F49by5wIaMK7gMNKCdSnFkwipg3Fz5qMakH_h3tF6JrCX8v7OvB70CIfleWLUZ8PzXjSKSq6P4lr6WJYUzHmo0xJIXW3Ew5NAVQsRXDXwoCaQSOzmwMIOx2Z8gENrBDt2kZ6dQo-7-0?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2671244, -1.5175624 ] } },
				{ "type": "Feature", "properties": { "Name": "71.0", "description": "<img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/chp3aj36kdsn22fci72pv8ub9g\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZDqPcMeNbGR2J8ZGz36OjrMBBumV1RW1XO7lAiAwusMzXcAJ6uXOwqcqYrvg25ZiwamX6M2UtR0wU-jxAu-ZldN-2mDKr3cYKBTvOoAXPhGHFdKLZfDwMBIngb4pS1rSAVkMutUqh8F7aULeffAjLrpqhXVan96pAuRGcE1js1zu_IZTk3UBzA2ByLjugzam-8?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 14<br>N: -1.5214283<br>E: 37.266793<br>Altitude_m: 1639<br>DateTime: 01\/05\/2022 17:21:03<br>FileName: IMG-20220105-WA0000.jpg", "IndexNo": "14.0", "N": "-1.5214283", "E": "37.266793", "Altitude_m": "1639.0", "DateTime": "01\/05\/2022 17:21:03", "FileName": "IMG-20220105-WA0000.jpg", "gx_media_links": "https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/chp3aj36kdsn22fci72pv8ub9g\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZDqPcMeNbGR2J8ZGz36OjrMBBumV1RW1XO7lAiAwusMzXcAJ6uXOwqcqYrvg25ZiwamX6M2UtR0wU-jxAu-ZldN-2mDKr3cYKBTvOoAXPhGHFdKLZfDwMBIngb4pS1rSAVkMutUqh8F7aULeffAjLrpqhXVan96pAuRGcE1js1zu_IZTk3UBzA2ByLjugzam-8?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.266793, -1.5214283 ] } },
				{ "type": "Feature", "properties": { "Name": "72.0", "description": "<img src=\"https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/guguusb9mn4hum38vr9nb4luo4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZYptwQ3RYrnAL9SFWhDGhG_wFBHB_BXnazp2quvm5bpGg2IfESTnYLz2vIhr-F7bXhM-pnJ0-CMbpKfaGa17u48YDaZWrdZISYixyGzedPLa7qTHw3xGJRlWyWRh3MF8AnD75edxiqTlkxl9W8kkN1Z-Cj39UXaoFwRQ9ALiQ9CuzRuSXq2-XSRjnF_WdAhsk7?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 2<br>N: -1.45969<br>E: 37.4400516<br>Altitude_m: 1283<br>DateTime: 01\/05\/2022 15:45:35<br>FileName: IMG-20220105-WA0006.jpg", "IndexNo": "2.0", "N": "-1.45969", "E": "37.4400516", "Altitude_m": "1283.0", "DateTime": "01\/05\/2022 15:45:35", "FileName": "IMG-20220105-WA0006.jpg", "gx_media_links": "https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/guguusb9mn4hum38vr9nb4luo4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZYptwQ3RYrnAL9SFWhDGhG_wFBHB_BXnazp2quvm5bpGg2IfESTnYLz2vIhr-F7bXhM-pnJ0-CMbpKfaGa17u48YDaZWrdZISYixyGzedPLa7qTHw3xGJRlWyWRh3MF8AnD75edxiqTlkxl9W8kkN1Z-Cj39UXaoFwRQ9ALiQ9CuzRuSXq2-XSRjnF_WdAhsk7?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.4400516, -1.45969 ] } },
				{ "type": "Feature", "properties": { "Name": "73.0", "description": "<img src=\"https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/sqv042g6730cc9gijb2l72akps\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaRIwESqnUultholeExGXlXseNZTfPZOy5V0Quy_cMJJu92uHWowQReulH3uVDKTDLGW99OEyrdACiHfF3vfIXa7aG06q7kAiRwT8m-BlcdDfYipbEubz5a9lpgetKusIoaMgCeKqv_fpAPTxf9GOpwawj_BRg5Rkh_m6mD8a3lfYzP9CV9_xS-Ro8zlpuNOQVy?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 4<br>N: -1.459236<br>E: 37.4400349<br>Altitude_m: 1,283.4<br>DateTime: 01\/05\/2022 15:46:04<br>FileName: IMG-20220105-WA0008.jpg", "IndexNo": "4.0", "N": "-1.459236", "E": "37.4400349", "Altitude_m": "1283.4", "DateTime": "01\/05\/2022 15:46:04", "FileName": "IMG-20220105-WA0008.jpg", "gx_media_links": "https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/sqv042g6730cc9gijb2l72akps\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaRIwESqnUultholeExGXlXseNZTfPZOy5V0Quy_cMJJu92uHWowQReulH3uVDKTDLGW99OEyrdACiHfF3vfIXa7aG06q7kAiRwT8m-BlcdDfYipbEubz5a9lpgetKusIoaMgCeKqv_fpAPTxf9GOpwawj_BRg5Rkh_m6mD8a3lfYzP9CV9_xS-Ro8zlpuNOQVy?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.4400349, -1.459236 ] } },
				{ "type": "Feature", "properties": { "Name": "74.0", "description": "<img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/0ejq1bp9d1jki6tv6tpkgdbsdk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZJw2oMYOsA2iokjadJ9D_bMFXN2lXXm-YpfOOIeFUIhZ_bcggLslswkqfKY1mgVW-R6hJfElmFEWxeFmuM9hL4WZARGPYdcgcND57lasx0QTAI92-wVcoXnXCrSWviLaJc4jca_V3AvJ166ellwUTzfNNLTt9jAmREMrRZSHLpoFr2dqG-o_AD5ulS5BfN1jVA?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 8<br>N: -1.4616316<br>E: 37.4388583<br>Altitude_m: 1,283.4<br>DateTime: 01\/05\/2022 15:47:55<br>FileName: IMG-20220105-WA0009.jpg", "IndexNo": "8.0", "N": "-1.4616316", "E": "37.4388583", "Altitude_m": "1283.4", "DateTime": "01\/05\/2022 15:47:55", "FileName": "IMG-20220105-WA0009.jpg", "gx_media_links": "https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/0ejq1bp9d1jki6tv6tpkgdbsdk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZJw2oMYOsA2iokjadJ9D_bMFXN2lXXm-YpfOOIeFUIhZ_bcggLslswkqfKY1mgVW-R6hJfElmFEWxeFmuM9hL4WZARGPYdcgcND57lasx0QTAI92-wVcoXnXCrSWviLaJc4jca_V3AvJ166ellwUTzfNNLTt9jAmREMrRZSHLpoFr2dqG-o_AD5ulS5BfN1jVA?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.4388583, -1.4616316 ] } },
				{ "type": "Feature", "properties": { "Name": "75.0", "description": "<img src=\"https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/itqsj174k1mv2f987d0p5pt9fk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vabdeAF7VrBaT_H-d1BGKiPY3h2t-MHjMfqv7wwd4faOUNFdw4NHDuJughzBDpwp7WpZ4Dq3_-Q0Vq3RwK6ugr6dhlmUZ37qi4QXi7WJoLR2HdAftEmDGavfG1-utQcBqZNbyYXIozf0j4CQ9FSiswzSOSNdxw6yjqDE3pfuRBXyuyXc2gyJABeG-zSC9Dujf_h?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 9<br>N: -1.461169<br>E: 37.4357766<br>Altitude_m: 1,283.4<br>DateTime: 01\/05\/2022 15:50:35<br>FileName: IMG-20220105-WA0010.jpg", "IndexNo": "9.0", "N": "-1.461169", "E": "37.4357766", "Altitude_m": "1283.4", "DateTime": "01\/05\/2022 15:50:35", "FileName": "IMG-20220105-WA0010.jpg", "gx_media_links": "https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/itqsj174k1mv2f987d0p5pt9fk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vabdeAF7VrBaT_H-d1BGKiPY3h2t-MHjMfqv7wwd4faOUNFdw4NHDuJughzBDpwp7WpZ4Dq3_-Q0Vq3RwK6ugr6dhlmUZ37qi4QXi7WJoLR2HdAftEmDGavfG1-utQcBqZNbyYXIozf0j4CQ9FSiswzSOSNdxw6yjqDE3pfuRBXyuyXc2gyJABeG-zSC9Dujf_h?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.4357766, -1.461169 ] } },
				{ "type": "Feature", "properties": { "Name": "76.0", "description": "<img src=\"https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/89585ou1q26jd9p6m8a7d7e7po\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYXciByVb3cKiq_9JN85agpUjtP5AG4PiD0pjdniT9v9k0_WggRVTNiBB5v0JZOYMAc3-oJGLPp0A8ARz5RYH77EBLC1M1XfBZQ0nXxbV7XHuH4YpoaTRjSGM_uaoEyX7MJCt5-kJJKez7mRr3hRpZHv9l8lLU3xpA5ZvQ9VL6Vu1tMH3QlCPj7YFAaLwSla9JU?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 11<br>N: -1.5216667<br>E: 37.2669933<br>Altitude_m: 1,638.6<br>DateTime: 01\/05\/2022 17:19:06<br>FileName: IMG-20220105-WA0011.jpg", "IndexNo": "11.0", "N": "-1.5216667", "E": "37.2669933", "Altitude_m": "1638.6", "DateTime": "01\/05\/2022 17:19:06", "FileName": "IMG-20220105-WA0011.jpg", "gx_media_links": "https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/89585ou1q26jd9p6m8a7d7e7po\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYXciByVb3cKiq_9JN85agpUjtP5AG4PiD0pjdniT9v9k0_WggRVTNiBB5v0JZOYMAc3-oJGLPp0A8ARz5RYH77EBLC1M1XfBZQ0nXxbV7XHuH4YpoaTRjSGM_uaoEyX7MJCt5-kJJKez7mRr3hRpZHv9l8lLU3xpA5ZvQ9VL6Vu1tMH3QlCPj7YFAaLwSla9JU?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2669933, -1.5216667 ] } },
				{ "type": "Feature", "properties": { "Name": "77.0", "description": "<img src=\"https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/f1iivpaanaj395uht33qkg1pgo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaEB29sO2VSL2dXmdkoon6vZ7Ne8ICMOsGo1LvXZEwPx5LdR5WDPGeRnmWVaVb6YpSaP7jH8NF3ns3lcmE9gg8cj0gQg26Dev5y6fwA1posPKakXOypQ-xzgfY30WI4QJouW2ezMOdyj78UUG1iFcJZAZqZbaUAzRuHfWMLfPE_w8IdErPevSpASP7WpUvMmEgh?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 9<br>N: -1.4612133<br>E: 37.4357533<br>Altitude_m: 1,283.5<br>DateTime: 01\/05\/2022 15:50:42<br>FileName: IMG-20220105-WA0012.jpg", "IndexNo": "9.0", "N": "-1.4612133", "E": "37.4357533", "Altitude_m": "1283.5", "DateTime": "01\/05\/2022 15:50:42", "FileName": "IMG-20220105-WA0012.jpg", "gx_media_links": "https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/f1iivpaanaj395uht33qkg1pgo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaEB29sO2VSL2dXmdkoon6vZ7Ne8ICMOsGo1LvXZEwPx5LdR5WDPGeRnmWVaVb6YpSaP7jH8NF3ns3lcmE9gg8cj0gQg26Dev5y6fwA1posPKakXOypQ-xzgfY30WI4QJouW2ezMOdyj78UUG1iFcJZAZqZbaUAzRuHfWMLfPE_w8IdErPevSpASP7WpUvMmEgh?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.4357533, -1.4612133 ] } },
				{ "type": "Feature", "properties": { "Name": "78.0", "description": "<img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/rqedtnfm9kkltdv1af4ad2h278\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaVI9gdUCqFMOeyX2BbQZ9SEdyyZGqqG1pdQ0ucVT_Qyd68W-qA7s2r3S_WQeYa9ANAc1gzYybmzcWJkTl-X-Z0zDbFpSSwkffPM5NOgMmYq1iE-s14BiGvHHM-lc8SKy8T-k5AzPvrvCW9Ym49ZTUP988VfBZN1NtLsYMIo0SUDhN-bfDEtg-jxE-AtKOpMT5B?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 11<br>N: -1.5216667<br>E: 37.2669933<br>Altitude_m: 1,638.6<br>DateTime: 01\/05\/2022 17:19:08<br>FileName: IMG-20220105-WA0013.jpg", "IndexNo": "11.0", "N": "-1.5216667", "E": "37.2669933", "Altitude_m": "1638.6", "DateTime": "01\/05\/2022 17:19:08", "FileName": "IMG-20220105-WA0013.jpg", "gx_media_links": "https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/rqedtnfm9kkltdv1af4ad2h278\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaVI9gdUCqFMOeyX2BbQZ9SEdyyZGqqG1pdQ0ucVT_Qyd68W-qA7s2r3S_WQeYa9ANAc1gzYybmzcWJkTl-X-Z0zDbFpSSwkffPM5NOgMmYq1iE-s14BiGvHHM-lc8SKy8T-k5AzPvrvCW9Ym49ZTUP988VfBZN1NtLsYMIo0SUDhN-bfDEtg-jxE-AtKOpMT5B?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.2669933, -1.5216667 ] } },
				{ "type": "Feature", "properties": { "Name": "79.0", "description": "<img src=\"https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/ms0nmonmd9c851lso1aofpphh0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbfo4xsykWbrIQ2MJyfzVLSIhMMk4Ha1HFQDkgjnWYvAoteMgOS4IrVvFFQf7JjKg7iDpECV8vfDYtQOi_ubCmJQa5wclzh7obK6sLtsMRLIDI3MT7Hq73O3SDT71YWWZ_udmW_HJRW9W4VCuocW9okcIZhY7VqCDwAD2CWRMlFE0l4xx8MLfoth-2EhBRodhs?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 58<br>N: -1.4392832<br>E: 36.9815183<br>Altitude_m: <br>DateTime: 01\/11\/2022 10:52:14<br>FileName: IMG-20220111-WA0003.jpg, IMG-20220111-WA0006.jpg, IMG-20220111-WA0028.jpg, IMG-20220111-WA0029.jpg<br><br><img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/vt6io025qn7ham4eo08gr9a3bo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY5eE3B7MsGYGXKNWc81HmMWofw0wyhhWIHJnutOOdOQSn4G-3nCjpb1j31NdTfO8M3WpNUBqETSUqKDUcKAaz9qO_Mpt2Y7NK3Fa61xKbC15Dq9VNvYfu1euulRye2Q2cRzfWrr3vCZwSnu5l_wB53dVKwkDrYiyG9mqGYTkNnZFiSlDBgwWD-bZd9fhhhktE?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/0ocjqk13ip478apeoj4tlopcf0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vb1GqdURq_4Gp0VeLvMtlgoG6p__r3UP_jIeTKspyjY7ZapakqwXlSkbStmDjFeP99U54c5UCshn-rEHSk1p3agxpXY0QmthP0b1hjnRUFuxXdCZY9L_LakLhLbE2Gcneof4c9bD6QO_s3EqDIa_3hsV9WUDwjH_NxIMrIjChxKEcFhjyFtTXMi8bxXf_H3cPIj?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/r0d9tr1u0t3npua9qs1ubcvf68\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbVJZz66IVcW4wK9kOgO6aXhFN1XH_e6nfZJIFjPuBZdKNtACfmf32kGBr8Wza_9IBVRY6yugM_s8tJZXZWcgXaAM1YhPJhiDd6PScKNulojBrPHnJfzfiVj_aJXgEPaWvd6m9P9yWsNlJw6kZm73R6-DiJJZw3wnS8dTWVMFoAtjyjKwk8Szv3J8_2-MnVPqKs?session=0&fife\" height=\"200\" width=\"auto\" \/>", "IndexNo": "58.0", "N": "-1.4392832", "E": "36.9815183", "Altitude_m": "", "DateTime": "01\/11\/2022 10:52:14", "FileName": "IMG-20220111-WA0003.jpg, IMG-20220111-WA0006.jpg, IMG-20220111-WA0028.jpg, IMG-20220111-WA0029.jpg", "gx_media_links": "https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/ms0nmonmd9c851lso1aofpphh0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbfo4xsykWbrIQ2MJyfzVLSIhMMk4Ha1HFQDkgjnWYvAoteMgOS4IrVvFFQf7JjKg7iDpECV8vfDYtQOi_ubCmJQa5wclzh7obK6sLtsMRLIDI3MT7Hq73O3SDT71YWWZ_udmW_HJRW9W4VCuocW9okcIZhY7VqCDwAD2CWRMlFE0l4xx8MLfoth-2EhBRodhs?session=0&fife https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/vt6io025qn7ham4eo08gr9a3bo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY5eE3B7MsGYGXKNWc81HmMWofw0wyhhWIHJnutOOdOQSn4G-3nCjpb1j31NdTfO8M3WpNUBqETSUqKDUcKAaz9qO_Mpt2Y7NK3Fa61xKbC15Dq9VNvYfu1euulRye2Q2cRzfWrr3vCZwSnu5l_wB53dVKwkDrYiyG9mqGYTkNnZFiSlDBgwWD-bZd9fhhhktE?session=0&fife https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/0ocjqk13ip478apeoj4tlopcf0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vb1GqdURq_4Gp0VeLvMtlgoG6p__r3UP_jIeTKspyjY7ZapakqwXlSkbStmDjFeP99U54c5UCshn-rEHSk1p3agxpXY0QmthP0b1hjnRUFuxXdCZY9L_LakLhLbE2Gcneof4c9bD6QO_s3EqDIa_3hsV9WUDwjH_NxIMrIjChxKEcFhjyFtTXMi8bxXf_H3cPIj?session=0&fife https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/r0d9tr1u0t3npua9qs1ubcvf68\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbVJZz66IVcW4wK9kOgO6aXhFN1XH_e6nfZJIFjPuBZdKNtACfmf32kGBr8Wza_9IBVRY6yugM_s8tJZXZWcgXaAM1YhPJhiDd6PScKNulojBrPHnJfzfiVj_aJXgEPaWvd6m9P9yWsNlJw6kZm73R6-DiJJZw3wnS8dTWVMFoAtjyjKwk8Szv3J8_2-MnVPqKs?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9815183, -1.4392832 ] } },
				{ "type": "Feature", "properties": { "Name": "80.0", "description": "<img src=\"https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/vaupvqn14p0n74prrvqo7a4p0s\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbyqEDmtjaO--GXMNYbs8g-eCi7cLcPxR8VzJmeuo2xjXgwtUNrXnT2ZFYi8nrBxL9mxbr1vtVUUpgW9GdRQo_zs-c7oPIagftr-f69iqbF6OXDx27T8CGVIPmIlORWr3KF9PHbMKPA1ZbCWFBLnamWRTv1gfnuZ_1VUD0bwvYU1bngAfYfCcpjffwfdZ1bAfs?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 60<br>N: -1.4394688<br>E: 36.987576<br>Altitude_m: <br>DateTime: 01\/11\/2022 10:59:54<br>FileName: IMG-20220111-WA0004.jpg, IMG-20220111-WA0005.jpg<br><br><img src=\"https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/aa8u47nsqr85t0urikbc2t5pss\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbz-Bamhzuo4e4BlxWhrjdA6yCuzeoJY5NuecKZK2Y1AWRVTkk20FVQohwctpyqfiKjn3rb_w0olPZy8aJ10eQLINo_LUH5xXfi1tO_XE_62SjrpLBlG1dMpbLvLuICwxni7exeudnKGbEhaNEcJ-Er_zdH-A0T1s18SMeLnJaZdL43h1_PWhl-xwoBXUIYwmg?session=0&fife\" height=\"200\" width=\"auto\" \/>", "IndexNo": "60.0", "N": "-1.4394688", "E": "36.987576", "Altitude_m": "", "DateTime": "01\/11\/2022 10:59:54", "FileName": "IMG-20220111-WA0004.jpg, IMG-20220111-WA0005.jpg", "gx_media_links": "https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/vaupvqn14p0n74prrvqo7a4p0s\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbyqEDmtjaO--GXMNYbs8g-eCi7cLcPxR8VzJmeuo2xjXgwtUNrXnT2ZFYi8nrBxL9mxbr1vtVUUpgW9GdRQo_zs-c7oPIagftr-f69iqbF6OXDx27T8CGVIPmIlORWr3KF9PHbMKPA1ZbCWFBLnamWRTv1gfnuZ_1VUD0bwvYU1bngAfYfCcpjffwfdZ1bAfs?session=0&fife https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/aa8u47nsqr85t0urikbc2t5pss\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbz-Bamhzuo4e4BlxWhrjdA6yCuzeoJY5NuecKZK2Y1AWRVTkk20FVQohwctpyqfiKjn3rb_w0olPZy8aJ10eQLINo_LUH5xXfi1tO_XE_62SjrpLBlG1dMpbLvLuICwxni7exeudnKGbEhaNEcJ-Er_zdH-A0T1s18SMeLnJaZdL43h1_PWhl-xwoBXUIYwmg?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.987576, -1.4394688 ] } },
				{ "type": "Feature", "properties": { "Name": "82.0", "description": "<img src=\"https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/hq2frqsp8ot1ocqo49a6u8dbf4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_va7Ff2vEo84VD25UY6Yn_DRU1kCZ-LZffwO7aqqCJOmxw3-vr1ITvW20uiJBf_oD7jnxaonrEubJ3QowOSnBaMapaEAL8rjE6RwTCaHJ1FYokWBj5cwrNfvBcYMPzeElI0FI4BEOJcQbmC0-Zh-bXNkydPQ1b8MBekmPEtXpweXsWDdCTK2qf4aBnbB_WvRFXo?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 55<br>N: -1.4392832<br>E: 36.9815183<br>Altitude_m: <br>DateTime: 01\/11\/2022 10:50:42<br>FileName: IMG-20220111-WA0007.jpg, IMG-20220111-WA0008.jpg<br><br><img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/9l9f0frrpav75ugaf7nbupgr0k\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYr-NWQGw5e_NKZ2EYruEbTEyaZw_W0iyiNU3o9KTSFgLkJ1JjhdWI9sOpjTAtNUPbrH9lJqY7YlcVTO1-ewr7usY57Fn0Aq8lMKRWrmU0gWGG1aPz_TkrLQZ3QU54KmjxKb5gfhD3-feFGTm66F3Gl0G2U7ugBN6rvWp-zZQify_f7gyOqylMrm5BOGlKroS4?session=0&fife\" height=\"200\" width=\"auto\" \/>", "IndexNo": "55.0", "N": "-1.4392832", "E": "36.9815183", "Altitude_m": "", "DateTime": "01\/11\/2022 10:50:42", "FileName": "IMG-20220111-WA0007.jpg, IMG-20220111-WA0008.jpg", "gx_media_links": "https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/hq2frqsp8ot1ocqo49a6u8dbf4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_va7Ff2vEo84VD25UY6Yn_DRU1kCZ-LZffwO7aqqCJOmxw3-vr1ITvW20uiJBf_oD7jnxaonrEubJ3QowOSnBaMapaEAL8rjE6RwTCaHJ1FYokWBj5cwrNfvBcYMPzeElI0FI4BEOJcQbmC0-Zh-bXNkydPQ1b8MBekmPEtXpweXsWDdCTK2qf4aBnbB_WvRFXo?session=0&fife https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/9l9f0frrpav75ugaf7nbupgr0k\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYr-NWQGw5e_NKZ2EYruEbTEyaZw_W0iyiNU3o9KTSFgLkJ1JjhdWI9sOpjTAtNUPbrH9lJqY7YlcVTO1-ewr7usY57Fn0Aq8lMKRWrmU0gWGG1aPz_TkrLQZ3QU54KmjxKb5gfhD3-feFGTm66F3Gl0G2U7ugBN6rvWp-zZQify_f7gyOqylMrm5BOGlKroS4?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9815183, -1.4392832 ] } },
				{ "type": "Feature", "properties": { "Name": "83.0", "description": "<img src=\"https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/h5srhu87ot444b0m5eaj81klk4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbW5-quFeMxYcRKSUwfhHGhEqyZWX_nRGVVSbtrZB9lQLIoRrUvIY0BIOm6t6JW4OVkVzKQnTxf4SvzNBRG_eOA1ZZmDlh_rLmMn1rXk4VTiQX9LF3D692RkO4-26iJWCKdfpjeyFPlvHwuyae9HMJcFy3D_cqD3V3ZQJyX_JeMwKp5AgDj9A3JCN40d7ReBTU?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 54<br>N: -1.4377162<br>E: 36.9815256<br>Altitude_m: <br>DateTime: 01\/11\/2022 10:46:43<br>FileName: IMG-20220111-WA0009.jpg", "IndexNo": "54.0", "N": "-1.4377162", "E": "36.9815256", "Altitude_m": "", "DateTime": "01\/11\/2022 10:46:43", "FileName": "IMG-20220111-WA0009.jpg", "gx_media_links": "https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/h5srhu87ot444b0m5eaj81klk4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbW5-quFeMxYcRKSUwfhHGhEqyZWX_nRGVVSbtrZB9lQLIoRrUvIY0BIOm6t6JW4OVkVzKQnTxf4SvzNBRG_eOA1ZZmDlh_rLmMn1rXk4VTiQX9LF3D692RkO4-26iJWCKdfpjeyFPlvHwuyae9HMJcFy3D_cqD3V3ZQJyX_JeMwKp5AgDj9A3JCN40d7ReBTU?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9815256, -1.4377162 ] } },
				{ "type": "Feature", "properties": { "Name": "84.0", "description": "<img src=\"https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/07t3dcfhkuiu2hcu9fdav25bdc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vb23eds5U8k2uEWQABP4jOz-HcU3vUuS_e0GYB6x3JPHn7o536OwMPFehNVrwEHZzasc6sA_s0hF1I5FBeFoLLTrwOeU34XAELQN-fRLEJNsb0Gdf848F_I9lsyBWC7Xj4JqmrfHRkWiclN-8gaVasKSzqWIJ0pmI8i6McAhvBwqaAOCM2CPJlm3GRl52Azkonq?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 44<br>N: -1.4571617<br>E: 36.9721632<br>Altitude_m: <br>DateTime: 01\/11\/2022 10:39:12<br>FileName: IMG-20220111-WA0010.jpg, IMG-20220111-WA0011.jpg, IMG-20220111-WA0020.jpg, IMG-20220111-WA0021.jpg, IMG-20220111-WA0026.jpg, IMG-20220111-WA0023.jpg, IMG-20220111-WA0031.jpg, IMG-20220111-WA0033.jpg, IMG-20220111-WA0035.jpg, IMG-20220111-WA0040.jpg<br><br><img src=\"https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/epgorar14uhq5v5udm14rfgg24\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbdCAwf5RxUQ67-80s1UmeL1N6p5R5p6qz6Be9l2ixikjZhPOjIwPyJda-c9mewx4JbZfy5zOJ-MJiS3QyMgZpCj-OELXn1X5_ezUqaIh0vfLzl_C-uMxkLykqLhfMRz7ApcSO1afz-MgXcqiwhjavDrVP1sf508qQkx9uAQVmtPjq8Kv9VuxKnVC0OuYUNyQQ?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/o4hg7of7sndh8nbambt68nk4cs\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_va11ntLdU007iummCnTLiVHCcJlPB01dTt83zjXqXOwOZcZG3lneHBXklPDy605xFQn-Q_GGeCAoQby0w2J_REkOP6ruftPPiODXfqItT06TqmaI3Z-26CE5XfA52jRlCnDUDRkO1yPb5hr52yv6Ueta_uqRSNIqEVgrVWC1g9WxUMVDrk93YB-Hh6NDOWYP_pj?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/d23970iturps3qpu4q68nqmr2o\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYHNWzX80nScCvc0TjxNfMKVqxTZon51oiLw5n4Ti0KS5Vms4kkTtYXBEV3m9zMr7a0d9Gjk-jlCsc56nxqMHQv9rYffCxRnOlGnAN7irtUeH0LNxMc_P83UOgfAiTPIMoKmX0v_yUhvkgt7j-fyqq8_R4EK4vxMihwHy1zu7uC6EnEN-FEO2Xr_j1120xj7Ss?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/7damalrbg9ho7t2i5jefg5h3is\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZ7V1m2ehvJkWzRVNEVztX1YmlVqa47noSseaGlvYVuGmy-OjbQBFxmBL8pyjFSwhZBoeQk-9DCZDbjCxiiOxPfxhVXujCA8p6HMg6PNZUZKLEQtcDbtI32apoq0Z6Xt4aurWvDBznNHBIwF-n0UV6euSEf_GWxWnMqXNnaj7AHcbyHz9mVTJnC1x2Sf8adIxtI?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/e3o63vdsid1jlhh8hcvs13361s\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYz8bvEvWfaVlSNdqoOhbBRf_J6SQcUBpb4ZYVrLtUNTQCaXzPPtknW8C8PzO0cR240RqfRg8wHQv_iKRjxFaKMrrq5UI0aOpKLBg0ANdICNPCSvklGwNTN4df5ImCZ6GgS0DHqpV6ZUDGeTzEWRFYz0KWb7fTo82SVaonVfaQ2O9Anrt46DAWQlzvx0EGMBuwx?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/818gc3b0e8g9nen85884nm7rss\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbwFIBJEbhYUanu9tjV05UtpHFpkOuLDaEZ7pdbFU_dbqpXhYZrVKB0UtmUlmaubB0cL5KoxPCxzJz3q59_IdBo-wRhgc_ZzZkmlk262ATtWnjt631Titma3r1pPV0PwgduiWG_1FTmIRXK50mbyHyQRzJIgTDuYN24DA8lmfBkICz1ujEoPdljEQGO3NVE_60X?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-0g-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/gk4qncij9qijl26bdejhhah5j0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZsz3dfL9kuW9iDlLwWow4FA7BLzHuyQxYUP6vk-8_GEbSpnYM-lGUADv14MGDgyRK9M5DiXeoS049r0E30V9GqbzFpS04vRAVlLYNokfto4_LMcpoMbPItIT73zucBkho4e1mbZZYVjNLvORckM31gJA0ehmtrh7kGASGTfgu0rgygXs98hL0jsCssQUWqQa0?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/41p90h1oa41s55b68vgq5p2tts\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZdWQtO3TEWsV1PtyTzPQpTA-tZUd85ikWLauaRvDoxlnhLIiyHbuGDmC-d-UV5-hHSYHU4-8dZwPrMEFDOJQx6TDkUc154lgJJVcnvE0_nbgJWfvze19h8NBVhyqkg3j-nG95F-3IED42JtydhoY1Hy0FVee7S1BmRD501NT8rGVPKSvrxPwC59g5sUNuaZVw?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/o8d83srbaimepvbnud1p7d8s7o\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYtND4UlgChk1XLIiQYzOLp0vWhj6QFBy7oBHpzCKJucI7gqkWxfO5kUEY9ETFh9nNfiDirNux8dNbUXMKg0hYoKYnOrgY-l2Nt56wk0LsbrGqr1eCAjpcwy7snAvkION5LaVZcBHDhwtWssEXZbjYwE_lhtyh3UG-GHTmfykFiao0jF9GBnzuEi8YvwM6acyA?session=0&fife\" height=\"200\" width=\"auto\" \/>", "IndexNo": "44.0", "N": "-1.4571617", "E": "36.9721632", "Altitude_m": "", "DateTime": "01\/11\/2022 10:39:12", "FileName": "IMG-20220111-WA0010.jpg, IMG-20220111-WA0011.jpg, IMG-20220111-WA0020.jpg, IMG-20220111-WA0021.jpg, IMG-20220111-WA0026.jpg, IMG-20220111-WA0023.jpg, IMG-20220111-WA0031.jpg, IMG-20220111-WA0033.jpg, IMG-20220111-WA0035.jpg, IMG-20220111-WA0040.jpg", "gx_media_links": "https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/07t3dcfhkuiu2hcu9fdav25bdc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vb23eds5U8k2uEWQABP4jOz-HcU3vUuS_e0GYB6x3JPHn7o536OwMPFehNVrwEHZzasc6sA_s0hF1I5FBeFoLLTrwOeU34XAELQN-fRLEJNsb0Gdf848F_I9lsyBWC7Xj4JqmrfHRkWiclN-8gaVasKSzqWIJ0pmI8i6McAhvBwqaAOCM2CPJlm3GRl52Azkonq?session=0&fife https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/epgorar14uhq5v5udm14rfgg24\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbdCAwf5RxUQ67-80s1UmeL1N6p5R5p6qz6Be9l2ixikjZhPOjIwPyJda-c9mewx4JbZfy5zOJ-MJiS3QyMgZpCj-OELXn1X5_ezUqaIh0vfLzl_C-uMxkLykqLhfMRz7ApcSO1afz-MgXcqiwhjavDrVP1sf508qQkx9uAQVmtPjq8Kv9VuxKnVC0OuYUNyQQ?session=0&fife https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/o4hg7of7sndh8nbambt68nk4cs\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_va11ntLdU007iummCnTLiVHCcJlPB01dTt83zjXqXOwOZcZG3lneHBXklPDy605xFQn-Q_GGeCAoQby0w2J_REkOP6ruftPPiODXfqItT06TqmaI3Z-26CE5XfA52jRlCnDUDRkO1yPb5hr52yv6Ueta_uqRSNIqEVgrVWC1g9WxUMVDrk93YB-Hh6NDOWYP_pj?session=0&fife https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/d23970iturps3qpu4q68nqmr2o\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYHNWzX80nScCvc0TjxNfMKVqxTZon51oiLw5n4Ti0KS5Vms4kkTtYXBEV3m9zMr7a0d9Gjk-jlCsc56nxqMHQv9rYffCxRnOlGnAN7irtUeH0LNxMc_P83UOgfAiTPIMoKmX0v_yUhvkgt7j-fyqq8_R4EK4vxMihwHy1zu7uC6EnEN-FEO2Xr_j1120xj7Ss?session=0&fife https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/7damalrbg9ho7t2i5jefg5h3is\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZ7V1m2ehvJkWzRVNEVztX1YmlVqa47noSseaGlvYVuGmy-OjbQBFxmBL8pyjFSwhZBoeQk-9DCZDbjCxiiOxPfxhVXujCA8p6HMg6PNZUZKLEQtcDbtI32apoq0Z6Xt4aurWvDBznNHBIwF-n0UV6euSEf_GWxWnMqXNnaj7AHcbyHz9mVTJnC1x2Sf8adIxtI?session=0&fife https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/e3o63vdsid1jlhh8hcvs13361s\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYz8bvEvWfaVlSNdqoOhbBRf_J6SQcUBpb4ZYVrLtUNTQCaXzPPtknW8C8PzO0cR240RqfRg8wHQv_iKRjxFaKMrrq5UI0aOpKLBg0ANdICNPCSvklGwNTN4df5ImCZ6GgS0DHqpV6ZUDGeTzEWRFYz0KWb7fTo82SVaonVfaQ2O9Anrt46DAWQlzvx0EGMBuwx?session=0&fife https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/818gc3b0e8g9nen85884nm7rss\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbwFIBJEbhYUanu9tjV05UtpHFpkOuLDaEZ7pdbFU_dbqpXhYZrVKB0UtmUlmaubB0cL5KoxPCxzJz3q59_IdBo-wRhgc_ZzZkmlk262ATtWnjt631Titma3r1pPV0PwgduiWG_1FTmIRXK50mbyHyQRzJIgTDuYN24DA8lmfBkICz1ujEoPdljEQGO3NVE_60X?session=0&fife https:\/\/doc-0g-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/gk4qncij9qijl26bdejhhah5j0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZsz3dfL9kuW9iDlLwWow4FA7BLzHuyQxYUP6vk-8_GEbSpnYM-lGUADv14MGDgyRK9M5DiXeoS049r0E30V9GqbzFpS04vRAVlLYNokfto4_LMcpoMbPItIT73zucBkho4e1mbZZYVjNLvORckM31gJA0ehmtrh7kGASGTfgu0rgygXs98hL0jsCssQUWqQa0?session=0&fife https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/41p90h1oa41s55b68vgq5p2tts\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZdWQtO3TEWsV1PtyTzPQpTA-tZUd85ikWLauaRvDoxlnhLIiyHbuGDmC-d-UV5-hHSYHU4-8dZwPrMEFDOJQx6TDkUc154lgJJVcnvE0_nbgJWfvze19h8NBVhyqkg3j-nG95F-3IED42JtydhoY1Hy0FVee7S1BmRD501NT8rGVPKSvrxPwC59g5sUNuaZVw?session=0&fife https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/o8d83srbaimepvbnud1p7d8s7o\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYtND4UlgChk1XLIiQYzOLp0vWhj6QFBy7oBHpzCKJucI7gqkWxfO5kUEY9ETFh9nNfiDirNux8dNbUXMKg0hYoKYnOrgY-l2Nt56wk0LsbrGqr1eCAjpcwy7snAvkION5LaVZcBHDhwtWssEXZbjYwE_lhtyh3UG-GHTmfykFiao0jF9GBnzuEi8YvwM6acyA?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9721632, -1.4571617 ] } },
				{ "type": "Feature", "properties": { "Name": "85.0", "description": "<img src=\"https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/il6lujgp8pq7lam3er5vdfplm8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYCODXeL1BZWKDQSZhXqNvC2yQAsbT02r1fXY4neAgPxMuTfmHYFWaHIpO9auiQjvEE5Dgmt9GQ7s_a0E89_v2I4HjkQzxgpmlZVj6lzZg67dpUUmYKQKqzMlC9L648iSE1_L4SwtnvVCg8CFdgVgtaj4Lq0uWpiQVt_wrU1VjR8d8N8rXcnbMjv_V-OQF3mh8?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 49<br>N: -1.4392832<br>E: 36.9815183<br>Altitude_m: <br>DateTime: 01\/11\/2022 10:45:18<br>FileName: IMG-20220111-WA0012.jpg, IMG-20220111-WA0013.jpg, IMG-20220111-WA0014.jpg, IMG-20220111-WA0015.jpg<br><br><img src=\"https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/7tohrthvjstic76v2s5duo49jo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbezg28D8KFqHh89yQRwOLtw5c5xPAmbQks5J99-kifSmSf6wmTOxJ9s-sZGtP0OJlMLtUGBiDNOEhu_CehNVSJlS7fAGioKaE-_h9C50yPpSIkbdqUl9dqVEbtv0MrRI3K8ub3RHuH43rdLQpx9pasaJX7lIypcClVljial6R51La7usNgi75b_h6V-Co3Nlg?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/q4lcm970nenmcf1k8gbp1ke900\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbo4rAqczQ1s3Fzz7q12cTkZ6g5wOuhHkkv-OyuqqDKmXRR56i2Cil6J2taX-3Yd5BE3zDoisBx3vbrasFX8EjXD4M3ewJ07tkXpuXoJjclu8wFHtkm9eG4Cf0eN4sx20CgHmNGU0085J5rm_e2XhcjY-w7_66PDhL0-MUok7nZ-3Dvf3HjETEHlcZ1Xi5qlgQ8?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/86fs311qg14env5i0uugs8fueo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZxYiojFUHmjZzA-IteSd681MrDz8EcbcK9u7dafh7TevJpMtTgnpDQJz2sItkyfvC3AKdSdgSoGpHGVSo136qs3QEae1LEgkGgYoO0soviGDYFd-k9hxyWHF4OVCQ2YNv6Yvxz4XwTp-wgUDO8C1qrJ5K7OggGPTMVveVauWcJeJ-kbr0bpNTJCg6_XhTC2aFt?session=0&fife\" height=\"200\" width=\"auto\" \/>", "IndexNo": "49.0", "N": "-1.4392832", "E": "36.9815183", "Altitude_m": "", "DateTime": "01\/11\/2022 10:45:18", "FileName": "IMG-20220111-WA0012.jpg, IMG-20220111-WA0013.jpg, IMG-20220111-WA0014.jpg, IMG-20220111-WA0015.jpg", "gx_media_links": "https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/il6lujgp8pq7lam3er5vdfplm8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYCODXeL1BZWKDQSZhXqNvC2yQAsbT02r1fXY4neAgPxMuTfmHYFWaHIpO9auiQjvEE5Dgmt9GQ7s_a0E89_v2I4HjkQzxgpmlZVj6lzZg67dpUUmYKQKqzMlC9L648iSE1_L4SwtnvVCg8CFdgVgtaj4Lq0uWpiQVt_wrU1VjR8d8N8rXcnbMjv_V-OQF3mh8?session=0&fife https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/7tohrthvjstic76v2s5duo49jo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbezg28D8KFqHh89yQRwOLtw5c5xPAmbQks5J99-kifSmSf6wmTOxJ9s-sZGtP0OJlMLtUGBiDNOEhu_CehNVSJlS7fAGioKaE-_h9C50yPpSIkbdqUl9dqVEbtv0MrRI3K8ub3RHuH43rdLQpx9pasaJX7lIypcClVljial6R51La7usNgi75b_h6V-Co3Nlg?session=0&fife https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/q4lcm970nenmcf1k8gbp1ke900\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbo4rAqczQ1s3Fzz7q12cTkZ6g5wOuhHkkv-OyuqqDKmXRR56i2Cil6J2taX-3Yd5BE3zDoisBx3vbrasFX8EjXD4M3ewJ07tkXpuXoJjclu8wFHtkm9eG4Cf0eN4sx20CgHmNGU0085J5rm_e2XhcjY-w7_66PDhL0-MUok7nZ-3Dvf3HjETEHlcZ1Xi5qlgQ8?session=0&fife https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/86fs311qg14env5i0uugs8fueo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZxYiojFUHmjZzA-IteSd681MrDz8EcbcK9u7dafh7TevJpMtTgnpDQJz2sItkyfvC3AKdSdgSoGpHGVSo136qs3QEae1LEgkGgYoO0soviGDYFd-k9hxyWHF4OVCQ2YNv6Yvxz4XwTp-wgUDO8C1qrJ5K7OggGPTMVveVauWcJeJ-kbr0bpNTJCg6_XhTC2aFt?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9815183, -1.4392832 ] } },
				{ "type": "Feature", "properties": { "Name": "86.0", "description": "<img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/a2lnvqo9bl9cosibkrf6akq64s\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_va8ugRbKNtyIAOp2sT-_5zw25IFL4NeML48sp62kfgJT23ojbrccyHa4b-fOtUmjiF1xnkGsuSHwbauRAWbdWCAzHj0kbYrpn7g6LKpFlBYUt_8oaNGT4pEaxPInwimEdE7PUlK8HDYEZn7E_CeKuLVa-LDtrm2_QPHUSdpT7P88XygWEwYDowFAqWGORIhMmLT?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 52<br>N: -1.4377162<br>E: 36.9815253<br>Altitude_m: <br>DateTime: 01\/11\/2022 10:46:37<br>FileName: IMG-20220111-WA0016.jpg", "IndexNo": "52.0", "N": "-1.4377162", "E": "36.9815253", "Altitude_m": "", "DateTime": "01\/11\/2022 10:46:37", "FileName": "IMG-20220111-WA0016.jpg", "gx_media_links": "https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/a2lnvqo9bl9cosibkrf6akq64s\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_va8ugRbKNtyIAOp2sT-_5zw25IFL4NeML48sp62kfgJT23ojbrccyHa4b-fOtUmjiF1xnkGsuSHwbauRAWbdWCAzHj0kbYrpn7g6LKpFlBYUt_8oaNGT4pEaxPInwimEdE7PUlK8HDYEZn7E_CeKuLVa-LDtrm2_QPHUSdpT7P88XygWEwYDowFAqWGORIhMmLT?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9815253, -1.4377162 ] } },
				{ "type": "Feature", "properties": { "Name": "87.0", "description": "<img src=\"https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/ght5052a3jmsplu07rimbbo7lg\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYzgYA6xsbjOtyyaZpuDYZKyTi4Z5SwxjPotZVhrEyPPl2vxeLf4i4eGV3FDOC975FaChi-Me_0GIR8AmxaoTOv2ODqOr4qF50bYVh2zQN_m_FlMkGY90T2d_ZdmII3YPg6l3C4Vw4XuL8j0WzAkqsHxy2KGeWidGzf-TtRRO7SuUctv42VwWC8nwwM0XtB2Kg?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 35<br>N: -1.4585318<br>E: 36.9728621<br>Altitude_m: <br>DateTime: 01\/11\/2022 10:33:20<br>FileName: IMG-20220111-WA0017.jpg, IMG-20220111-WA0019.jpg, IMG-20220111-WA0025.jpg, IMG-20220111-WA0034.jpg, IMG-20220111-WA0038.jpg, IMG-20220111-WA0041.jpg, IMG-20220111-WA0042.jpg<br><br><img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/f3qa1r0ai8smmlqm50d98j9h5o\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYCNinPLKIQRvNIj5ioquPW9-TFxO9vJg21U7SpeH0XyriVHzPwoXXiyu1tqbVJehlyJ7zdmydm0XTUtqQ4zjoAZCyZYNgryIq_txJYurlxyDZtVc7DVXbs3CRKr3MdvDDxUVeTL2SeL7b7D3bvV1PNa0RnvceRfwPgx05zdZv9U2yQbF3HLqntHJU-8JAXZ8E?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/6ddpunjbfngcv4m502vdoffgco\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZCOW9tVt1-MHeMKJHDDgq4gxBtXScWo1txpA4WoFsR7kxMnZ6KhNruzt9do6vZEtvc364jw9IdeYp3pSQDFopM2DNaFx-NapQ9oQXYZe3VL5DaavF-gNJtfm7E5a7lT6yHnMELWkY30h9miCQ8BZVpHyRX88wgmI5-2KdjmOX4OwWADL2lxXK8rDdduAvRCIBz?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/vfa8o20jjp3hvbdm0ed2ksrnmg\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vb1JZQ4FOwLtlABpLgBkNxJJjYK2o4BAuKuSfjEBd_9QcDNxkYaW72Ml4Yb1qlCadmWjDdEe8LtHR3C83a6XF2wzcvMCZwjO32WjqqsuxDJZWaiaLyZffllJIowvmNh8NpbkUkPRCQo8vJKmZJdHErww_Lz1PoE9CPCe3IctjZRXbrPeEqUI7r8P8t_r9qrVDkw?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/atf1avsq843ng7ot8r1ggngqvs\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vb-ndhRR8CmkBEYXiO5LzSV_cD8Q4_NUwxWxs53cqqJPek4Z0yw_8B1wS4GKgY327Vl-qrGDXjWqvHbz_U9oLVFjen268UGtln5f4LggKKSQJ-nFN__8jeSgjlPudie1Lc09Y86CQyDXDDzwqoRnVgcLx1BJpwTbnhK9e3ZN3dDA7nF-Qi99DZvVjpvQHcGhdqT?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/8au9mk18r5cikprffr1se5q57s\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vagDCUZSUXiQVsYr-GOtaFDzP24xrZmqezwLbdXFA4hwH55twdAb58gPWM31waw1Yp1KZlqouZfTPqa3jH01OEpW5yhNzIvWVvluwbKjT_SjNEnF4LoI7KXtyGrqaBPsj9VyDRGOnQISwLw_QynA7sX7TmxtP1AW_O7HqiRlS9sKHHvpw61nW7Nu6NkSl3WZNA?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-0g-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/9kphohpvnf12r2gk5h0189n94o\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vauYGsU0UNTWVITjArghdQNhizXnQM9PaWxJDsVZFjw8ZUD7aVLwef23-7MtmRGqekcGxlCdXe1qJVsinkUFwHVn3Y9YfYnNDQlyEYncN-WvbhqaFWTXb0Q6VymViqgIEZ2NrM_1ZBGysycqebcT-hgeT5hR0ZDvPffnabRH65oH_4UfafLo6bOMsKySTzpLFDu?session=0&fife\" height=\"200\" width=\"auto\" \/>", "IndexNo": "35.0", "N": "-1.4585318", "E": "36.9728621", "Altitude_m": "", "DateTime": "01\/11\/2022 10:33:20", "FileName": "IMG-20220111-WA0017.jpg, IMG-20220111-WA0019.jpg, IMG-20220111-WA0025.jpg, IMG-20220111-WA0034.jpg, IMG-20220111-WA0038.jpg, IMG-20220111-WA0041.jpg, IMG-20220111-WA0042.jpg", "gx_media_links": "https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/ght5052a3jmsplu07rimbbo7lg\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYzgYA6xsbjOtyyaZpuDYZKyTi4Z5SwxjPotZVhrEyPPl2vxeLf4i4eGV3FDOC975FaChi-Me_0GIR8AmxaoTOv2ODqOr4qF50bYVh2zQN_m_FlMkGY90T2d_ZdmII3YPg6l3C4Vw4XuL8j0WzAkqsHxy2KGeWidGzf-TtRRO7SuUctv42VwWC8nwwM0XtB2Kg?session=0&fife https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/f3qa1r0ai8smmlqm50d98j9h5o\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYCNinPLKIQRvNIj5ioquPW9-TFxO9vJg21U7SpeH0XyriVHzPwoXXiyu1tqbVJehlyJ7zdmydm0XTUtqQ4zjoAZCyZYNgryIq_txJYurlxyDZtVc7DVXbs3CRKr3MdvDDxUVeTL2SeL7b7D3bvV1PNa0RnvceRfwPgx05zdZv9U2yQbF3HLqntHJU-8JAXZ8E?session=0&fife https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/6ddpunjbfngcv4m502vdoffgco\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZCOW9tVt1-MHeMKJHDDgq4gxBtXScWo1txpA4WoFsR7kxMnZ6KhNruzt9do6vZEtvc364jw9IdeYp3pSQDFopM2DNaFx-NapQ9oQXYZe3VL5DaavF-gNJtfm7E5a7lT6yHnMELWkY30h9miCQ8BZVpHyRX88wgmI5-2KdjmOX4OwWADL2lxXK8rDdduAvRCIBz?session=0&fife https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/vfa8o20jjp3hvbdm0ed2ksrnmg\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vb1JZQ4FOwLtlABpLgBkNxJJjYK2o4BAuKuSfjEBd_9QcDNxkYaW72Ml4Yb1qlCadmWjDdEe8LtHR3C83a6XF2wzcvMCZwjO32WjqqsuxDJZWaiaLyZffllJIowvmNh8NpbkUkPRCQo8vJKmZJdHErww_Lz1PoE9CPCe3IctjZRXbrPeEqUI7r8P8t_r9qrVDkw?session=0&fife https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/atf1avsq843ng7ot8r1ggngqvs\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vb-ndhRR8CmkBEYXiO5LzSV_cD8Q4_NUwxWxs53cqqJPek4Z0yw_8B1wS4GKgY327Vl-qrGDXjWqvHbz_U9oLVFjen268UGtln5f4LggKKSQJ-nFN__8jeSgjlPudie1Lc09Y86CQyDXDDzwqoRnVgcLx1BJpwTbnhK9e3ZN3dDA7nF-Qi99DZvVjpvQHcGhdqT?session=0&fife https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/8au9mk18r5cikprffr1se5q57s\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vagDCUZSUXiQVsYr-GOtaFDzP24xrZmqezwLbdXFA4hwH55twdAb58gPWM31waw1Yp1KZlqouZfTPqa3jH01OEpW5yhNzIvWVvluwbKjT_SjNEnF4LoI7KXtyGrqaBPsj9VyDRGOnQISwLw_QynA7sX7TmxtP1AW_O7HqiRlS9sKHHvpw61nW7Nu6NkSl3WZNA?session=0&fife https:\/\/doc-0g-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/9kphohpvnf12r2gk5h0189n94o\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vauYGsU0UNTWVITjArghdQNhizXnQM9PaWxJDsVZFjw8ZUD7aVLwef23-7MtmRGqekcGxlCdXe1qJVsinkUFwHVn3Y9YfYnNDQlyEYncN-WvbhqaFWTXb0Q6VymViqgIEZ2NrM_1ZBGysycqebcT-hgeT5hR0ZDvPffnabRH65oH_4UfafLo6bOMsKySTzpLFDu?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9728621, -1.4585318 ] } },
				{ "type": "Feature", "properties": { "Name": "88.0", "description": "<img src=\"https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/o664rm157fo356ouf074pv5nrk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZmNNgA1UVt4C742-9sREtAy_VqPVHA-QL6gVE4mxeOhb6WNpi8y80CmbbaSsUdG0JJP5_nANMEARhGYwSP0dxiMj8K_2SiD8fhlS134QMvdFacHWZGDVNlMsFHRgLBMez0FjANoV5FjffmyTviDW7RDU-PpJE_h5FvnoIOyPiUntuljX5ezDKisE4J49K1e-8X?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 41<br>N: -1.4611583<br>E: 36.9739049<br>Altitude_m: 1,532.1<br>DateTime: 01\/11\/2022 10:36:41<br>FileName: IMG-20220111-WA0018.jpg", "IndexNo": "41.0", "N": "-1.4611583", "E": "36.9739049", "Altitude_m": "1532.1", "DateTime": "01\/11\/2022 10:36:41", "FileName": "IMG-20220111-WA0018.jpg", "gx_media_links": "https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/o664rm157fo356ouf074pv5nrk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZmNNgA1UVt4C742-9sREtAy_VqPVHA-QL6gVE4mxeOhb6WNpi8y80CmbbaSsUdG0JJP5_nANMEARhGYwSP0dxiMj8K_2SiD8fhlS134QMvdFacHWZGDVNlMsFHRgLBMez0FjANoV5FjffmyTviDW7RDU-PpJE_h5FvnoIOyPiUntuljX5ezDKisE4J49K1e-8X?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9739049, -1.4611583 ] } },
				{ "type": "Feature", "properties": { "Name": "91.0", "description": "<img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/gg873v67fughgbguvpqa1v8bhc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZIYv_TBEM78qvcX4WdHzLGs4DPp7yFDCWsOM-o55qstyDyVfJX5zFBWM6arnVDlUKI0QJ3kCJT7q5RHHGQXeh4_I4gVb6UU7wjhnLwL5UVpbypI9YkWJN9tlnt2ANCPZNTZSjoaRaPG_ucVoBNt2b7Y4vrVyzd8PUADCZh6zFqGGaDmpYZNncmwlJuU4jCemQ?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 19<br>N: -1.4471299<br>E: 36.9946566<br>Altitude_m: <br>DateTime: 01\/11\/2022 10:08:03<br>FileName: IMG-20220111-WA0022.jpg, IMG-20220111-WA0027.jpg<br><br><img src=\"https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/jdojm8djfldn37pfgvu4549ogk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZUmpQ1H9K6nFymDll9vde2Z5EQVs4KWw53adqX2MTm3AzEER_lJScRkOoNStMGQArg1DpeLgtxwvvSMZnRLrAb96VMhDJd9xqC-rk42NfweRJsyKRzmhAnSX52jhKVRN63-Z_Dm9N7ZicPIXoqyJyoNG6iuHPiZiazOEWwI8-cO_YIXrQs2rYD9vaAMbtJsa8?session=0&fife\" height=\"200\" width=\"auto\" \/>", "IndexNo": "19.0", "N": "-1.4471299", "E": "36.9946566", "Altitude_m": "", "DateTime": "01\/11\/2022 10:08:03", "FileName": "IMG-20220111-WA0022.jpg, IMG-20220111-WA0027.jpg", "gx_media_links": "https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/gg873v67fughgbguvpqa1v8bhc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZIYv_TBEM78qvcX4WdHzLGs4DPp7yFDCWsOM-o55qstyDyVfJX5zFBWM6arnVDlUKI0QJ3kCJT7q5RHHGQXeh4_I4gVb6UU7wjhnLwL5UVpbypI9YkWJN9tlnt2ANCPZNTZSjoaRaPG_ucVoBNt2b7Y4vrVyzd8PUADCZh6zFqGGaDmpYZNncmwlJuU4jCemQ?session=0&fife https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/jdojm8djfldn37pfgvu4549ogk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZUmpQ1H9K6nFymDll9vde2Z5EQVs4KWw53adqX2MTm3AzEER_lJScRkOoNStMGQArg1DpeLgtxwvvSMZnRLrAb96VMhDJd9xqC-rk42NfweRJsyKRzmhAnSX52jhKVRN63-Z_Dm9N7ZicPIXoqyJyoNG6iuHPiZiazOEWwI8-cO_YIXrQs2rYD9vaAMbtJsa8?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9946566, -1.4471299 ] } },
				{ "type": "Feature", "properties": { "Name": "93.0", "description": "<img src=\"https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/ob09ton7mp9d9do52lpfeh21n8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_va8QX_FV0nZi1oRHOFvrI9FdIuLGLEsEYnpch8ElHbAkwMedQVsxy0Va0noicW33Shp34wCyLmOdvjQ-dM-Y9CAxBc4nydeW0jPD-O9bcMyiG-PIa58H65gc8Ts6_gANMNkeCaebTwBz08dQnSzZ9NQMv4-C-ylYu9Cj8_4n4GOrZQPB5BO-olU6FxX9yXfn_wn?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 42<br>N: -1.46116<br>E: 36.9739167<br>Altitude_m: 1,530.4<br>DateTime: 01\/11\/2022 10:36:56<br>FileName: IMG-20220111-WA0024.jpg", "IndexNo": "42.0", "N": "-1.46116", "E": "36.9739167", "Altitude_m": "1530.4", "DateTime": "01\/11\/2022 10:36:56", "FileName": "IMG-20220111-WA0024.jpg", "gx_media_links": "https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/ob09ton7mp9d9do52lpfeh21n8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_va8QX_FV0nZi1oRHOFvrI9FdIuLGLEsEYnpch8ElHbAkwMedQVsxy0Va0noicW33Shp34wCyLmOdvjQ-dM-Y9CAxBc4nydeW0jPD-O9bcMyiG-PIa58H65gc8Ts6_gANMNkeCaebTwBz08dQnSzZ9NQMv4-C-ylYu9Cj8_4n4GOrZQPB5BO-olU6FxX9yXfn_wn?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9739167, -1.46116 ] } },
				{ "type": "Feature", "properties": { "Name": "94.0", "description": "<img src=\"https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/p9dafqprcbonsq681dtltc0m0s\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZNajFY1nYTUe-ILbwuXa8XmZTA1M9ykIhH7zlxv3KKfWR42-PPDOnEnwf8zR43XK_gYIM9E0jmQYDcPVCSDE8fQcLWoiITwRK7V5iCNOz6sFDhpfJET_c6GCo7nn42WfFhe0-hr-DpShndpsshFsfSAESkE6RRwBpTZrIZRjSh_ttitlfBa7SggriRcVSfogQ?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 23<br>N: -1.4560625<br>E: 36.9706467<br>Altitude_m: <br>DateTime: 01\/11\/2022 10:14:39<br>FileName: IMG-20220111-WA0030.jpg", "IndexNo": "23.0", "N": "-1.4560625", "E": "36.9706467", "Altitude_m": "", "DateTime": "01\/11\/2022 10:14:39", "FileName": "IMG-20220111-WA0030.jpg", "gx_media_links": "https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/p9dafqprcbonsq681dtltc0m0s\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZNajFY1nYTUe-ILbwuXa8XmZTA1M9ykIhH7zlxv3KKfWR42-PPDOnEnwf8zR43XK_gYIM9E0jmQYDcPVCSDE8fQcLWoiITwRK7V5iCNOz6sFDhpfJET_c6GCo7nn42WfFhe0-hr-DpShndpsshFsfSAESkE6RRwBpTZrIZRjSh_ttitlfBa7SggriRcVSfogQ?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9706467, -1.4560625 ] } },
				{ "type": "Feature", "properties": { "Name": "95.0", "description": "<img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/kivonm4dba9a3s459q3880csr4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYdSBVag972sJ6h2gbKE8X3onKuvXd6xc1NXiH48cZRK8E4M2IzXSWCQgQAWjltW6gizQ8chzSZOrozEfsLhAlZGkp7aeRisE430Cr__4Xl3Hc4M3MLGVkdSqyhIUJUk-WuDke9EDktGoa0GziiRd7zkexIEfIxUIwPGXx87Mx5V6472I7HVuH3w5B58PacXKA?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 24<br>N: -1.4560625<br>E: 36.9706467<br>Altitude_m: <br>DateTime: 01\/11\/2022 10:14:41<br>FileName: IMG-20220111-WA0032.jpg", "IndexNo": "24.0", "N": "-1.4560625", "E": "36.9706467", "Altitude_m": "", "DateTime": "01\/11\/2022 10:14:41", "FileName": "IMG-20220111-WA0032.jpg", "gx_media_links": "https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/kivonm4dba9a3s459q3880csr4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYdSBVag972sJ6h2gbKE8X3onKuvXd6xc1NXiH48cZRK8E4M2IzXSWCQgQAWjltW6gizQ8chzSZOrozEfsLhAlZGkp7aeRisE430Cr__4Xl3Hc4M3MLGVkdSqyhIUJUk-WuDke9EDktGoa0GziiRd7zkexIEfIxUIwPGXx87Mx5V6472I7HVuH3w5B58PacXKA?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9706467, -1.4560625 ] } },
				{ "type": "Feature", "properties": { "Name": "96.0", "description": "<img src=\"https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/bn4ldgdh9m9tjcofacgp7ibku4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZGJy24BLl8y9mthwh6td802obQcT2Sb2LSgFBI7X8VjaBq1kHahmhNhgoGGpHaaA2ZsAZK2Z66bxK6jkUEnq2LuNp4aUJd30eMy2mqwuSONomIwsYjHEYxgypk8KLeArIZH0L3yCCbScLsceAynwHmFN6LMKnox2ysxV5N0OU6G4kmYgxGM5SrrfmIwcDh739O?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 42<br>N: -1.46116<br>E: 36.9739167<br>Altitude_m: 1,530.4<br>DateTime: 01\/11\/2022 10:36:58<br>FileName: IMG-20220111-WA0036.jpg", "IndexNo": "42.0", "N": "-1.46116", "E": "36.9739167", "Altitude_m": "1530.4", "DateTime": "01\/11\/2022 10:36:58", "FileName": "IMG-20220111-WA0036.jpg", "gx_media_links": "https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/bn4ldgdh9m9tjcofacgp7ibku4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZGJy24BLl8y9mthwh6td802obQcT2Sb2LSgFBI7X8VjaBq1kHahmhNhgoGGpHaaA2ZsAZK2Z66bxK6jkUEnq2LuNp4aUJd30eMy2mqwuSONomIwsYjHEYxgypk8KLeArIZH0L3yCCbScLsceAynwHmFN6LMKnox2ysxV5N0OU6G4kmYgxGM5SrrfmIwcDh739O?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9739167, -1.46116 ] } },
				{ "type": "Feature", "properties": { "Name": "97.0", "description": "<img src=\"https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/jb89fjmd48mjdle67fe7cj8odc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZAp9jJTIkec5LQz3HydVy3pPYiIRm2ladRSC9H--k2tcuiPdOY831pOHrO0D4SI_qp4EgB2igbokw1WQBRLoYuyidhBT4WxoeFR1ofQeRUN5YDPGQ8GB3vt39xix1jp1Bz7YVmR_MuLIViJVkSexaaDJWS6q4yV644U6597QTmaKB8P9hfEO9sCRtxjMbLq9U?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 25<br>N: -1.4571617<br>E: 36.9721632<br>Altitude_m: <br>DateTime: 01\/11\/2022 10:20:30<br>FileName: IMG-20220111-WA0037.jpg", "IndexNo": "25.0", "N": "-1.4571617", "E": "36.9721632", "Altitude_m": "", "DateTime": "01\/11\/2022 10:20:30", "FileName": "IMG-20220111-WA0037.jpg", "gx_media_links": "https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/jb89fjmd48mjdle67fe7cj8odc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZAp9jJTIkec5LQz3HydVy3pPYiIRm2ladRSC9H--k2tcuiPdOY831pOHrO0D4SI_qp4EgB2igbokw1WQBRLoYuyidhBT4WxoeFR1ofQeRUN5YDPGQ8GB3vt39xix1jp1Bz7YVmR_MuLIViJVkSexaaDJWS6q4yV644U6597QTmaKB8P9hfEO9sCRtxjMbLq9U?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9721632, -1.4571617 ] } },
				{ "type": "Feature", "properties": { "Name": "98.0", "description": "<img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/taqkucdbse91ve8m7nkg3s30bs\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbT_0j3lKKleQ4TowALrJtLTnHWSDPTUxgWvzMMM8mfuWEs91RB5klkjz2c76XY5XeJdcGoVUwanVQzZID0gw2OXUK4j_R282S1j6z8TpphXK_UqbxGyn0YT-PrEH53wVrnu5ZFhyjyu7JRaW6cW6wD2LVgjygVhyf-qdClr3jRLzQRkss24q_HtY92Fc3lf3Y3?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 3<br>N: -1.4533067<br>E: 36.9885983<br>Altitude_m: 1,543.3<br>DateTime: 01\/12\/2022 15:25:25<br>FileName: IMG-20220112-WA0000.jpg, IMG-20220112-WA0017.jpg<br><br><img src=\"https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/bf7sa6dp55fb4ub3dlgs8c2tuo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaWa5iX7Chp2juaOjXg0X-S7_YqdF2AaRF3t9gH5BBlk7Mja-n1OjVL8IBq5alczb2tSYNGGKA4A-ev8ySWSRRxJPoX6O538ejBoYzIEN0kU2RhhFySL9CKL3AYhIUzWK70XX9L19I12e8M95EpaWbP5YtWngPKD0_pqQW93IwdPXcuo-i4527fjRgUF63TWSP0?session=0&fife\" height=\"200\" width=\"auto\" \/>", "IndexNo": "3.0", "N": "-1.4533067", "E": "36.9885983", "Altitude_m": "1543.3", "DateTime": "01\/12\/2022 15:25:25", "FileName": "IMG-20220112-WA0000.jpg, IMG-20220112-WA0017.jpg", "gx_media_links": "https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/taqkucdbse91ve8m7nkg3s30bs\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbT_0j3lKKleQ4TowALrJtLTnHWSDPTUxgWvzMMM8mfuWEs91RB5klkjz2c76XY5XeJdcGoVUwanVQzZID0gw2OXUK4j_R282S1j6z8TpphXK_UqbxGyn0YT-PrEH53wVrnu5ZFhyjyu7JRaW6cW6wD2LVgjygVhyf-qdClr3jRLzQRkss24q_HtY92Fc3lf3Y3?session=0&fife https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/bf7sa6dp55fb4ub3dlgs8c2tuo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaWa5iX7Chp2juaOjXg0X-S7_YqdF2AaRF3t9gH5BBlk7Mja-n1OjVL8IBq5alczb2tSYNGGKA4A-ev8ySWSRRxJPoX6O538ejBoYzIEN0kU2RhhFySL9CKL3AYhIUzWK70XX9L19I12e8M95EpaWbP5YtWngPKD0_pqQW93IwdPXcuo-i4527fjRgUF63TWSP0?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9885983, -1.4533067 ] } },
				{ "type": "Feature", "properties": { "Name": "99.0", "description": "<img src=\"https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/b8t7oodn4i238igjlftpfslv44\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vafnd5cf09VAZ4IuvuySvKedKWSi1wyQXAiR7-4o7Xac-P80Gj41AmDzIg7wjxt0VhiLBRqofzm9HBz6xr4oP8vskNm-KGZ7-NDTJAV0BiOxxxUk_SB6WcZLNLLurNekW6xODxnD1uRbHWFQFiR_samehi6NhbRoe2m0lZzmqi86qzOMVPpqI0bLxjB1n1VEAs?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 21<br>N: -1.464665<br>E: 36.9843433<br>Altitude_m: 1,514.2<br>DateTime: 01\/12\/2022 15:59:11<br>FileName: IMG-20220112-WA0001.jpg, IMG-20220112-WA0003.jpg, IMG-20220112-WA0004.jpg, IMG-20220112-WA0005.jpg, IMG-20220112-WA0006.jpg, IMG-20220112-WA0007.jpg, IMG-20220112-WA0008.jpg<br><br><img src=\"https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/85q46334q3909tomrueleble6k\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZSBtCWgy7Z2yrLQ2dsUq1IgUJLyIiI98v8lTLtwudnzFGlluJZy-Fh5XWtHqiCv3VYf9O6qZzjZtdEMLPEIglRrlUcrL4OoLe0E9MHAMmaheYDgUB9naihBPsZpS5uUAfrQyfQcN5Yxgzvkt9J_wXD3jCk0Fv6_IpM6pfgTxln7lUxIIpfil1MHxPbK3q9P9k?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/jji8jacacuu15tkk4rgtj53ud0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY2yxKystpnkrDxImcAXDkTA3Gdgu0_sX3ogy5uksSMPiKPCJIQnEOYR0youAd_M5l4y2skNcKxW2pLjA-qGGg9eh4obDr89VjNdnTX9UbzzZ74NJdtI_yVoCaRkXf7dshM8TU8y-FWJhDP1WiY2NhsFwuO8PnIiKftMp9bRVDyGimEi7ZjfRjY9EdxsBhMaHA?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/rek3tmkik6oia1jqvmov6910gc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbxnpOT-xLXuJeTSd5jrOW4RAUkllYJoUr3nehW01FmnHMBUfue07azS9E6BD8BdMJ5R7C20GZM6AIurNOpbvLLIno4H8MgMQHO4pyF2_a4_ob247K21se2Bvyakxj-v6K5b6djIWXA9BtBUy0jmaFmnDQQ7a76RdZLT4nBqwmkOiLPDWzO6JL6Ae1DRrCmV02C?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/gd3vkcnqmdqhn8b7ibhk9a6qe4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbyRcEB63q8LodrbZsMX_rdpfrUtp_f5DQT9oY46mEKBmRjg4BwDTESF5PJXqHhv-pQa2qpv_4GwWp8neuu0LpWsc4Ud_YS8iOPBcX8jzrgC_yPsIu-57TUg_zdQ1QTI21Cwhx6aTPE75TxObxWWwAiVNKUONPh6joIUnS5q5OFtvjMIo_OgYXo76bCfFCTEZo?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/5tcbgt3g75l39ngluagsgdummk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaT1kOa4af1P94R4lcaAEwHMyVJEJwbNZbKR2yhuKh6WcEFuqkVUyZYZ1TB0Z-JpDO8RfnsbHJXGjBUTnJWiQffERzucdwCpHkbnk6Sq9PWUIrVmNt5oyI93-i8cfhDDn5NluRdVnsV7yoTnWgL4Sns6Fyzu3gHGpTrsIAHrIQ2h4NEODGJFSO3KGfl_wByxhw?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br><img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/b4djl17o9irv5bh9rd23f7hats\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_va9jKizdvi8W5_0XxES9dXe9hoqO6TshVOO46_sjteJX_6hFjzulOSkoJPayqXbCvqC7KXl4i6FEG5FJEAU1SLUqNKmkSSpRrzcDAZ_woU7gn_6A9pYiMlICyA5bFEyR8zeoglUClkdUUG5SkWRvPw6J0iC7Z8Wf2SAd6nwgPyDDqm09DBtGPut9OSwCRaZU_E?session=0&fife\" height=\"200\" width=\"auto\" \/>", "IndexNo": "21.0", "N": "-1.464665", "E": "36.9843433", "Altitude_m": "1514.2", "DateTime": "01\/12\/2022 15:59:11", "FileName": "IMG-20220112-WA0001.jpg, IMG-20220112-WA0003.jpg, IMG-20220112-WA0004.jpg, IMG-20220112-WA0005.jpg, IMG-20220112-WA0006.jpg, IMG-20220112-WA0007.jpg, IMG-20220112-WA0008.jpg", "gx_media_links": "https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/b8t7oodn4i238igjlftpfslv44\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vafnd5cf09VAZ4IuvuySvKedKWSi1wyQXAiR7-4o7Xac-P80Gj41AmDzIg7wjxt0VhiLBRqofzm9HBz6xr4oP8vskNm-KGZ7-NDTJAV0BiOxxxUk_SB6WcZLNLLurNekW6xODxnD1uRbHWFQFiR_samehi6NhbRoe2m0lZzmqi86qzOMVPpqI0bLxjB1n1VEAs?session=0&fife https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/85q46334q3909tomrueleble6k\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZSBtCWgy7Z2yrLQ2dsUq1IgUJLyIiI98v8lTLtwudnzFGlluJZy-Fh5XWtHqiCv3VYf9O6qZzjZtdEMLPEIglRrlUcrL4OoLe0E9MHAMmaheYDgUB9naihBPsZpS5uUAfrQyfQcN5Yxgzvkt9J_wXD3jCk0Fv6_IpM6pfgTxln7lUxIIpfil1MHxPbK3q9P9k?session=0&fife https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/jji8jacacuu15tkk4rgtj53ud0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY2yxKystpnkrDxImcAXDkTA3Gdgu0_sX3ogy5uksSMPiKPCJIQnEOYR0youAd_M5l4y2skNcKxW2pLjA-qGGg9eh4obDr89VjNdnTX9UbzzZ74NJdtI_yVoCaRkXf7dshM8TU8y-FWJhDP1WiY2NhsFwuO8PnIiKftMp9bRVDyGimEi7ZjfRjY9EdxsBhMaHA?session=0&fife https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/rek3tmkik6oia1jqvmov6910gc\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbxnpOT-xLXuJeTSd5jrOW4RAUkllYJoUr3nehW01FmnHMBUfue07azS9E6BD8BdMJ5R7C20GZM6AIurNOpbvLLIno4H8MgMQHO4pyF2_a4_ob247K21se2Bvyakxj-v6K5b6djIWXA9BtBUy0jmaFmnDQQ7a76RdZLT4nBqwmkOiLPDWzO6JL6Ae1DRrCmV02C?session=0&fife https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/gd3vkcnqmdqhn8b7ibhk9a6qe4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbyRcEB63q8LodrbZsMX_rdpfrUtp_f5DQT9oY46mEKBmRjg4BwDTESF5PJXqHhv-pQa2qpv_4GwWp8neuu0LpWsc4Ud_YS8iOPBcX8jzrgC_yPsIu-57TUg_zdQ1QTI21Cwhx6aTPE75TxObxWWwAiVNKUONPh6joIUnS5q5OFtvjMIo_OgYXo76bCfFCTEZo?session=0&fife https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/5tcbgt3g75l39ngluagsgdummk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaT1kOa4af1P94R4lcaAEwHMyVJEJwbNZbKR2yhuKh6WcEFuqkVUyZYZ1TB0Z-JpDO8RfnsbHJXGjBUTnJWiQffERzucdwCpHkbnk6Sq9PWUIrVmNt5oyI93-i8cfhDDn5NluRdVnsV7yoTnWgL4Sns6Fyzu3gHGpTrsIAHrIQ2h4NEODGJFSO3KGfl_wByxhw?session=0&fife https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/b4djl17o9irv5bh9rd23f7hats\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_va9jKizdvi8W5_0XxES9dXe9hoqO6TshVOO46_sjteJX_6hFjzulOSkoJPayqXbCvqC7KXl4i6FEG5FJEAU1SLUqNKmkSSpRrzcDAZ_woU7gn_6A9pYiMlICyA5bFEyR8zeoglUClkdUUG5SkWRvPw6J0iC7Z8Wf2SAd6nwgPyDDqm09DBtGPut9OSwCRaZU_E?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9843433, -1.464665 ] } },
				{ "type": "Feature", "properties": { "Name": "100.0", "description": "<img src=\"https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/gptm7pj91v1rfa6suct8jcgbi4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZV3ArZNLz40yfIq4mRTcIBOU6101oRmweDbQQxc1pVnmbzEA-hqko1BPCP532aMFHMXz36QHrLhHdaInqbThr02DCq6ztb7xUFP6YnHPgqkVIpqi7JSPXBrg9xja0dPjpUy8uv-R7S0umr6Em7biKZheU2sL_gQMZmc9uO3keI7SMtUSDIa4sELkTFJFZf2p0?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 13<br>N: -1.4649233<br>E: 36.9845383<br>Altitude_m: 1,553.1<br>DateTime: 01\/12\/2022 15:42:34<br>FileName: IMG-20220112-WA0002.jpg", "IndexNo": "13.0", "N": "-1.4649233", "E": "36.9845383", "Altitude_m": "1553.1", "DateTime": "01\/12\/2022 15:42:34", "FileName": "IMG-20220112-WA0002.jpg", "gx_media_links": "https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/gptm7pj91v1rfa6suct8jcgbi4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZV3ArZNLz40yfIq4mRTcIBOU6101oRmweDbQQxc1pVnmbzEA-hqko1BPCP532aMFHMXz36QHrLhHdaInqbThr02DCq6ztb7xUFP6YnHPgqkVIpqi7JSPXBrg9xja0dPjpUy8uv-R7S0umr6Em7biKZheU2sL_gQMZmc9uO3keI7SMtUSDIa4sELkTFJFZf2p0?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9845383, -1.4649233 ] } },
				{ "type": "Feature", "properties": { "Name": "101.0", "description": "<img src=\"https:\/\/doc-0g-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/4r8sqs7t54gehogj803fv26rjk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZ9P3fZP9y2ykfVvcARVeHadzk5AwWEJx1dFx7E_aWZSvl3nrk6ShPi-Bl9xumVLevMPBf5FVwWWxu_ZxZNGvpxQ-n_VY_R6WGX06g8nKYThiEIwZQr2-q3YaL5KcduGPNO7_u5CGQnN5bf_H-z43vpWJfrYik3hFtxsQU4DhELyvqap0TIEshj5BcxjGTcd9E?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 12<br>N: -1.45869<br>E: 36.9850283<br>Altitude_m: 1,543.3<br>DateTime: 01\/12\/2022 15:36:06<br>FileName: IMG-20220112-WA0009.jpg", "IndexNo": "12.0", "N": "-1.45869", "E": "36.9850283", "Altitude_m": "1543.3", "DateTime": "01\/12\/2022 15:36:06", "FileName": "IMG-20220112-WA0009.jpg", "gx_media_links": "https:\/\/doc-0g-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/4r8sqs7t54gehogj803fv26rjk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZ9P3fZP9y2ykfVvcARVeHadzk5AwWEJx1dFx7E_aWZSvl3nrk6ShPi-Bl9xumVLevMPBf5FVwWWxu_ZxZNGvpxQ-n_VY_R6WGX06g8nKYThiEIwZQr2-q3YaL5KcduGPNO7_u5CGQnN5bf_H-z43vpWJfrYik3hFtxsQU4DhELyvqap0TIEshj5BcxjGTcd9E?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9850283, -1.45869 ] } },
				{ "type": "Feature", "properties": { "Name": "102.0", "description": "<img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/g2si2ngsq0464i7phesgvbqp1c\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_va6nYrBgLrW-4fOrA94NhHAQXr1Uv1vUzAyRTuYFdFMYg5hPEutn-vvCAqulgJBSe9dDUv7Qu0f0Nr2WLRrNHfMvBs7eyZbYL_3asjtqFA0XttqIdDg9-0jcgcuQL7NY8Ngu-yOtPjLxdPhy2nJVzraq4ZnT_MgVZasJYEW6pn4JsAT-BGIcWJm67Ftx5j-UIg?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 11<br>N: -1.4588567<br>E: 36.9850567<br>Altitude_m: 1,543.3<br>DateTime: 01\/12\/2022 15:35:59<br>FileName: IMG-20220112-WA0010.jpg", "IndexNo": "11.0", "N": "-1.4588567", "E": "36.9850567", "Altitude_m": "1543.3", "DateTime": "01\/12\/2022 15:35:59", "FileName": "IMG-20220112-WA0010.jpg", "gx_media_links": "https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/g2si2ngsq0464i7phesgvbqp1c\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_va6nYrBgLrW-4fOrA94NhHAQXr1Uv1vUzAyRTuYFdFMYg5hPEutn-vvCAqulgJBSe9dDUv7Qu0f0Nr2WLRrNHfMvBs7eyZbYL_3asjtqFA0XttqIdDg9-0jcgcuQL7NY8Ngu-yOtPjLxdPhy2nJVzraq4ZnT_MgVZasJYEW6pn4JsAT-BGIcWJm67Ftx5j-UIg?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9850567, -1.4588567 ] } },
				{ "type": "Feature", "properties": { "Name": "103.0", "description": "<img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/3t2d9k24ovr5tp5pq1pe82sm3s\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZkQLsCANfcRJkfp-eXogu9p7UaeL75Aonmcnml8jEEdRZVJOBJupEyWqRZcO4tlvnYIRpFGhsFzoCjpQ1Q7RAIkSR7db4NY8jvrDf2rLSaxDem3JkP-EUFJRM_IbcbKZ6i_hcDkTlDcplFkwEwrnI6Y39sJOJf9viN-YtvnlZFzH2EPnDWS6jMl2CcBALQYzFs?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 10<br>N: -1.4581417<br>E: 36.987595<br>Altitude_m: 1,543.4<br>DateTime: 01\/12\/2022 15:32:26<br>FileName: IMG-20220112-WA0011.jpg", "IndexNo": "10.0", "N": "-1.4581417", "E": "36.987595", "Altitude_m": "1543.4", "DateTime": "01\/12\/2022 15:32:26", "FileName": "IMG-20220112-WA0011.jpg", "gx_media_links": "https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/3t2d9k24ovr5tp5pq1pe82sm3s\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZkQLsCANfcRJkfp-eXogu9p7UaeL75Aonmcnml8jEEdRZVJOBJupEyWqRZcO4tlvnYIRpFGhsFzoCjpQ1Q7RAIkSR7db4NY8jvrDf2rLSaxDem3JkP-EUFJRM_IbcbKZ6i_hcDkTlDcplFkwEwrnI6Y39sJOJf9viN-YtvnlZFzH2EPnDWS6jMl2CcBALQYzFs?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.987595, -1.4581417 ] } },
				{ "type": "Feature", "properties": { "Name": "104.0", "description": "<img src=\"https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/riqcr23rf7g2tpk5g8il840d1o\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYFpcRidLBnzQhSPZPwmibOL24veBT-iGfWqpu_bPWAvcvhvGSeWt29ZfueDCuUKXCZ8pdcXdhPADs3gtDzO7aHi0l5JPPJL9GlDKrIvqjxDB-IZYMk6AYU9CxOSfvOSm7OaiOqN5So2Z-BmlTkT0JGJOuqPN8We6tNK8S88hZ8YIh1qNa6WRTGmkK5OLU3sioJ?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 7<br>N: -1.4546517<br>E: 36.9890167<br>Altitude_m: 1,543.4<br>DateTime: 01\/12\/2022 15:27:35<br>FileName: IMG-20220112-WA0012.jpg", "IndexNo": "7.0", "N": "-1.4546517", "E": "36.9890167", "Altitude_m": "1543.4", "DateTime": "01\/12\/2022 15:27:35", "FileName": "IMG-20220112-WA0012.jpg", "gx_media_links": "https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/riqcr23rf7g2tpk5g8il840d1o\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYFpcRidLBnzQhSPZPwmibOL24veBT-iGfWqpu_bPWAvcvhvGSeWt29ZfueDCuUKXCZ8pdcXdhPADs3gtDzO7aHi0l5JPPJL9GlDKrIvqjxDB-IZYMk6AYU9CxOSfvOSm7OaiOqN5So2Z-BmlTkT0JGJOuqPN8We6tNK8S88hZ8YIh1qNa6WRTGmkK5OLU3sioJ?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9890167, -1.4546517 ] } },
				{ "type": "Feature", "properties": { "Name": "105.0", "description": "<img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/4gjloiitm6cpej5kgb2488hrec\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbtKJkNbjjH_3hjBB_6vxd1FMCYRcSmzl9IAAW5sP0Sq2AIi2WRb4kU7WxqZJfq4pVHtuFxcxQveovDH3dIyR5f4KO0LcMTcOOs958dwvZa8zZ3HRIXQ9CaaaDDUR_kgEJxd5Ufa5dIfx1cq7-rTmJ5FvsRWdDWY-yNZyz4pO-wTiwsNxbpwtcHDzqEDLcV1gDy?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 8<br>N: -1.4581033<br>E: 36.9874883<br>Altitude_m: 1,543.6<br>DateTime: 01\/12\/2022 15:32:17<br>FileName: IMG-20220112-WA0013.jpg", "IndexNo": "8.0", "N": "-1.4581033", "E": "36.9874883", "Altitude_m": "1543.6", "DateTime": "01\/12\/2022 15:32:17", "FileName": "IMG-20220112-WA0013.jpg", "gx_media_links": "https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/4gjloiitm6cpej5kgb2488hrec\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbtKJkNbjjH_3hjBB_6vxd1FMCYRcSmzl9IAAW5sP0Sq2AIi2WRb4kU7WxqZJfq4pVHtuFxcxQveovDH3dIyR5f4KO0LcMTcOOs958dwvZa8zZ3HRIXQ9CaaaDDUR_kgEJxd5Ufa5dIfx1cq7-rTmJ5FvsRWdDWY-yNZyz4pO-wTiwsNxbpwtcHDzqEDLcV1gDy?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9874883, -1.4581033 ] } },
				{ "type": "Feature", "properties": { "Name": "106.0", "description": "<img src=\"https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/pac2t7mff1tbavutqdt9eu5780\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaPhj2iREjDd7F23dj9NIiDpQxspAZoSNi1Ip9j4dLNZAfFkvQt3K1HELpZ7vRAaKcqpHW6xGEcc0Yv-V5sCR6-FZeVCS_plbkElk7VEcA9SSn1zPnP8cta4M-9TiIZdPY3XbJMRdXRIiRcc6wI4SP2fln5GRSbnnE7x8XSgMYDpnxlqRnD-JFLgVW3bb3pW6Mh?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 9<br>N: -1.4581267<br>E: 36.9875167<br>Altitude_m: 1,543.5<br>DateTime: 01\/12\/2022 15:32:20<br>FileName: IMG-20220112-WA0014.jpg", "IndexNo": "9.0", "N": "-1.4581267", "E": "36.9875167", "Altitude_m": "1543.5", "DateTime": "01\/12\/2022 15:32:20", "FileName": "IMG-20220112-WA0014.jpg", "gx_media_links": "https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/pac2t7mff1tbavutqdt9eu5780\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaPhj2iREjDd7F23dj9NIiDpQxspAZoSNi1Ip9j4dLNZAfFkvQt3K1HELpZ7vRAaKcqpHW6xGEcc0Yv-V5sCR6-FZeVCS_plbkElk7VEcA9SSn1zPnP8cta4M-9TiIZdPY3XbJMRdXRIiRcc6wI4SP2fln5GRSbnnE7x8XSgMYDpnxlqRnD-JFLgVW3bb3pW6Mh?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9875167, -1.4581267 ] } },
				{ "type": "Feature", "properties": { "Name": "107.0", "description": "<img src=\"https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/9f304u4h9mepo7drd2h8am51ts\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYMbQB93osQxXF7L9A2ihFf31y9-iYjcbIkiJVEAl1aF7AfbGaPZovwoP4N5ZOUAdUriNsDEayLvG8k1kGZMdL_148i4ex8ErmLGTUGf7ev9mqEUFnnCTZbFFXqseBMFsxRnVyhRvDQtlqCkLY6mMhyMkJ04bNgSgBd4Zfpxl-L_MMRe749SPZ-VLOTnFqOMRPP?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 6<br>N: -1.4545677<br>E: 36.9887167<br>Altitude_m: 1,543.3<br>DateTime: 01\/12\/2022 15:27:32<br>FileName: IMG-20220112-WA0015.jpg", "IndexNo": "6.0", "N": "-1.4545677", "E": "36.9887167", "Altitude_m": "1543.3", "DateTime": "01\/12\/2022 15:27:32", "FileName": "IMG-20220112-WA0015.jpg", "gx_media_links": "https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/9f304u4h9mepo7drd2h8am51ts\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYMbQB93osQxXF7L9A2ihFf31y9-iYjcbIkiJVEAl1aF7AfbGaPZovwoP4N5ZOUAdUriNsDEayLvG8k1kGZMdL_148i4ex8ErmLGTUGf7ev9mqEUFnnCTZbFFXqseBMFsxRnVyhRvDQtlqCkLY6mMhyMkJ04bNgSgBd4Zfpxl-L_MMRe749SPZ-VLOTnFqOMRPP?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9887167, -1.4545677 ] } },
				{ "type": "Feature", "properties": { "Name": "108.0", "description": "<img src=\"https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/j50r9egs8426ld2b6uks79vnos\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vajsin2o933cPMh91NhDr5h7q33WMu0e__s_vlFOMTIyVOvOeGQd9bywqMtfMWf19hcFTXrIIEE8sKo_orrbQ-S4r85oZz9IkA5GzJVh5ev6i3oD6CE1GeDDIIokKwK-1eRSMuzFmPSLu1TqOsIwJtVVIGCMXVfCK9o-jaxtH3HOJwA5GR1ChtIznvQa6RClFQ?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 5<br>N: -1.45468<br>E: 36.9886233<br>Altitude_m: 1,543.3<br>DateTime: 01\/12\/2022 15:26:48<br>FileName: IMG-20220112-WA0016.jpg", "IndexNo": "5.0", "N": "-1.45468", "E": "36.9886233", "Altitude_m": "1543.3", "DateTime": "01\/12\/2022 15:26:48", "FileName": "IMG-20220112-WA0016.jpg", "gx_media_links": "https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/j50r9egs8426ld2b6uks79vnos\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vajsin2o933cPMh91NhDr5h7q33WMu0e__s_vlFOMTIyVOvOeGQd9bywqMtfMWf19hcFTXrIIEE8sKo_orrbQ-S4r85oZz9IkA5GzJVh5ev6i3oD6CE1GeDDIIokKwK-1eRSMuzFmPSLu1TqOsIwJtVVIGCMXVfCK9o-jaxtH3HOJwA5GR1ChtIznvQa6RClFQ?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.9886233, -1.45468 ] } },
				{ "type": "Feature", "properties": { "Name": "109.0", "description": "<img src=\"https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/dj9lme9vuk3akdpk0qtbfeb3ns\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_va-FUUlGwyGsD1E8mr98F-twQ5c2dX9BczqPKZcIz_urD7LAWiG4LmbqFkZWfylUIDGs01v2URfzM2Z_J3dmbP9gRlWNspubY5sE-ZV6IosAnc1xjX6dns7Sp3SDNA7b_BbQ-NCdWapIlKTXJ7Ph2iKPIm4_iWc7L-7IhmaM8metZMzptKTavn6DDkjYl9FFNpi?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 1<br>N: -1.4523183<br>E: 36.987565<br>Altitude_m: 1,543.1<br>DateTime: 01\/12\/2022 15:22:18<br>FileName: IMG-20220112-WA0018.jpg, IMG-20220112-WA0019.jpg<br><br><img src=\"https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/i46rtd05momfusrv5vc38jqk9g\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYct6a9yl8BnXD5BnXu-W_O0aTV55h9VtcXbyFO2E9XCz16KW16w53xfC_CjJtnp_1YzdqSS1EC0wsmWHY28-kuMKkTRjOf_JxaAr95WfQLwtWncN1lpgTHRhVFs7ZGNONwAZPbcwo0NJ2lD0vus1e6GRTqEXeTAEpFXGFeLHpvFGjnk0C4LTJDMGU_HDFQ74db?session=0&fife\" height=\"200\" width=\"auto\" \/>", "IndexNo": "1.0", "N": "-1.4523183", "E": "36.987565", "Altitude_m": "1543.1", "DateTime": "01\/12\/2022 15:22:18", "FileName": "IMG-20220112-WA0018.jpg, IMG-20220112-WA0019.jpg", "gx_media_links": "https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/dj9lme9vuk3akdpk0qtbfeb3ns\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_va-FUUlGwyGsD1E8mr98F-twQ5c2dX9BczqPKZcIz_urD7LAWiG4LmbqFkZWfylUIDGs01v2URfzM2Z_J3dmbP9gRlWNspubY5sE-ZV6IosAnc1xjX6dns7Sp3SDNA7b_BbQ-NCdWapIlKTXJ7Ph2iKPIm4_iWc7L-7IhmaM8metZMzptKTavn6DDkjYl9FFNpi?session=0&fife https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/i46rtd05momfusrv5vc38jqk9g\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYct6a9yl8BnXD5BnXu-W_O0aTV55h9VtcXbyFO2E9XCz16KW16w53xfC_CjJtnp_1YzdqSS1EC0wsmWHY28-kuMKkTRjOf_JxaAr95WfQLwtWncN1lpgTHRhVFs7ZGNONwAZPbcwo0NJ2lD0vus1e6GRTqEXeTAEpFXGFeLHpvFGjnk0C4LTJDMGU_HDFQ74db?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 36.987565, -1.4523183 ] } },
				{ "type": "Feature", "properties": { "Name": "110.0", "description": "IndexNo: 110<br>N: -1.31023028<br>E: 37.14598164<br>Altitude_m: 1,612.8<br>DateTime: 02\/04\/2022 17:05:53<br>FileName: TimePhoto_20220204_170553.jpg", "IndexNo": "110.0", "N": "-1.31023028", "E": "37.14598164", "Altitude_m": "1612.8", "DateTime": "02\/04\/2022 17:05:53", "FileName": "TimePhoto_20220204_170553.jpg", "gx_media_links": null }, "geometry": { "type": "Point", "coordinates": [ 37.14598164, -1.31023028 ] } },
				{ "type": "Feature", "properties": { "Name": "111.0", "description": "<img src=\"https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/9b8qgttpu1193a1bdlmstcs2ek\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY86lGE-3CN_Mt-x9AWNb6cw4Xr3G-5ZZ_3pqJbYQhfgQisB-VZ9XqMeX1FZm3Ru_dlhvXX93Nyd5P4BcLZ5PT9oSq2wEvCxaCSUtpDRJ3ZlBIbH-TBgUnh5MeC9H1bRVyGblKqRkeu6hHVd9vXz5WaJQHqNADke8y--XfNdp1suLU3hB0ImoayztkMDEj9jaUA?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 111<br>N: 1.5342<br>E: 37.1341<br>Altitude_m: <br>DateTime: 05\/31\/2022 12:32:31<br>FileName: TimePhoto_20220531_123231b.jpg", "IndexNo": "111.0", "N": "1.5342", "E": "37.1341", "Altitude_m": "", "DateTime": "05\/31\/2022 12:32:31", "FileName": "TimePhoto_20220531_123231b.jpg", "gx_media_links": "https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/9b8qgttpu1193a1bdlmstcs2ek\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY86lGE-3CN_Mt-x9AWNb6cw4Xr3G-5ZZ_3pqJbYQhfgQisB-VZ9XqMeX1FZm3Ru_dlhvXX93Nyd5P4BcLZ5PT9oSq2wEvCxaCSUtpDRJ3ZlBIbH-TBgUnh5MeC9H1bRVyGblKqRkeu6hHVd9vXz5WaJQHqNADke8y--XfNdp1suLU3hB0ImoayztkMDEj9jaUA?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.1341, 1.5342 ] } },
				{ "type": "Feature", "properties": { "Name": "113.0", "description": "<img src=\"https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/damb4qplonmk52juhqjaj74gpg\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaQwFoozAyEAR0A9aM30iOoQsBm8dNBNpJ5iSHGC4-uupG75LE8RJ_D-on1HixNM_yfnhC4AhOI3nkXCMBPaOts1P-tNP051ZgHl-6Lo5q0gzIggZr3H2WAsMLbq-NsCK__m-2fo6NZXm0XTHWRGShuutdcXIGNnzYvyX8XbA6_ERjBXKaVtueEi8gqPZQgiDKe?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 113<br>N: -1.5385<br>E: 37.1388<br>Altitude_m: <br>DateTime: 05\/31\/2022 12:32:31<br>FileName: TimePhoto_20220531_123830.jpg", "IndexNo": "113.0", "N": "-1.5385", "E": "37.1388", "Altitude_m": "", "DateTime": "05\/31\/2022 12:32:31", "FileName": "TimePhoto_20220531_123830.jpg", "gx_media_links": "https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/damb4qplonmk52juhqjaj74gpg\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaQwFoozAyEAR0A9aM30iOoQsBm8dNBNpJ5iSHGC4-uupG75LE8RJ_D-on1HixNM_yfnhC4AhOI3nkXCMBPaOts1P-tNP051ZgHl-6Lo5q0gzIggZr3H2WAsMLbq-NsCK__m-2fo6NZXm0XTHWRGShuutdcXIGNnzYvyX8XbA6_ERjBXKaVtueEi8gqPZQgiDKe?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.1388, -1.5385 ] } },
				{ "type": "Feature", "properties": { "Name": "114.0", "description": "<img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/m18l0prtboedh9vh0naje4j0a4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaZR0nu3f43-0UuucMUJb9v_mAtaPlIA1ZkjfZyKd8hIpatHD5WHBPf_CSWjNFhsHYii_csEUHgzwEkzq1uhJj6nhA_aXWgk12fFHOFwVbIlWkswdcDFkk9EL60kNoRNAT6ST4kbwqX3oDnQszwa7naDIVdbpwXM4cZ6gl3Z3fOuLXfoaqCU7-4_HPt01Iwm1qE?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 114<br>N: -1.5384<br>E: 37.1385<br>Altitude_m: <br>DateTime: 05\/31\/2022 12:32:31<br>FileName: TimePhoto_20220531_124018.jpg", "IndexNo": "114.0", "N": "-1.5384", "E": "37.1385", "Altitude_m": "", "DateTime": "05\/31\/2022 12:32:31", "FileName": "TimePhoto_20220531_124018.jpg", "gx_media_links": "https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/m18l0prtboedh9vh0naje4j0a4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaZR0nu3f43-0UuucMUJb9v_mAtaPlIA1ZkjfZyKd8hIpatHD5WHBPf_CSWjNFhsHYii_csEUHgzwEkzq1uhJj6nhA_aXWgk12fFHOFwVbIlWkswdcDFkk9EL60kNoRNAT6ST4kbwqX3oDnQszwa7naDIVdbpwXM4cZ6gl3Z3fOuLXfoaqCU7-4_HPt01Iwm1qE?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.1385, -1.5384 ] } },
				{ "type": "Feature", "properties": { "Name": "115.0", "description": "<img src=\"https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/b1nq3rhm46c5u55vohaam96u3c\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaLi7YqZRm4Ez-c_1nqxIe6qNLgJ9QcsoW4kHiYEneVgSev1g5mHIYZWO2E1Yo4hMKWRcJwv8bnkr3EMAo_adyy8LX3YU5nysPmAp5FQVpL01xaed9TQsqyeZ0COZtl587rAMqAGWA4RIGlpJRN8K47LKCMqfH_rZF-mzJbKTbz57cpZGp4sQ_JsIzQEGyguIYs?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 115<br>N: -1.5361<br>E: 37.1475<br>Altitude_m: <br>DateTime: 05\/31\/2022 12:32:31<br>FileName: TimePhoto_20220531_124122.jpg", "IndexNo": "115.0", "N": "-1.5361", "E": "37.1475", "Altitude_m": "", "DateTime": "05\/31\/2022 12:32:31", "FileName": "TimePhoto_20220531_124122.jpg", "gx_media_links": "https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/b1nq3rhm46c5u55vohaam96u3c\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaLi7YqZRm4Ez-c_1nqxIe6qNLgJ9QcsoW4kHiYEneVgSev1g5mHIYZWO2E1Yo4hMKWRcJwv8bnkr3EMAo_adyy8LX3YU5nysPmAp5FQVpL01xaed9TQsqyeZ0COZtl587rAMqAGWA4RIGlpJRN8K47LKCMqfH_rZF-mzJbKTbz57cpZGp4sQ_JsIzQEGyguIYs?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.1475, -1.5361 ] } },
				{ "type": "Feature", "properties": { "Name": "116.0", "description": "<img src=\"https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/5q31bivblvh2nhuqu3l3k4kmtg\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZz92g4k4gnngSdr9sc4IsAdyO90N1kPWJMG4FRIU80V2e7g7VrHfzSR5f5P4uC8mVfPyhCqqnlIopdaqpN8HPpZAl56SYpT0zxqvrajx3tao02JecADDYWPtlUT3LisVHv_k74x34TC1TxBqtkaSKYc6fHJFsplnhhbfdYeCUM0I4MggqlqRs_ELTKSDdEXibG?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 116<br>N: -1.54<br>E: 37.1367<br>Altitude_m: <br>DateTime: 05\/31\/2022 12:32:31<br>FileName: TimePhoto_20220531_124953.jpg", "IndexNo": "116.0", "N": "-1.54", "E": "37.1367", "Altitude_m": "", "DateTime": "05\/31\/2022 12:32:31", "FileName": "TimePhoto_20220531_124953.jpg", "gx_media_links": "https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/5q31bivblvh2nhuqu3l3k4kmtg\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZz92g4k4gnngSdr9sc4IsAdyO90N1kPWJMG4FRIU80V2e7g7VrHfzSR5f5P4uC8mVfPyhCqqnlIopdaqpN8HPpZAl56SYpT0zxqvrajx3tao02JecADDYWPtlUT3LisVHv_k74x34TC1TxBqtkaSKYc6fHJFsplnhhbfdYeCUM0I4MggqlqRs_ELTKSDdEXibG?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.1367, -1.54 ] } },
				{ "type": "Feature", "properties": { "Name": "117.0", "description": "<img src=\"https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/g7tl9mml57pf7rhjpr5up1636s\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vawsjfE9IdzTnlawwiDycXQDJ_HsaHBrvwrcCkRWoz4mhFwnSevDj78afNtjcFBpxPyAdJxsUzelDBEjnafkXbNQpc0QyzeCSfZgxKUr2ABn6U2EEKIjhi5L8Gm0mHS-jge8vyz3Hnj1hjO5nWCrYc-wZB56yoEURPGn2iDwR1LiKuWbkPYbcf29CLlhnu8L0sS?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 117<br>N: -1.5404<br>E: 37.1357<br>Altitude_m: <br>DateTime: 05\/31\/2022 12:32:31<br>FileName: TimePhoto_20220531_130654.jpg", "IndexNo": "117.0", "N": "-1.5404", "E": "37.1357", "Altitude_m": "", "DateTime": "05\/31\/2022 12:32:31", "FileName": "TimePhoto_20220531_130654.jpg", "gx_media_links": "https:\/\/doc-0o-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/g7tl9mml57pf7rhjpr5up1636s\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vawsjfE9IdzTnlawwiDycXQDJ_HsaHBrvwrcCkRWoz4mhFwnSevDj78afNtjcFBpxPyAdJxsUzelDBEjnafkXbNQpc0QyzeCSfZgxKUr2ABn6U2EEKIjhi5L8Gm0mHS-jge8vyz3Hnj1hjO5nWCrYc-wZB56yoEURPGn2iDwR1LiKuWbkPYbcf29CLlhnu8L0sS?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.1357, -1.5404 ] } },
				{ "type": "Feature", "properties": { "Name": "118.0", "description": "<img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/1ica3tarvl2494h323pblufpj0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZhwi8l95Crnmay92Sn5-MOVSpyaAtQhRBU5-eKUgwwGfuzZAGR8uJn_dT2jBFiqbwpJQfSfRNiqglLcZ9bBtC3_H8H_GUdqElZ9vWAopUjOWa7ykpgkeSOSupj69R1MLsrGNSawfc2RJKB29GjTANWCNsE9TXzozV1NVYdSVtiRthW5UnZpSMGtTQeJxIxGMh4?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 118<br>N: -1.5351<br>E: 37.122<br>Altitude_m: <br>DateTime: 05\/31\/2022 12:32:31<br>FileName: TimePhoto_20220531_131450.jpg", "IndexNo": "118.0", "N": "-1.5351", "E": "37.122", "Altitude_m": "", "DateTime": "05\/31\/2022 12:32:31", "FileName": "TimePhoto_20220531_131450.jpg", "gx_media_links": "https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/1ica3tarvl2494h323pblufpj0\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZhwi8l95Crnmay92Sn5-MOVSpyaAtQhRBU5-eKUgwwGfuzZAGR8uJn_dT2jBFiqbwpJQfSfRNiqglLcZ9bBtC3_H8H_GUdqElZ9vWAopUjOWa7ykpgkeSOSupj69R1MLsrGNSawfc2RJKB29GjTANWCNsE9TXzozV1NVYdSVtiRthW5UnZpSMGtTQeJxIxGMh4?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.122, -1.5351 ] } },
				{ "type": "Feature", "properties": { "Name": "119.0", "description": "IndexNo: 119<br>N: -1.5388<br>E: 37.1353<br>Altitude_m: <br>DateTime: 05\/31\/2022 12:32:31<br>FileName: TimePhoto_20220531_131036.jpg", "IndexNo": "119.0", "N": "-1.5388", "E": "37.1353", "Altitude_m": "", "DateTime": "05\/31\/2022 12:32:31", "FileName": "TimePhoto_20220531_131036.jpg", "gx_media_links": null }, "geometry": { "type": "Point", "coordinates": [ 37.1353, -1.5388 ] } },
				{ "type": "Feature", "properties": { "Name": "121.0", "description": "<img src=\"https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/8i64bp769977g4ddp455tn4ans\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vb_f_vgR5OzCpiBvh2MdMvLkFWjanD6iciLH7Wtb7EEIXTzBVm_Jtl5d6n8HLH3BAkzRpCIYcwsBGGG5fqkJP0qhhp3jakJYmWGTDIanhKSN_-z51j1sV20gKett6zVIwgFbswWVRuhfo2KG5cFlK5SKU24yZT9njlpqRO2PSiA8d6iDzgFx99hgGV0x5X1vDaz?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 121<br>N: -1.5402<br>E: 37.1257<br>Altitude_m: <br>DateTime: 05\/31\/2022 12:32:31<br>FileName: TimePhoto_20220531_132207.jpg", "IndexNo": "121.0", "N": "-1.5402", "E": "37.1257", "Altitude_m": "", "DateTime": "05\/31\/2022 12:32:31", "FileName": "TimePhoto_20220531_132207.jpg", "gx_media_links": "https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/8i64bp769977g4ddp455tn4ans\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vb_f_vgR5OzCpiBvh2MdMvLkFWjanD6iciLH7Wtb7EEIXTzBVm_Jtl5d6n8HLH3BAkzRpCIYcwsBGGG5fqkJP0qhhp3jakJYmWGTDIanhKSN_-z51j1sV20gKett6zVIwgFbswWVRuhfo2KG5cFlK5SKU24yZT9njlpqRO2PSiA8d6iDzgFx99hgGV0x5X1vDaz?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.1257, -1.5402 ] } },
				{ "type": "Feature", "properties": { "Name": "120.0", "description": "<img src=\"https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/tml2kcraohj1mvmhlhs30go8tg\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZhyuyH96OGya0ns4Cb_WYd1HbYw_UG1A99LjxlAuA6K85QMK8f18l1lDowlxm0FRFj2YRxwkEY4ioWmqKp8xHAGtNOwWO14Q9zf3Yp0coPo7Z2D28ucP43rFoZq2kRZjqLjX8H2zTKkP4WD_lZXzAsVLQpB7VOj0AJ5B19Shvz8JAipVCDJwxkDFi7VlMQsvLC?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 120<br>N: -1.5359<br>E: 37.1306<br>Altitude_m: <br>DateTime: 05\/31\/2022 12:32:31<br>FileName: TimePhoto_20220531_131757.jpg", "IndexNo": "120.0", "N": "-1.5359", "E": "37.1306", "Altitude_m": "", "DateTime": "05\/31\/2022 12:32:31", "FileName": "TimePhoto_20220531_131757.jpg", "gx_media_links": "https:\/\/doc-14-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/tml2kcraohj1mvmhlhs30go8tg\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZhyuyH96OGya0ns4Cb_WYd1HbYw_UG1A99LjxlAuA6K85QMK8f18l1lDowlxm0FRFj2YRxwkEY4ioWmqKp8xHAGtNOwWO14Q9zf3Yp0coPo7Z2D28ucP43rFoZq2kRZjqLjX8H2zTKkP4WD_lZXzAsVLQpB7VOj0AJ5B19Shvz8JAipVCDJwxkDFi7VlMQsvLC?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.1306, -1.5359 ] } },
				{ "type": "Feature", "properties": { "Name": "123.0", "description": "<img src=\"https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/7omk6saj1b9mm7hera9o77r9k8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaD7jS7I7FX4c7GKXoamC0Cq4RP0EYeyTL0DLHUv0KP2CWVGu5t6jy6jANTY8xhhQNLEu6oGk7FM_3l-OzCsgodzPlsbLalGDuRe5RtfxJ1Iokfx2dBoxQLNMmyNl69fWnhEF9av-zRIz7xJkc47ql1uU26uS3dFvgeh0CicdZgkzW7ZELmC1aK6dl2kH4CPo5U?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 123<br>N: -1.5347<br>E: 37.132<br>Altitude_m: <br>DateTime: 05\/31\/2022 12:32:31<br>FileName: TimePhoto_20220531_132735.jpg", "IndexNo": "123.0", "N": "-1.5347", "E": "37.132", "Altitude_m": "", "DateTime": "05\/31\/2022 12:32:31", "FileName": "TimePhoto_20220531_132735.jpg", "gx_media_links": "https:\/\/doc-0c-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/7omk6saj1b9mm7hera9o77r9k8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaD7jS7I7FX4c7GKXoamC0Cq4RP0EYeyTL0DLHUv0KP2CWVGu5t6jy6jANTY8xhhQNLEu6oGk7FM_3l-OzCsgodzPlsbLalGDuRe5RtfxJ1Iokfx2dBoxQLNMmyNl69fWnhEF9av-zRIz7xJkc47ql1uU26uS3dFvgeh0CicdZgkzW7ZELmC1aK6dl2kH4CPo5U?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.132, -1.5347 ] } },
				{ "type": "Feature", "properties": { "Name": "122.0", "description": "<img src=\"https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/g21kkicv1c50kp96sohcc5dft8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZFNDYcc1s2sRCaYoKIYNhkVfuBOEjuvbQkh_e0gCx3iaIBHz5yfssbLfXm41YEZ5FAV5GJNrRG5ANi1ekibekBi8sxDq709eFcxPrnCxSqa-FHat7YRGVoVpef5Hb5o1_-xTEen15RhMFbJRs2BHDmFZ3UzrRD9RLWVrr-q5QKzT1Nc4N_pirDjnAQiXRwO8IH?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 122<br>N: -1.5334<br>E: 37.131<br>Altitude_m: <br>DateTime: 05\/31\/2022 12:32:31<br>FileName: TimePhoto_20220531_132445.jpg", "IndexNo": "122.0", "N": "-1.5334", "E": "37.131", "Altitude_m": "", "DateTime": "05\/31\/2022 12:32:31", "FileName": "TimePhoto_20220531_132445.jpg", "gx_media_links": "https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/g21kkicv1c50kp96sohcc5dft8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZFNDYcc1s2sRCaYoKIYNhkVfuBOEjuvbQkh_e0gCx3iaIBHz5yfssbLfXm41YEZ5FAV5GJNrRG5ANi1ekibekBi8sxDq709eFcxPrnCxSqa-FHat7YRGVoVpef5Hb5o1_-xTEen15RhMFbJRs2BHDmFZ3UzrRD9RLWVrr-q5QKzT1Nc4N_pirDjnAQiXRwO8IH?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.131, -1.5334 ] } },
				{ "type": "Feature", "properties": { "Name": "125.0", "description": "<img src=\"https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/vlmgs1ajvfhtgoj787ibri4mv8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbjj4aF8VsKYFWGMJJJ4RxfDKnMRE2AVEuU_n9Qf0tJv9CHL1x8R3Y6IgxNbGU167MYUt1gpcOiN7-XUX7AgWEwR7v7NiYJmKkMvnzC0I3IYQVyHjE5caILjVAQf9E4IEEZ4SJ1QS0zF8r0Rhs4W81Kz6fAHDgw-r4bZJBUVqJaNKXMfd8Gx1MAa56iUzn4rfjE?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 125<br>N: -1.5347<br>E: 37.132<br>Altitude_m: <br>DateTime: 05\/31\/2022 12:32:31<br>FileName: TimePhoto_20220531_132735.jpg", "IndexNo": "125.0", "N": "-1.5347", "E": "37.132", "Altitude_m": "", "DateTime": "05\/31\/2022 12:32:31", "FileName": "TimePhoto_20220531_132735.jpg", "gx_media_links": "https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/vlmgs1ajvfhtgoj787ibri4mv8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vbjj4aF8VsKYFWGMJJJ4RxfDKnMRE2AVEuU_n9Qf0tJv9CHL1x8R3Y6IgxNbGU167MYUt1gpcOiN7-XUX7AgWEwR7v7NiYJmKkMvnzC0I3IYQVyHjE5caILjVAQf9E4IEEZ4SJ1QS0zF8r0Rhs4W81Kz6fAHDgw-r4bZJBUVqJaNKXMfd8Gx1MAa56iUzn4rfjE?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.132, -1.5347 ] } },
				{ "type": "Feature", "properties": { "Name": "124.0", "description": "<img src=\"https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/mi3m4c2hhu5l9cef4od7932k0s\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZefnFB_Db-gEs8plRCmSrI3PxHFjCmpz7ilm2zgOR3gyWvr_6BVsfGSfxCxFh1KZigL-QYjzRr_DPUyDwcETOLKQCtqfXHynEDUIl3ibvmHc9ZQQst5GuW54SCBKIe9Xg7NQVYiiu9whDjbaZjAYt2gqcntVMAGwE-0IATgNAsRkFtHIMjpy7C2gaBHPM9zVg3?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 124<br>N: -1.5338<br>E: 37.1322<br>Altitude_m: <br>DateTime: 05\/31\/2022 12:32:31<br>FileName: TimePhoto_20220531_132958.jpg", "IndexNo": "124.0", "N": "-1.5338", "E": "37.1322", "Altitude_m": "", "DateTime": "05\/31\/2022 12:32:31", "FileName": "TimePhoto_20220531_132958.jpg", "gx_media_links": "https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/mi3m4c2hhu5l9cef4od7932k0s\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZefnFB_Db-gEs8plRCmSrI3PxHFjCmpz7ilm2zgOR3gyWvr_6BVsfGSfxCxFh1KZigL-QYjzRr_DPUyDwcETOLKQCtqfXHynEDUIl3ibvmHc9ZQQst5GuW54SCBKIe9Xg7NQVYiiu9whDjbaZjAYt2gqcntVMAGwE-0IATgNAsRkFtHIMjpy7C2gaBHPM9zVg3?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.1322, -1.5338 ] } },
				{ "type": "Feature", "properties": { "Name": "127.0", "description": "<img src=\"https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/i6thudfjeb3pbsfrd2n634rqs4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYSPzXrEC53YrinKvYpLJJ-E15Il-mEQvLufrmTBRNyVGfXKkJ0E1ZBvVq_2TI4aCZNKEgwA4mw5ohMqsj5G4vr6sMJBuNOeWdTc6uv6IMQ-IeOg0q-iix8mF7qU5iuh23MB_LCKP5rlzDzTGDNKuqWyWeMC_wwf5MtIen-MUs5_35HCGFP5T2yVLS_WRwaurLa?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 127<br>N: -1.5319<br>E: 37.1305<br>Altitude_m: <br>DateTime: 05\/31\/2022 12:32:31<br>FileName: TimePhoto_20220531_133352.jpg", "IndexNo": "127.0", "N": "-1.5319", "E": "37.1305", "Altitude_m": "", "DateTime": "05\/31\/2022 12:32:31", "FileName": "TimePhoto_20220531_133352.jpg", "gx_media_links": "https:\/\/doc-0s-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/i6thudfjeb3pbsfrd2n634rqs4\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYSPzXrEC53YrinKvYpLJJ-E15Il-mEQvLufrmTBRNyVGfXKkJ0E1ZBvVq_2TI4aCZNKEgwA4mw5ohMqsj5G4vr6sMJBuNOeWdTc6uv6IMQ-IeOg0q-iix8mF7qU5iuh23MB_LCKP5rlzDzTGDNKuqWyWeMC_wwf5MtIen-MUs5_35HCGFP5T2yVLS_WRwaurLa?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.1305, -1.5319 ] } },
				{ "type": "Feature", "properties": { "Name": "129.0", "description": "<img src=\"https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/unvo33tb4ascqreu5g4v056ojk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaeKTgq-ZkI-BwWf4rwVOAq9_88aIh33_nlCGQ_bvNguWbTGgjBZh4uuPlOwR3Ejbz7Z4HrK7xGANkF7U3WmMvLB2foLrNNBiPVRxT6dM_EnFFLoyL2CA6K3a_i0XgyjSAb8PKIy488zvhn0qYH7KzpIxtC1FxE1xhl39sK-WYpX4wpp9jsRKTzqgz7MHSKNZVC?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 129<br>N: -1.5369<br>E: 37.1349<br>Altitude_m: <br>DateTime: 05\/31\/2022 12:32:31<br>FileName: TimePhoto_20220531_142726.jpg", "IndexNo": "129.0", "N": "-1.5369", "E": "37.1349", "Altitude_m": "", "DateTime": "05\/31\/2022 12:32:31", "FileName": "TimePhoto_20220531_142726.jpg", "gx_media_links": "https:\/\/doc-10-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/unvo33tb4ascqreu5g4v056ojk\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vaeKTgq-ZkI-BwWf4rwVOAq9_88aIh33_nlCGQ_bvNguWbTGgjBZh4uuPlOwR3Ejbz7Z4HrK7xGANkF7U3WmMvLB2foLrNNBiPVRxT6dM_EnFFLoyL2CA6K3a_i0XgyjSAb8PKIy488zvhn0qYH7KzpIxtC1FxE1xhl39sK-WYpX4wpp9jsRKTzqgz7MHSKNZVC?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.1349, -1.5369 ] } },
				{ "type": "Feature", "properties": { "Name": "130.0", "description": "<img src=\"https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/lrb2pbfucmuq3d7s4o6frivan8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZ2DxzTG2jHwDKTkcbvCW6PF8d3JuHfHVhQ9yX99jUIumhtOhUmQvPYo9S2rMQD8MXxyWflPy3MNTofD9mIE7foUSBUhUpfm5iOPad4bu6aMoG0HJd4Uwc_vBjCVoykOlhdHuychPd9xiOXXwvLhmmJ7dzdt8wGPHyZPEEpoaF1ZtGU8B_lmRQ_0TojbQdn4NWd?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 130<br>N: -1.5461<br>E: 37.1448<br>Altitude_m: <br>DateTime: 05\/31\/2022 12:32:31<br>FileName: TimePhoto_20220531_143813.jpg", "IndexNo": "130.0", "N": "-1.5461", "E": "37.1448", "Altitude_m": "", "DateTime": "05\/31\/2022 12:32:31", "FileName": "TimePhoto_20220531_143813.jpg", "gx_media_links": "https:\/\/doc-04-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/lrb2pbfucmuq3d7s4o6frivan8\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vZ2DxzTG2jHwDKTkcbvCW6PF8d3JuHfHVhQ9yX99jUIumhtOhUmQvPYo9S2rMQD8MXxyWflPy3MNTofD9mIE7foUSBUhUpfm5iOPad4bu6aMoG0HJd4Uwc_vBjCVoykOlhdHuychPd9xiOXXwvLhmmJ7dzdt8wGPHyZPEEpoaF1ZtGU8B_lmRQ_0TojbQdn4NWd?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.1448, -1.5461 ] } },
				{ "type": "Feature", "properties": { "Name": "131.0", "description": "<img src=\"https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/ftglodsu52ue2l3lk7k9di5tlo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY8KgbSMr_gX6iixeVT2o1YyYIdXLqDOiJRRBYmRTDJ_Nh--6-34Fib6d3Utc6f30pPKcaOLLhIk1dxw8DGmSI4mHoY0fk1rlYByThg7KVuvoztqil7YTSEFt2BU9u_riqV2p9AdoYXKPUQeE-8ayZ0w7czfxYa10OqopSR_MqoJADeO-It5drFH5uooFU9pI6U?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 131<br>N: -1.5365<br>E: 37.1357<br>Altitude_m: <br>DateTime: 05\/31\/2022 12:32:31<br>FileName: TimePhoto_20220531_144154.jpg", "IndexNo": "131.0", "N": "-1.5365", "E": "37.1357", "Altitude_m": "", "DateTime": "05\/31\/2022 12:32:31", "FileName": "TimePhoto_20220531_144154.jpg", "gx_media_links": "https:\/\/doc-0k-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/ftglodsu52ue2l3lk7k9di5tlo\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vY8KgbSMr_gX6iixeVT2o1YyYIdXLqDOiJRRBYmRTDJ_Nh--6-34Fib6d3Utc6f30pPKcaOLLhIk1dxw8DGmSI4mHoY0fk1rlYByThg7KVuvoztqil7YTSEFt2BU9u_riqV2p9AdoYXKPUQeE-8ayZ0w7czfxYa10OqopSR_MqoJADeO-It5drFH5uooFU9pI6U?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.1357, -1.5365 ] } },
				{ "type": "Feature", "properties": { "Name": "128.0", "description": "<img src=\"https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/00eb53d45bmhtgtd4eo6p67968\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vb94DdMsVUi2jB8a9MPwfRY5GLvquIQhRxxZW8_ZCvxsDCl3CPC0URuvV_Sf9zOPGtDwEOCWB_XWEHmEeP5FuQb18Urm2TpIDLs2gDnmqe8mYhPXZWHGqzAjnruqnFw8Kq2RrVgWx2pAOAlC1FU5DiAdHc4-iPNCvRWye8fxhrolHgfBP8t8l-A4Bq7swmum5xB?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 128<br>N: -1.5297<br>E: 37.1287<br>Altitude_m: <br>DateTime: 05\/31\/2022 12:32:31<br>FileName: TimePhoto_20220531_133746.jpg", "IndexNo": "128.0", "N": "-1.5297", "E": "37.1287", "Altitude_m": "", "DateTime": "05\/31\/2022 12:32:31", "FileName": "TimePhoto_20220531_133746.jpg", "gx_media_links": "https:\/\/doc-00-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/00eb53d45bmhtgtd4eo6p67968\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vb94DdMsVUi2jB8a9MPwfRY5GLvquIQhRxxZW8_ZCvxsDCl3CPC0URuvV_Sf9zOPGtDwEOCWB_XWEHmEeP5FuQb18Urm2TpIDLs2gDnmqe8mYhPXZWHGqzAjnruqnFw8Kq2RrVgWx2pAOAlC1FU5DiAdHc4-iPNCvRWye8fxhrolHgfBP8t8l-A4Bq7swmum5xB?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.1287, -1.5297 ] } },
				{ "type": "Feature", "properties": { "Name": "112.0", "description": "<img src=\"https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/qeh8jhdfqggk9tdkf78l71k26c\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYaAsryyOHmGvLk1M3rXuQ-yI3EiMwEX9kS1dD4dqUjVkyoOfF7RLk6A5n6mop8c2OVc4WVbq3GvsSLSN-fPE1yU3O_w-RwOZA4Jb6YvQasKXLCJDcKXZ0-p1b52TH8LByAiihj557unxhbE65ojgtXu-zSESZWZFUKRYPE97C2Z2zIeUOnSKFv6EeqK_jYASCj?session=0&fife\" height=\"200\" width=\"auto\" \/><br><br>IndexNo: 112<br>N: -1.5342<br>E: 37.1341<br>Altitude_m: <br>DateTime: 05\/31\/2022 12:32:31<br>FileName: TimePhoto_20220531_123651.jpg", "IndexNo": "112.0", "N": "-1.5342", "E": "37.1341", "Altitude_m": "", "DateTime": "05\/31\/2022 12:32:31", "FileName": "TimePhoto_20220531_123651.jpg", "gx_media_links": "https:\/\/doc-08-28-mymaps.googleusercontent.com\/untrusted\/hostedimage\/ihucu48q9m5s1hftel5u85tfdc\/qeh8jhdfqggk9tdkf78l71k26c\/1655320500000\/r6HLfLn0Czsq7edsucfmCPJiUSzwcuDC\/*\/6AIsG_vYaAsryyOHmGvLk1M3rXuQ-yI3EiMwEX9kS1dD4dqUjVkyoOfF7RLk6A5n6mop8c2OVc4WVbq3GvsSLSN-fPE1yU3O_w-RwOZA4Jb6YvQasKXLCJDcKXZ0-p1b52TH8LByAiihj557unxhbE65ojgtXu-zSESZWZFUKRYPE97C2Z2zIeUOnSKFv6EeqK_jYASCj?session=0&fife" }, "geometry": { "type": "Point", "coordinates": [ 37.1341, -1.5342 ] } }
				]
				};

			
				L.geoJson(datatemp).addTo(map);
				layer.addTo(map);
			

//		var polygon3 =	 L.polygon(datatemp);
//		var polygon3 =	 L.polygon(data.value.json);
		polyLayers.push(datatemp);
		
		for(layer of polyLayers) {
			drawnItems.addLayer(layer);
		}
	//	map.addFeature(drawnItems);
		
		console.log("ehlloow2");
		localStorage.setItem("user", JSON.stringify(drawnItems.toGeoJSON(), null, 2) );

		});

		console.log("ehlloow4");

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
