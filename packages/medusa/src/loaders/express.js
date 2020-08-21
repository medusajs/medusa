import express from "express"
import session from "client-sessions"
import cookieParser from "cookie-parser"
import morgan from "morgan"

import config from "../config"

export default async ({ app }) => {
  app.enable("trust proxy")
  app.use(
    morgan("combined", {
      skip: () => process.env.NODE_ENV === "test",
    })
  )
  app.use(cookieParser())
  app.use(
    session({
      cookieName: "session",
      secret: config.cookieSecret,
      duration: 24 * 60 * 60 * 1000,
      activeDuration: 1000 * 60 * 5,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      },
    })
  )

  app.get("/health", (req, res) => {
    res.status(200).send("OK")
  })

  return app
}
