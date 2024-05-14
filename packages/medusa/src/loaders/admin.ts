import { AdminOptions, ConfigModule } from "@medusajs/types"
import { Express } from "express"

type Options = {
  app: Express
  configModule: ConfigModule
}

type IntializedOptions = Required<
  Pick<AdminOptions, "path" | "disable" | "outDir">
> &
  AdminOptions

export default async function adminLoader({ app, configModule }: Options) {
  const { admin } = configModule

  const adminOptions: IntializedOptions = {
    disable: false,
    path: "/app",
    outDir: "./build",
    ...admin,
  }

  if (admin?.disable) {
    return app
  }

  if (process.env.COMMAND_INITIATED_BY === "develop") {
    return initDevelopmentServer(app, adminOptions)
  }

  await buildProductionBuild(adminOptions)
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

async function buildProductionBuild(options: IntializedOptions) {
  const { build } = await import("@medusajs/admin-sdk")

  await build(options)
}
