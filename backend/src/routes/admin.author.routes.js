import express from "express"
import { requireRole } from "../middlewares/auth.middleware.js"
import { handleCreateAuthor } from "../controllers/admin.author.controller.js"

const router = express.Router()

router.post("/", requireRole("admin"), handleCreateAuthor)

export { router }
