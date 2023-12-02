const User = require("../models/User.model");
const ROLES = require("../data/roles.constants.json");
const {createToken, verifyToken} = require("./../utils/jwt.tools");

const controller ={};

controller.register = async(req, res, next) =>{ 
    try {
        //obentener la info
        const {username, email, password,tags}= req.body;
        //verificar la existencia del correo y el user
        const user =
        await User.findOne({ $or: [{username: username}, {email: email}]});

        if(user){
            return res.status(409).json({error: "User already exists!"});
        }
        //sino existe lo creamos
        const newUser = new User({
            username: username,
            email: email,
            password: password,
            tags: tags,
            roles: [ROLES.USER]
        })

        await newUser.save();

        return res.status(201).json({message: "User registered"})

    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

controller.login = async(req, res,next) =>{
    try {
        //obtener la info => identificador, password

        const {identifier, password} = req.body;
        //verificar si el usuario existe
        const user = 
        await User.findOne({ $or: [{username: identifier}, {email: identifier}]});
        //si no existe, retornar 404
        if(!user){
            return res.status(404).json({error: "User not found"});
        }

        //si existe, verificamos la password
        //si la password no coincide => 401
        if(!user.comparePassword(password)){
            return res.status(401).json({error: "Incorrect password"});
        }

        //si las password coincide => loggeamos(TODO)
        //Crear un token
        const token = await createToken(user._id);
        //almacenar token
        let _tokens = [...user.tokens];
        //verificar la integridad de los token actuales - max 5 sesiones 
        const _verifyPromises = _tokens.map(async (_t) => {
            const status = await verifyToken(_t);
            return status ? _t : null;
        });

        _tokens = (await Promise.all(_verifyPromises))
        .filter(_t => _t)
        .slice(0,4);

        _tokens = [token, ..._tokens];
        user.tokens = _tokens;

        await user.save();
        //devolver token
        return res.status(200).json({token});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

controller.tags = async (req, res, next) => {
    try {
  
      // Accede a los tags del usuario desde req.user (ajusta según tu implementación)
      const userTags = await req.user.tags;
  
      // Retorna los tags del usuario en la respuesta
      res.status(200).json({ tags: userTags });
    } catch (error) {
      next(error);
    }
  };
  

module.exports = controller;