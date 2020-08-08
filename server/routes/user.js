const express = require('express');

const bcrypt = require('bcrypt')

const _ = require('underscore')

const User = require('../models/user')
const { verificarToken, verificarAdmin_Role } = require('../middlewares/autenticacion')

const app = express();

app.get('/usuario', verificarToken, (req, res) => {


    let desde = req.query.desde || 0;
    desde = Number(desde)

    let limite = req.query.limite || 5;
    limite = Number(limite)

    User.find({ status: true }, 'name email role status google img')
        .skip(desde)
        .limit(limite)
        .exec((err, user) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            User.countDocuments({ status: true }, (err, counter) => {
                res.json({
                    ok: true,
                    user,
                    hMany: counter
                })
            })

            // res.json({
            //     ok: true,
            //     user
            // })
        })
})

app.post('/usuario', [verificarToken, verificarAdmin_Role], (req, res) => {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });


    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // userDB.password = null;

        res.json({
            ok: true,
            user: userDB
        })
    })


})

app.put('/usuario/:id', [verificarToken, verificarAdmin_Role], function(req, res) {
    let id = req.params.id;
    let userUpdated = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(id, userUpdated, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        })

    })
})

app.delete('/usuario/:id', [verificarToken, verificarAdmin_Role], (req, res) => {
    let id = req.params.id;

    // User.findByIdAndRemove(id, (err, userRemoved) => {
    let changeStatus = {
        status: false
    }


    User.findByIdAndUpdate(id, changeStatus, { new: true }, (err, userRemoved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!userRemoved) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        };

        res.json({
            ok: true,
            user: userRemoved
        })
    })
})

module.exports = app;