process.env.PORT = process.env.PORT || 3000;
// ====================
// Entorno
// ====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ====================
// Vencimiento del token
// ====================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = '48h';


// ====================
// Secret de autenticacion
// ====================
process.env.SECRET = process.env.SECRET || 'secret';



// Base de Datos
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffe'
} else {
    urlDB = 'mongodb+srv://coffe-user:almonte123456@cluster0.h9nof.mongodb.net/coffe'
}
process.env.URLDB = urlDB;

// ====================
// Google Clien ID
// ====================
process.env.CLIENT_ID = process.env.CLIENT_ID || '675524200972-4kmfkevpu16lj30c67iirnl5t56qb29g.apps.googleusercontent.com'