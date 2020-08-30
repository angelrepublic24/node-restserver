const jwt = require('jsonwebtoken');

// =====================
// Verificar Token
// =====================

let verificarToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        req.user = decoded.user;
        next();
    })
}

let verificarAdmin_Role = (req, res, next) => {
    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
        return
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })

    }
}

let verificarTokenImg = (req, res, next) => {
    let token = req.query.token;
    
    
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        req.user = decoded.user;
        next();
    })
}


module.exports = {
    verificarToken,
    verificarAdmin_Role,
    verificarTokenImg
}