const express = require('express');
const fileUpload = require('express-fileUpload');
var app = express();

const User = require('../models/user');
const Product = require('../models/producto');

const fs = require('fs');
const path = require('path')

app.use(fileUpload());

app.put('/upload/:type/:id', (req, res) => {
    let type = req.params.type;
    let id = req.params.id

    if (!req.files) {
        return res.status(400).send('No files were uploaded')
    }

    // Validar tipo
    let typeValidate = ['products', 'users'];
    if(typeValidate.indexOf(type) < 0){
        return res.json({
            ok: false,
            err: {
                message: 'Las tipos permitidas son ' + typeValidate.join(', ')

            }
        })
    }


    let file = req.files.file
    let nameShort = file.name.split('.')
    let extensiones = nameShort[nameShort.length - 1]

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']

    if (extensionesValidas.indexOf(extensiones) < 0) {
        return res.json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extensiones

            }
        })
    }

    // Cambiar nombre del archivo
    let fileName = `${ id }-${new Date().getMilliseconds()}.${ extensiones }`

    file.mv(`uploads/${type}/${fileName}`, function(err) {
        if (err)
            return res.status(500).send(err);

            // Imagen Cargada
        
            if(type === 'users'){
                imageUser(id, res, fileName)
            }else{
                imageProduct(id, res, fileName)
            }
            
    });
})

function imageUser(id, res, fileName){
    User.findById(id, (err, userDB)=>{
        if(err) {
            deleteFile(fileName, 'users')
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!userDB){
            deleteFile(fileName, 'users')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        deleteFile(userDB.img, 'users')

        userDB.img = fileName;

        userDB.save((err, userSaved)=>{
            res.json({
                ok: true,
                user: userSaved,
                img: fileName
            })
        })
    })
}

function imageProduct(id, res, fileName){
    Product.findById(id, (err, productDB)=>{
        if(err) {
            deleteFile(fileName, 'products')
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!productDB){
            deleteFile(fileName, 'products')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }

        deleteFile(productDB, 'products')
        productDB.img = fileName

        productDB.save((err, productSaved)=>{
            res.json({
                ok: true,
                product: productSaved,
                img: fileName
            })
        })
    })
}

function deleteFile(nameFile, type){
    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${nameFile}`);

    if(fs.existsSync(pathImage)){
        fs.unlinkSync(pathImage)
    }
}

module.exports = app;