import express from "express"
import {
  handleGetMe,
  handleUserLogin,
  handleUserLogout,
  handleSetPassword,
} from "../controllers/auth.controller.js"
const router = express.Router()

router
  .post("/login", handleUserLogin)
  .get("/me", handleGetMe)
  .post("/logout", handleUserLogout)
  .post("/set-password", handleSetPassword)
export { router }
