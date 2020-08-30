const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let productoSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    priceUnit: {
        type: Number,
        required: [true, 'El precio unitario es obligatorio']
    },
    description: {
        type: String,
        required: false
    },
    img: {
        type: String,
        required: false
    },
    avaliable: {
        type: Boolean,
        required: false,
        default: true
    },
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Categoria'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true

    }

})


module.exports = mongoose.model('Producto', productoSchema)