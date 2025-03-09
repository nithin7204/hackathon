const bcrypt = require("bcryptjs")
const User = require("./User")

const addUser = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({ id: username.length + 1, username: username, password: hashedPassword })
    await newUser.save()

    return res.status(201).json({ "message": "user created successfully" })
}

const findUser = async (email) => {
    try {
        const user = await User.findOne({ email });
        console.log
        return user || null;  
    } catch (error) {
        console.error("Error finding user:", error);
        return null;
    }
};


module.exports = { addUser, findUser }