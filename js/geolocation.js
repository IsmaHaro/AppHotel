var geo = {
	exito: function(position){
		var coordenadasHotel = {
			lat: 19.054802,
			lng: -98.225602
		};

		var coordenadasUsuario = {
			lat:  position.coords.latitude,
			lng:  position.coords.longitude
		};

		var map = new google.maps.Map(document.getElementById('mapa'), {
        	zoom: 14,
        	center: coordenadasUsuario
        });

		var directionsDisplay = new google.maps.DirectionsRenderer({
		    map: map
		});

		var request = {
			destination: coordenadasHotel,
		    origin: coordenadasUsuario,
		    travelMode: google.maps.TravelMode.DRIVING
		};

		  // Pass the directions request to the directions service.
		var directionsService = new google.maps.DirectionsService();
		
		directionsService.route(request, function(response, status) {
		    if (status == google.maps.DirectionsStatus.OK) {
		      // Display the route on the map.
		      directionsDisplay.setDirections(response);
		    }
		});
	},
	error: function(error){
		alert("ERROR: "+ error.message);
	},
	obtenerPosicion: function(){
		try{
			navigator.geolocation.getCurrentPosition(geo.exito, geo.error);
		
		}catch(error){
			alert("Error ubicacion: "+error);
		}
	}
};