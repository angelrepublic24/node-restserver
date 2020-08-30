"use strict";

var express = require('express');

var fileUpload = require('express-fileUpload');

var app = express();

var User = require('../models/user');

var Product = require('../models/producto');

var fs = require('fs');

var path = require('path');

app.use(fileUpload());
app.put('/upload/:type/:id', function (req, res) {
  var type = req.params.type;
  var id = req.params.id;

  if (!req.files) {
    return res.status(400).send('No files were uploaded');
  } // Validar tipo


  var typeValidate = ['products', 'users'];

  if (typeValidate.indexOf(type) < 0) {
    return res.json({
      ok: false,
      err: {
        message: 'Las tipos permitidas son ' + typeValidate.join(', ')
      }
    });
  }

  var file = req.files.file;
  var nameShort = file.name.split('.');
  var extensiones = nameShort[nameShort.length - 1]; // Extensiones permitidas

  var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

  if (extensionesValidas.indexOf(extensiones) < 0) {
    return res.json({
      ok: false,
      err: {
        message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
        ext: extensiones
      }
    });
  } // Cambiar nombre del archivo


  var fileName = "".concat(id, "-").concat(new Date().getMilliseconds(), ".").concat(extensiones);
  file.mv("uploads/".concat(type, "/").concat(fileName), function (err) {
    if (err) return res.status(500).send(err); // Imagen Cargada

    imageUser(id, res, fileName);
    imageProduct(id, res, fileName);
  });
});

function imageUser(id, res, fileName) {
  User.findById(id, function (err, userDB) {
    if (err) {
      deleteFile(fileName, 'users');
      return res.status(500).json({
        ok: false,
        err: err
      });
    }

    if (!userDB) {
      deleteFile(fileName, 'users');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no existe'
        }
      });
    }

    deleteFile(userDB.img, 'users');
    userDB.img = fileName;
    userDB.save(function (err, userSaved) {
      res.json({
        ok: true,
        user: userSaved,
        img: fileName
      });
    });
  });
}

function imageProduct(id, res, fileName) {
  Product.findById(id, function (err, productDB) {
    if (err) {
      deleteFile(fileName, 'products');
      return res.status(500).json({
        ok: false,
        err: err
      });
    }

    if (!userDB) {
      deleteFile(fileName, 'users');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Producto no existe'
        }
      });
    }

    deleteFile(productDB, 'products');
    productDB.img = fileName;
    productDB.save(function (err, productSaved) {
      res.json({
        ok: true,
        product: productSaved,
        img: fileName
      });
    });
  });
}

function deleteFile(nameFile, type) {
  var pathImage = path.resolve(__dirname, "../../uploads/".concat(type, "/").concat(nameFile));

  if (fs.existsSync(pathImage)) {
    fs.unlinkSync(pathImage);
  }
}

module.exports = app;