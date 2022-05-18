'use restrict'
var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;


//mongoose.set("useFindAndModify", false);//Desactiva metodos antiguos
mongoose.Promise = global.Promise;//Evita falla en la conexion a la bd
mongoose.connect('mongodb://localhost:27017/PruebaDB', { useNewUrlParser: true })
	.then(() => {
		console.log("Conexion a la base de datos correcta!!!");

		//crear servidor y escuchar peticiones

		app.listen(port, () => {
			console.log('Servidor corriendo en http://localhost:' + port);
		})
	});