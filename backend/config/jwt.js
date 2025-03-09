const jwt = require("jsonwebtoken")
require("dotenv").config()

const generateToken = (user) =>{
     const token = jwt.sign(
        {id:user.id},process.env.JWT_SECRET,{expiresIn :"2h"}
    )
    return token;
}

const validateToken = (token) =>{
    return jwt.verify(token,process.env.JWT_SECRET)
}

module.exports={generateToken,validateToken}