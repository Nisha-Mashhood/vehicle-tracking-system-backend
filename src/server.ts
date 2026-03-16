import "reflect-metadata"
import dotenv from "dotenv"
import mongoose from "mongoose"
import app from "./app"

dotenv.config()

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI as string

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("MongoDB connected")
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Server failed to start", error)
    process.exit(1)
  }
}
startServer()