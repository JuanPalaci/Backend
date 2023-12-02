const debug = require("debug")("index:auth-middleware");
const {verifyToken} = require("../utils/jwt.tools");
const User = require("../models/User.model");


const ROLES = require("../data/roles.constants.json");

const middlewares = {};
const PREFIX = "Bearer";


middlewares.authentication = async (req, res, next) =>{
    try {
        debug("User Authentication");
        //verificar el atuhorization
        const {authorization} = req.headers;
        if(!authorization){
            return res.status(401).json({error: "User not authenticated"});
        }

        //validez del token
       const [prefix, token] = authorization.split(" ");        

        if(prefix !== PREFIX){
            return res.status(401).json({error: "User not authenticated"});
        }

        if(!token){
            return res.status(401).json({error: "User not authenticated"});   
        }

        const payload = await verifyToken (token);

        if(!payload){
            return res.status(401).json({error: "User not authenticated"});   
        }

        const userId = payload["sub"];

        //verificar el usuario
        const user = await User.findById(userId);

        if(!user){
            return res.status(401).json({error: "User not authenticated"});   
        }

        //comparar el token con los otros registrados
        const isTokenValid = user.tokens.includes(token);
        if(!isTokenValid){
            return res.status(401).json({error: "User not authenticated"});   
        }

        //modificar la req, para añadir la info
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal server error"});
    }
}

middlewares.authorization = (roleRequired = ROLES.SYSADMIN) =>{
    return (req, res, next) => {
       //premisa: antes de este middleware debe de haber pasado por la autenticacion
       try {
        const {roles= []}= req.user;

        //verificar si el rol requerido esta en la coleccion
        const isAuth = roles.includes(roleRequired);
        const isSysadmin = roles.includes(ROLES.SYSADMIN);

        //si no est => 403
        if(!isAuth && !isSysadmin){
            return res.status(403).json({error: "Forbidden"});
        }
        //si esta => next()
        next();
       } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal server error"});
    
       }
    }
}

module.exports = middlewares;