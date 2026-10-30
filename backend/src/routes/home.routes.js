import express from "express"
import { handleHomePage } from "../controllers/home.controller.js"
import mongoose from "mongoose"
const router = express.Router()
router
  .get("/health", (req, res, next) => {
    const dbConnected = mongoose.connection.readyState === 1

    if (!dbConnected) {
      return res.status(503).json({
        status: "UNHEALTHY",
        database: "Disconnected",
      })
    }

    res.status(200).json({
      status: "OK",
      database: "Connected",
    })
  })
  .get("/", handleHomePage)

export { router }
