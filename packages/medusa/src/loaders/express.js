import express from "express"
import bodyParser from "body-parser"
import session from "express-session"
import cookieParser from "cookie-parser"
import cors from "cors"
import morgan from "morgan"

import config from "../config"

export default async ({ app }) => {
  app.enable("trust proxy")

  app.use(cors())
  app.use(morgan("combined"))
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(
    session({
      secret: config.cookieSecret,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true },
    })
  )

  app.get("/health", (req, res) => {
    res.status(200).send("OK")
  })

  return app
}
