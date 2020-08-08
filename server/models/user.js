const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidate = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role valido'
};

var Schema = mongoose.Schema;


let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is require']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'The email is require']
    },
    password: {
        type: String,
        required: [true, 'The password is require']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        default: 'USER_ROLE',
        type: String,
        enum: rolesValidate

    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function() {
    let users = this;
    let userObject = users.toObject();
    delete userObject.password;

    return userObject;
}
userSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' })


module.exports = mongoose.model('User', userSchema)