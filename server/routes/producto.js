const express = require('express');

const { verificarToken, verificarAdmin_Role } = require('../middlewares/autenticacion')

var app = express();
var Producto = require('../models/producto');


// =======================
// Obtener Producto
// =======================
app.get('/productos', verificarToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde)

    let limite = req.query.limite || 5;
    limite = Number(limite)

    Producto.find({ avaliable: true })
        .populate('user', 'name email')
        .populate('categoria', 'description')
        .skip(desde)
        .limit(5)
        .exec((err, productDB) => {
            if (err) return res.status(500).json({
                ok: false
            })
            Producto.countDocuments({ avaliable: true }, (err, counter) => {
                res.json({
                    ok: true,
                    productDB,
                    hMany: counter
                })
            })
        })
})


// =======================
// Obtener Producto
// =======================
app.get('/productos/:id', verificarToken, (req, res) => {
    let id = req.params.id

    Producto.findById(id, (err, productDB) => {
        if (err) return res.status(500).json({
            ok: false
        })
        if (!productDB) return res.status(404).json({
            ok: false,
            err: {
                message: 'Este producto no existe'
            }
        })
        res.json({
            productDB
        })
    })
})

// =======================
// Buscar Producto
// =======================
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {
    let termino = req.params.termino;

    // Buscar en la base de datos por expresiones regulres (no hay que poner todo el nombre correctamente)
    let regExp = new RegExp(termino, 'i');

    Producto.find({ name: regExp })
        .populate('categoria', 'description')
        .exec((err, producto) => {
            if (err) return res.status(500).json({
                ok: false
            })
            if (!producto) return res.status(404).json({
                ok: false,
                err: {
                    message: 'Este producto no existe'
                }
            })
            res.json({
                ok: true,
                producto
            })
        })

})

// =======================
// Crear Producto
// =======================
app.post('/productos', verificarToken, (req, res) => {
    let body = req.body;
    let product = new Producto({
        user: req.user._id,
        name: body.name,
        priceUnit: body.priceUnit,
        description: body.desciption,
        avaliable: body.avaliable,
        category: body.category

    })
    product.save((err, productDB) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        })
        res.status(201).json({
            ok: true,
            product: productDB
        })
    })

})


// =======================
// Actualizar Producto
// =======================
app.put('/productos/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;


    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productUploaded) => {
        if (err) return res.status(500).json({
            ok: false,
            err: {
                message: 'Hubo un error'
            }
        })
        if (!productUploaded) return res.status(400).json({
            ok: false,
            err: {
                message: 'Este producto no existe'
            }
        })
        res.json({
            ok: true,
            productUploaded
        })

    })

})

app.delete('/productos/:id', [verificarToken, verificarAdmin_Role], (req, res) => {
    let id = req.params.id

    let changeAvaliable = {
        avaliable: false
    }
    Producto.findByIdAndUpdate(id, changeAvaliable, { new: true, runValidators: true }, (err, productRemoved) => {
        if (err) return res.status(500).json({
            ok: false
        })
        if (!productRemoved) return res.status(404).json({
            ok: false,
            err: {
                message: 'Este producto no existe'
            }
        })
        res.json({
            ok: true,
            productRemoved,
            message: 'Producto eliminado'
        })
    })
})



module.exports = app;