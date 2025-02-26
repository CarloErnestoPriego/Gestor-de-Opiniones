'Hecho por cpriego'

import { Schema, model} from 'mongoose';

const userSchema = Schema({
    name: {
        type: String,
        required: [true, 'el nombre es requerido'],
        maxLenght: [25, 'el nombre no puede ser mayor a 25 caracteres']
    },
    surname: {
        type: String,
        required: [true, 'el nombre es requerido'],
        maxLenght: [25, 'el apellido es requerido']
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        requred: [true, 'el correo es requerido'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'la contraseña es requerida'],
        minLenght: [8, 'La contraseña debe ser de almenos 8 caracteres']
    },
    profilePicture:{
        type: String
    },
    phone: {
        type: String,
        minLenght: [8, 'el numero de telefono debe tener 8 digitos'],
        maxLenght: [8, 'el numero de telefono debe tener 8 digitos'],
        required: true
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER']
    },
    estado: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

userSchema.methods.toJSON = function () {

    const {__v, password, _id, ...usuario} = this.toObject();

    usuario.uid = _id;

    return usuario
}

export default model('User', userSchema)