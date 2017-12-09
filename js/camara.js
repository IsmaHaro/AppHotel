var camara = {
	exito: function(mediaFiles){
		var ruta = mediaFiles[0].fullPath;
		fn.rutasFotos.push(ruta);
		alert("Foto tomada, ve a la galería: "+ruta);
	},
	error: function(error){
		alert("Error al tomar foto, mensaje: "+error);
	},
	tomarFoto: function(){
		try{
			navigator.device.capture.captureImage(camara.exito, camara.error, {limit: 1});
		
		}catch(error){
			alert("Error iniciando camara: "+error);
		}
	}
};