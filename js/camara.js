var camara = {
	exito: function(mediaFiles){
		var ruta = mediaFiles[0].fullPath;
		fn.rutasFotos.push(ruta);
		alert("Foto tomada, ve a la galería");
	},
	error: function(error){
		alert("Error al tomar foto, mensaje: "+error);
	}
	tomarFoto: function(){
		navigator.device.capture.captureImage(camara.exito, camara.error, {limit: 1});
	}
};