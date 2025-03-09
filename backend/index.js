const express = require("express")
const app = express()
const cors = require("cors")
const authRoutes = require("./routes/auth")
const authMiddleware = require("./middleware/authMiddleware")
const port = 4000
const connectDB =require("./config/db")
const reviewsRoutes = require("./routes/reviewsRoutes")
const questionRoutes = require("./routes/questionRoute")

connectDB()

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


app.use(cors())
app.use("/api/auth", authRoutes)
app.use("/api/resume",reviewsRoutes)
app.use("/api/questions",questionRoutes)

app.use("/api/protected", authMiddleware, (req, res) => {
    res.json({ "message": `Hello user ${req.user.id}, you are authenticated successfully` });
});

app.get("/", (req, res) => {
    return res.json({ "message": "server is running successfully" })
})
app.listen(port, () => console.log("Server is running on port: ", port))
