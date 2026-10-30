import "./configs/env.config.js"
import app from "./app.js"
import {
  connectMongoDB,
  disconnectMongoDB,
} from "./configs/mongoose.connect.js"
const startServer = async () => {
  try {
    await connectMongoDB(process.env.MONGO_URI)
    const PORT = process.env.PORT || 4000
    app.listen(PORT, "0.0.0.0", () => {
      console.log("Server running on port: " + PORT)
    })
  } catch (error) {
    console.error("Server startup failed:", error)
    process.exit(1)
  }
}
startServer()
