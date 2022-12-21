import createStore from "connect-redis"
import cookieParser from "cookie-parser"
import { Express } from "express"
import session from "express-session"
import morgan from "morgan"
import redis from "redis"
import invalidateCachedEventsOnError from "../api/middlewares/invalidate-cached-events"
import processCachedEvents from "../api/middlewares/process-cached-events"
import { ConfigModule } from "../types/global"

type Options = {
  app: Express
  configModule: ConfigModule
}

export default async ({ app, configModule }: Options): Promise<Express> => {
  let sameSite: string | boolean = false
  let secure = false
  if (
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "staging"
  ) {
    secure = true
    sameSite = "none"
  }

  const { cookie_secret } = configModule.projectConfig
  const sessionOpts = {
    resave: true,
    saveUninitialized: true,
    cookieName: "session",
    proxy: true,
    secret: cookie_secret,
    cookie: {
      sameSite,
      secure,
      maxAge: 10 * 60 * 60 * 1000,
    },
    store: null,
  }

  if (configModule?.projectConfig?.redis_url) {
    const RedisStore = createStore(session)
    const redisClient = redis.createClient(configModule.projectConfig.redis_url)
    sessionOpts.store = new RedisStore({ client: redisClient })
  }

  app.set("trust proxy", 1)
  app.use(
    morgan("combined", {
      skip: () => process.env.NODE_ENV === "test",
    })
  )
  app.use(cookieParser())
  app.use(session(sessionOpts))

  app.get("/health", (req, res) => {
    res.status(200).send("OK")
  })

  // Events caching middleware should be applied globally
  // to ensure custom endpoints are covered
  app.use(invalidateCachedEventsOnError)
  app.use(processCachedEvents)

  return app
}
