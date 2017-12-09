var fn={
	rutasFotos: [],
	init:function(){
		$("#btnRegistrar").tap(fn.registrarUsuario);
		$("#formulario1 a").tap(fn.reserva1);
		$("#btnSiguiente").tap(fn.siguienteReserva1);
		$("#btnReservar").tap(fn.hacerReserva);
		$("#btnHistorial").tap(fn.historial);
		$("#btnGaleria").tap(fn.galeria);
		$("#btnUbicacion").tap(fn.ubicacion);
		$("#btnIniciarSesion").tap(fn.iniciarSesion);
		$("#btnSalir").tap(fn.salir);
		$("#btnFoto").tap(fn.tomarFoto);
	},

	deviceready:function(){
		document.addEventListener("deviceready",fn.init,false);
	},

	tomarFoto: function(){
		camara.tomarFoto();
	},
	salir: function(){
		firebase.auth().signOut().then(function() {
		 	window.location.href = "#registro";

		}).catch(function(error) {
			alert("No se pudo salir de la sesión");
		});
	},

	iniciarSesion: function(){
		var email    = $("#iniciosesion .email").val();
		var password = $("#iniciosesion .password").val();

		firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
			window.location.href = "#inicio";

		}).catch(function(error) {
		 	console.log(error);
		 	alert("Email o contraseña incorrecta");
		  	var errorCode    = error.code;
		  	var errorMessage = error.message;
		});

	},

	ubicacion: function(){
console.log("hola");		
		geo.obtenerPosicion();
		
		$("#ubicacion").trigger("create");
		window.location.href = "#ubicacion";
	},
	
	galeria: function(){	
		var arregloFotos = ["1", "2", "3", "4", "5", "6", "7", "8"];
		var tabla        = "";
		var cajasFotos   = "";
		var bandera      = 1;

		/*
		 * Unir arreglo de fotos con el arreglo
		 * de fotos tomadas por el usuario
		 */
		 arregloFotos = arregloFotos.concat(rutasFotos);
		
		arregloFotos.forEach(function(nombreFoto){
			if(bandera){
				tabla  += "<div class='ui-block-a'> <a href='#"+nombreFoto+"' data-rel='popup' data-position-to='window'><img class='foto-galeria' src='img/galeria/"+nombreFoto+".jpg'></a> </div>"
				bandera = 0;

			}else{
				tabla  += "<div class='ui-block-b'> <a href='#"+nombreFoto+"' data-rel='popup' data-position-to='window'><img class='foto-galeria' src='img/galeria/"+nombreFoto+".jpg'></a> </div>"
				bandera = 1;
			}
			
			cajasFotos += "<div id='"+nombreFoto+"' data-role='popup' data-overlay-theme='b' data-theme='b'><a href='#' data-rel='back' class='ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right'>Close</a> <img src='img/galeria/"+nombreFoto+".jpg'> </div>"
		});

		tabla += cajasFotos;
	
		$("#caja_galeria").html(tabla);
		//$("#galeria").trigger("create");
		window.location.href = "#galeria";
	},

	historial: function(){
		$("#historial ul").html("");
		var lista    = "";
		var contador = 0;
		var user_id  = firebase.auth().currentUser.uid;
		var ruta_res = firebase.database().ref('Reservaciones/'+user_id);
		ruta_res.on('child_added', function(reservacion){
			contador++;
			console.log(reservacion.val());
			var cuerpoPopup = "<h2>Reservación</h2>"
							 +"<table>"
							 +"<tr>"
							 	+"<td>Fecha</td><td> "+reservacion.val().fecha+"</td>"
							 +"</tr>"
							 +"<tr>"
							 	+"<td>Tipo de habitación</td><td> "+reservacion.val().tipoHabitacion+"</td>"
							 +"</tr>"
							 +"<tr>"
							 	+"<td>Número de habitaciones</td><td> "+reservacion.val().numeroHabitaciones+"</td>"
							 +"</tr>"
							 +"<tr>"
							 	+"<td>Número de días</td><td> "+reservacion.val().numeroDias+"</td>"
							 +"</tr>"
							 +"<tr>"
							 	+"<td>Número de personas</td><td> "+reservacion.val().numeroPersonas+"</td>"
							 +"</tr>"
							 +"</table>";

			$("#historial ul").append("<li><a href='#reservacion"+contador+"' data-rel='popup' data-position-to='window'> Reservación: "+reservacion.val().tipoHabitacion+" - " +reservacion.val().fecha+"</a></li>");
			$("#historial ul").append("<div id='reservacion"+contador+"' data-role='popup' data-overlay-theme='b' data-theme='b'><a href='#' data-rel='back' class='ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right'>Close</a>"+cuerpoPopup+"</div>")
			
			$("#historial").trigger("create");
		});
		
		window.location.href = "#historial";
	},

	hacerReserva: function(){		
		/*
		 * Obtener todos los datos en variables
		 */
		var reservacion                = {};
		reservacion.tipoHabitacion     = $("#reserva1").attr("tipo-habitacion");
		reservacion.numeroPersonas     = $("#reservaNumPersonas").val();
		reservacion.numeroDias         = $("#reservaNumDias").val();
		reservacion.numeroHabitaciones = $("#reservaNumHabitaciones").val();
		reservacion.fecha              = new Date();
		reservacion.fecha              = reservacion.fecha.getDate() + "/" + (parseInt(reservacion.fecha.getMonth()) + 1) + "/" + reservacion.fecha.getFullYear();

		/*
		 * GUARDAR RESERVACION EN BD
		 */
		var user_id  = firebase.auth().currentUser.uid;
		var ruta_res = firebase.database().ref().child('Reservaciones/'+user_id);
		ruta_res.push(reservacion);

		/*
		 * OBTENER DATOS DE LOCALSTORAGE
		 */
		 var reservacionesLocal =  window.localStorage.getItem("reservaciones");
		console.log(reservacionesLocal);

		if(reservacionesLocal == null){
			var arregloReservaciones = [];	
			arregloReservaciones.push(reservacion);

			var arregloCadena = JSON.stringify(arregloReservaciones);
			window.localStorage.setItem("reservaciones", arregloCadena);

		}else{
			/*
			 * Ya hay reservaciones en el almacenamiento
			 * Por tanto debemos de agregar y no sobreescribir
			 */
			var arregloObjetos = JSON.parse(reservacionesLocal);
			console.log(arregloObjetos);

			arregloObjetos.push(reservacion);
			var arregloCadena = JSON.stringify(arregloObjetos);
			window.localStorage.setItem("reservaciones", arregloCadena);
		}


		/*
		 * Resetear datos del formulario
		 * de reservaciones
		 */
		$("#formulario1 a").css("background-color", "");
		$("#reserva1").attr("tipo-habitacion", "");
		$("#reserva2 select").prop("selectedIndex", 0).selectmenu("refresh", true);

		alert("Ha quedado hecha tu reservación.");
		window.location.href = "#inicio";
	},

	siguienteReserva1: function(){
		var tipohab = $("#reserva1").attr("tipo-habitacion");
		
		try{
			if(tipohab == ""){
				throw new Error("selecciona una opción");
			}

			window.location.href = "#reserva2";
		
		}catch(error){
			alert(error);
		}
	},

	reserva1:function(){
		$("#formulario1 a").css("background-color","");
		$(this).css("background-color","#38C");
		var tipo=($(this).prop("id"));
		$("#reserva1").attr("tipo-habitacion",tipo);   
	},

	nuevaReservacion:function(){
		//alert("hola");
		var tipoh=($("#reserva1").attr("tipo-habitacion"));
		//console.log(tipoh);
		try{
			if (tipoh==""){
				throw new Error("Debe seleccionar una opción");
		    }
		    
		    window.location.href="#reserva2"
		}
		catch(error){
			alert(error);
		}
		
	},

	registrarUsuario:function(){
		//selecciona un elemento de la pantalla de registro
		var nombre   = $("#registro .nombre").val();
		var email    = $("#registro .email").val();
		var password = $("#registro .password").val();
		/*console.log(nombre);
		console.log(email);
		console.log(password);*/
		try{
			if(nombre == ""){
				throw new Error("El nombre esta vacio");
			}
			if(email == ""){
				throw new Error("El email esta vacio");
			}
			if(password == ""){
				throw new Error("La contraseña esta vacia");
			}

			fn.nuevoUsuario(nombre, email, password);
		}
		catch(error){
			alert(error);
		}

	},
	nuevoUsuario: function(nombre, email, password){
		var usuario      = {};
		usuario.nombre   = nombre;
		usuario.email    = email;
		usuario.password = password;

		/*
		 * GUARDAR EN BASE DE DATOS
		 */
		firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
			$("#registro .nombre").val("");
			$("#registro .email").val("");
			$("#registro .password").val("");

			window.location.href = "#inicio";

		}).catch(function(error) {
			console.log(error);			
			
			alert("Error al registrar");
			var errorCode    = error.code;
		  	var errorMessage = error.message;
		});
	}
};

//COMPILAR PARA CELULAR
//fn.deviceready();

//PRUEBAS EN NAVEGADOR
fn.init();
