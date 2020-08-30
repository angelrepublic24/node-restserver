"use strict";

var express = require('express');

var bcrypt = require('bcrypt');

var _ = require('underscore');

var User = require('../models/user');

var _require = require('../middlewares/autenticacion'),
    verificarToken = _require.verificarToken,
    verificarAdmin_Role = _require.verificarAdmin_Role;

var app = express();
app.get('/usuario', verificarToken, function (req, res) {
  var desde = req.query.desde || 0;
  desde = Number(desde);
  var limite = req.query.limite || 5;
  limite = Number(limite);
  User.find({
    status: true
  }, 'name email role status google img').skip(desde).limit(limite).exec(function (err, user) {
    if (err) {
      return res.status(400).json({
        ok: false,
        err: err
      });
    }

    User.countDocuments({
      status: true
    }, function (err, counter) {
      res.json({
        ok: true,
        user: user,
        hMany: counter
      });
    }); // res.json({
    //     ok: true,
    //     user
    // })
  });
});
app.post('/usuario', [verificarToken, verificarAdmin_Role], function (req, res) {
  var body = req.body;
  var user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });
  user.save(function (err, userDB) {
    if (err) {
      return res.status(400).json({
        ok: false,
        err: err
      });
    } // userDB.password = null;


    res.json({
      ok: true,
      user: userDB
    });
  });
});
app.put('/usuario/:id', [verificarToken, verificarAdmin_Role], function (req, res) {
  var id = req.params.id;

  var userUpdated = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

  User.findByIdAndUpdate(id, userUpdated, {
    "new": true,
    runValidators: true
  }, function (err, userDB) {
    if (err) {
      return res.status(400).json({
        ok: false,
        err: err
      });
    }

    res.json({
      ok: true,
      user: userDB
    });
  });
});
app["delete"]('/usuario/:id', [verificarToken, verificarAdmin_Role], function (req, res) {
  var id = req.params.id; // User.findByIdAndRemove(id, (err, userRemoved) => {

  var changeStatus = {
    status: false
  };
  User.findByIdAndUpdate(id, changeStatus, {
    "new": true
  }, function (err, userRemoved) {
    if (err) {
      return res.status(400).json({
        ok: false,
        err: err
      });
    }

    ;

    if (!userRemoved) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no encontrado'
        }
      });
    }

    ;
    res.json({
      ok: true,
      user: userRemoved
    });
  });
});
module.exports = app;