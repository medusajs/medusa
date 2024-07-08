import { ConfigModule } from "@medusajs/types"
import createStore from "connect-redis"
import cookieParser from "cookie-parser"
import express, { Express } from "express"
import session from "express-session"
import Redis from "ioredis"
import morgan from "morgan"
import path from "path"

type Options = {
  app: Express
  configModule: ConfigModule
  rootDirectory: string
}

export default async ({
  app,
  configModule,
  rootDirectory,
}: Options): Promise<{
  app: Express
  shutdown: () => Promise<void>
}> => {
  let sameSite: string | boolean = false
  let secure = false
  if (
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "staging"
  ) {
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
      skip: () => process.env.NODE_ENV === "test",
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
