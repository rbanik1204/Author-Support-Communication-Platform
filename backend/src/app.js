import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import { logger } from "./middlewares/logger.middleware.js"
import { globalError } from "./middlewares/globalError.middleware.js"
import { router as authRouter } from "./routes/auth.routes.js"
import dotenv from "dotenv"
dotenv.config()
const app = express()
//custom middleware for HTTP method, route logging
app.use(logger)
//ESM work around __dirname doesnt exist
const __filename = fileURLToPath(import.meta.url) //path of the current file that along with app.js
const __dirname = path.dirname(__filename) //gives the exact path by stripping file name
//Built-in middlewares for request body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//routes
app.use("/api", authRouter)

app.use(globalError)
export default app
