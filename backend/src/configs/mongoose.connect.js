import mongoose from "mongoose"

export default async function connectMongoDB(uri) {
  const tempVar = await mongoose.connect(uri)
  console.log("Mongo Daemon connected Successfully")
  return tempVar
}
