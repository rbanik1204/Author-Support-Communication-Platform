import dotenv from "dotenv"
const envFile = `.env.${process.env.NODE_ENV || "development"}`
const result =
  process.env.NODE_ENV !== "production"
    ? dotenv.config({
        path: envFile,
        quiet: true,
        silent: true,
        override: true,
      })
    : ""
if (result.error) {
  throw result.error
}
