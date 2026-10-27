import express from "express"
import {
  handleUserLogin,
  handleUserRegister,
} from "../controllers/auth.controller.js"
const router = express.Router()

router.get("/login", handleUserLogin).post("/register", handleUserRegister)

export { router }
