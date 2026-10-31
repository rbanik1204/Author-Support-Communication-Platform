import session from "express-session"
import MongoStore from "connect-mongo"
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is missing")
}
const sessionMiddleware = session({
  name: "bookleaf.sid",

  secret: process.env.SESSION_SECRET,

  resave: false,

  saveUninitialized: false,

  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
    ttl: 14 * 24 * 60 * 60,
  }),

  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 14 * 24 * 60 * 60 * 1000,
  },
})

export default sessionMiddleware
