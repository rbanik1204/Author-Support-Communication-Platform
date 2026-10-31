import express from "express"
import {
  handleUserLogin,
  handleUserRegister,
} from "../controllers/auth.controller.js"
const router = express.Router()

router.post("/login", handleUserLogin)
export { router }
