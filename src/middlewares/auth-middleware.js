//IMPORT DEPENDENCIES
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        //Obtener header authorizarion 
        const authHeader = req.headers.authorization;

        //Verificar que exista y tenga formato Bearer
        if (!authHeader || ! authHeader.startsWith("Bearer ")) {
            return res.status(401).json ({
                message: "Access denied. Token missing"
            });
        }

        //Extraer token 
        const token = authHeader.split(" ")[1];

        //Verificar token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Guardar datos del usuario en el request
        req.user = decoded; 

        //Continuar la ruta protegida 
        next();

    }catch(error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;

