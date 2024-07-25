import createStore from "connect-redis"
import cookieParser from "cookie-parser"
import express, { Express } from "express"
import session from "express-session"
import Redis from "ioredis"
import morgan from "morgan"
import path from "path"
import { configManager } from "../config"
import * as process from "process"

export async function expressLoader({ app }: { app: Express }): Promise<{
  app: Express
  shutdown: () => Promise<void>
}> {
  const rootDirectory = configManager.rootDirectory
  const configModule = configManager.config
  const isProduction = configManager.isProduction
  const isStaging = process.env.NODE_ENV === "staging"
  const isTest = process.env.NODE_ENV === "test"

  let sameSite: string | boolean = false
  let secure = false
  if (isProduction || isStaging) {
    secure = true
    sameSite = "none"
  }

  const { http, sessionOptions } = configModule.projectConfig
  const sessionOpts = {
    name: sessionOptions?.name ?? "connect.sid",
    resave: sessionOptions?.resave ?? true,
    rolling: sessionOptions?.rolling ?? false,
    saveUninitialized: sessionOptions?.saveUninitialized ?? true,
    proxy: true,
    secret: sessionOptions?.secret ?? http?.cookieSecret,
    cookie: {
      sameSite,
      secure,
      maxAge: sessionOptions?.ttl ?? 10 * 60 * 60 * 1000,
    },
    store: null,
  }

  let redisClient

  if (configModule?.projectConfig?.redisUrl) {
    const RedisStore = createStore(session)
    redisClient = new Redis(
      configModule.projectConfig.redisUrl,
      configModule.projectConfig.redisOptions ?? {}
    )
    sessionOpts.store = new RedisStore({
      client: redisClient,
      prefix: `${configModule?.projectConfig?.redisPrefix ?? ""}sess:`,
    })
  }

  app.set("trust proxy", 1)
  app.use(
    morgan("combined", {
      skip: () => isTest,
    })
  )
  app.use(cookieParser())
  app.use(session(sessionOpts))

  // Currently we don't allow configuration of static files, but this can be revisited as needed.
  app.use("/static", express.static(path.join(rootDirectory, "static")))

  app.get("/health", (req, res) => {
    res.status(200).send("OK")
  })

  const shutdown = async () => {
    redisClient?.disconnect()
  }

  return { app, shutdown }
}
