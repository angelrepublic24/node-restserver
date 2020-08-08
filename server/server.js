require('../config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

var bodyParser = require('body-parser')


// Parse application /x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Configuracion Global de rutas
app.use(require('./routes/index'))

// parse application json
app.use(bodyParser.json())







mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw new Error(err)

    console.log('Base de datos Online');
})







app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`);
});