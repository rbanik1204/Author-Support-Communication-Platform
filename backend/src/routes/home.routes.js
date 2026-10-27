import express from "express"
import { handleHomePage } from "../controllers/home.controller.js"

const router = express.Router()
router.all("/", handleHomePage)

export { router }
