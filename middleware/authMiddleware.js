import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const checkAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.usuario = await Usuario.findById(decoded.id).select('-password -token -confirmado');
            
            return next();
        } catch (error) {
            const e = new Error('Token no válido');
            return res.status(403).json({ msg: e.message });
        }
    }

    const error = new Error('Token no válido o inexistente');
    // return res.status(403).json({ msg: error.message });
    res.status(403).json({ msg: error.message });

    next();
}

export default checkAuth;
