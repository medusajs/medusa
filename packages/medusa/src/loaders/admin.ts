import { AdminOptions, ConfigModule } from "@medusajs/types"
import { Express } from "express"

type Options = {
  app: Express
  adminConfig: ConfigModule["admin"]
}

type IntializedOptions = Required<
  Pick<AdminOptions, "path" | "disable" | "outDir">
> &
  AdminOptions

export default async function adminLoader({ app, adminConfig }: Options) {
  const adminOptions: IntializedOptions = {
    disable: false,
    path: "/app",
    outDir: "./build",
    ...adminConfig,
  }

  if (adminOptions?.disable) {
    return app
  }

  if (process.env.COMMAND_INITIATED_BY === "develop") {
    return initDevelopmentServer(app, adminOptions)
  }

  return serveProductionBuild(app, adminOptions)
}

async function initDevelopmentServer(app: Express, options: IntializedOptions) {
  const { develop } = await import("@medusajs/admin-sdk")

  const adminMiddleware = await develop(options)
  app.use(options.path, adminMiddleware)
  return app
}

async function serveProductionBuild(app: Express, options: IntializedOptions) {
  const { serve } = await import("@medusajs/admin-sdk")

  const adminRoute = await serve(options)

  app.use(options.path, adminRoute)

  return app
}
