import express from "express"
import {
  handleGetMe,
  handleUserLogin,
  handleUserLogout,
  handleUserRegister,
} from "../controllers/auth.controller.js"
const router = express.Router()

router
  .post("/login", handleUserLogin)
  .get("/me", handleGetMe)
  .post("/logout", handleUserLogout)
export { router }
