const {validateToken} = require('../config/jwt')

const authMiddleware = (req,res,next) =>{
    
    const token = req.header("Authorization")

    if(!token)
    {
        return res.status(404).json({"mesage":"Acess denied login first"})
    }

    try{
        const verifed = validateToken(token.replace("Bearer ",""))
        req.user = verifed   

        next();  //Follows to next route.
    }
    catch(err)
    {
        console.log(err)
        return res.status(403).json({"message":"unauthorized"})
    }
}

module.exports = authMiddleware