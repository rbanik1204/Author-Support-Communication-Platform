import express from "express"
import { requireRole } from "../middlewares/auth.middleware.js"
import { handleGetAuthorBooks } from "../controllers/book.controller.js"

const router = express.Router()

router.get("/", requireRole("author"), handleGetAuthorBooks)

export { router }
