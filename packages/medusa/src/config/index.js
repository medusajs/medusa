import dotenv from "dotenv"

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development"

const envFound = dotenv.config()
if (!envFound) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️")
}

const jwtSecret =
  process.env.NODE_ENV === "test"
    ? "test"
    : process.env.NODE_ENV === "development"
    ? "development"
    : process.env.JWT_SECRET

const cookieSecret =
  process.env.NODE_ENV === "test"
    ? "test"
    : process.env.NODE_ENV === "development"
    ? "development"
    : process.env.COOKIE_SECRET

const config = {
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT, 10),

  databaseURL: process.env.MONGODB_URI,
  redisURI: process.env.REDIS_URI,

  /**
   * Your secret sauce
   */
  jwtSecret,
  cookieSecret,

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || "silly",
  },

  /**
   * API configs
   */
  api: {
    prefix: "/api",
  },
}

export default config
