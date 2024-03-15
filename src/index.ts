import express, { Express, Request, Response } from "express";
import cors from 'cors'
import compression from "compression";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
import { routes } from "./router";
import path from "path";
import errorHandler from "./middleware/errorHandler";
dotenv.config()




const app: Express = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


// middleware
app.use(compression())
app.use(cookieParser())
app.use(cors())

// file upload directions
app.use('/uploads', express.static(path.join(__dirname, '../upload')));
// routes
app.use("/v1/", routes)

//global error handler
app.use(errorHandler)


const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})

process.on("unhandledRejection", (err) => {
    console.log(`Shut down the server for ${err}`)
    console.log(`Shut down server due to Unhandled promise rejection`);

    server.close(() => {
        process.exit(1)
    })
})