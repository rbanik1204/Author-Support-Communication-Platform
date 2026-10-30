import mongoose from "mongoose"

export async function connectMongoDB(uri) {
  const tempVar = await mongoose.connect(uri)
  console.log("Mongo Daemon connected Successfully")
  return tempVar
}
export async function disconnectMongoDB(uri) {
  const tempVar = await mongoose.disconnect(uri)
  console.log("Mongo Daemon disconnected Successfully")
  return tempVar
}
