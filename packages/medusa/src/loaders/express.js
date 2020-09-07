import express from "express"
import session from "express-session"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import redis from "redis"
import createStore from "connect-redis"

import config from "../config"

export default async ({ app, configModule }) => {
  let sameSite = false
  let secure = false
  if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
    secure = true
    sameSite = "none"
  }

  const RedisStore = createStore(session)
  const redisClient = redis.createClient(configModule.projectConfig.redis_url)

  app.set("trust proxy", 1)
  app.use(
    morgan("combined", {
      skip: () => process.env.NODE_ENV === "test",
    })
  )
  app.use(cookieParser())
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      resave: true,
      saveUninitialized: true,
      cookieName: "session",
      proxy: true,
      secret: config.cookieSecret,
      cookie: {
        sameSite,
        secure,
        maxAge: 10 * 60 * 60 * 1000,
      },
    })
  )

  app.get("/health", (req, res) => {
    res.status(200).send("OK")
  })

  return app
}
