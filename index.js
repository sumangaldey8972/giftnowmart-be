const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const fileUpload = require("express-fileupload")

const { app_configuration } = require("./config/app.config")
const connect_mongodb = require("./connections/mongo.connection")
const { authRoutes, roleRoutes, categoryRoutes } = require("./routes")
const cookieParser = require("cookie-parser")

function setupMiddleware(app) {
    dotenv.config()
    app.use(express.json({ limit: "1024mb" }))
    app.use(cors({ origin: true, credentials: true }))
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser())
    app.use(fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    }));

}

function setupRoutes(app) {
    app.use("/auth", authRoutes);
    app.use("/role", roleRoutes);
    app.use("/category", categoryRoutes)

    app.get("/", (req, res) => {
        return res.send({
            status: true,
            message: `${app_configuration.APP_NAME} Backend is running`,
            version: '3.0.0.0',
            date: "09th Jan 2026"
        })
    })
}


const app = express()
setupMiddleware(app)
setupRoutes(app)

connect_mongodb().then(() => {
    app.listen(app_configuration.PORT, () => {
        console.log(`${app_configuration.APP_NAME} Server started at PORT - ${app_configuration.PORT}`)
    })
}).catch(() => {
    console.log('could not start the server')
})
