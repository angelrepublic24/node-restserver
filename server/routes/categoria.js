const express = require('express')

let { verificarToken, verificarAdmin_Role } = require('../middlewares/autenticacion')

const app = express();

let Categoria = require('../models/categorias')


//======================
// Mostrar todas las categorias
//======================

app.get('/categorias', verificarToken, (req, res) => {

    Categoria.find()
        .sort('description')
        .populate('user', 'name email')
        .exec((err, cat) => {
            if (err) return res.status(400).json({
                ok: false,
                err
            })
            res.json({
                ok: true,
                cat
            })
        })
})


//======================
// Mostrar una categoria por ID
//======================
app.get('/categoria/:id', (req, res) => {
    let id = req.params.id

    Categoria.findById(id, (err, cat) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        })
        if (!cat) return res.status(404).json({
            ok: false,
            err: {
                message: 'El id no es existe'
            }
        })
        res.json({
            ok: true,
            cat
        })
    })
})

//======================
// Crear Categoria
//======================
app.post('/categoria', verificarToken, (req, res) => {
    let body = req.body
    let cat = new Categoria({
        description: body.description,
        user: req.user._id
    })
    console.log(req.user);
    cat.save((err, catSaved) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        })
        if (!catSaved) return res.status(400).json({
            ok: false,
            err
        })
        res.json({
            ok: true,
            cat: catSaved
        })
    })
})

//======================
// Actualizar Categoria
//======================
app.put('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id
    let body = req.body;

    let descCategoria = {
        description: body.description
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, catUploaded) => {
        if (err) return res.status(400).json({
            ok: false,
            err
        })
        if (!catUploaded) return res.status(404).json({
            ok: false,
            err
        })
        res.json({
            ok: true,
            catUploaded
        })
    })
})

//======================
// Borrar Categoria
//======================

app.delete('/categoria/:id', [verificarToken, verificarAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, catRemoved) => {
        if (err) return res.status(400).json({
            ok: false,
            err
        })
        if (err) return res.status(404).json({
            ok: false,
            err: {
                message: 'No existe categoria con es id'
            }
        })
        res.json({
            ok: true,
            message: 'Categoria borrada',
            catRemoved
        })
    })


})


module.exports = app