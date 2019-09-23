require('./config/config');

const express = require('express')
const mongoose = require('mongoose');
const app = express()
const bodyParser = require('body-parser')
    // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'));



//Conexion a la base de datos
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err; //Si no se logra conectar a la bd y muestra el error
    console.log('Base de datos Online'); //Conexion exitosa

});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto ', process.env.PORT);
})