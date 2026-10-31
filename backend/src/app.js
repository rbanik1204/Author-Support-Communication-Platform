import express from "express"
import path from "path"
import cors from "cors"
import { fileURLToPath } from "url"
import cookieParser from "cookie-parser"
import sessionMiddleware from "./configs/session.config.js"
import { logger } from "./middlewares/logger.middleware.js"
import { globalError } from "./middlewares/globalError.middleware.js"
import { router as homeRouter } from "./routes/home.routes.js"
import { router as authRouter } from "./routes/auth.routes.js"
const app = express()

//custom middleware for HTTP method, route logging
app.use(logger)
//ESM work around __dirname doesnt exist
const __filename = fileURLToPath(import.meta.url) //path of the current file that along with app.js
const __dirname = path.dirname(__filename) //gives the exact path by stripping file name

//Built-in middlewares for request body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cookieParser())
app.set("trust proxy", 1)
//CORS
const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
)
app.use(sessionMiddleware)

//routes
app.use("/auth", authRouter)
app.use("/", homeRouter)
app.use(globalError)
export default app
