import { logger } from "@medusajs/framework/logger"
import { AdminOptions, ConfigModule } from "@medusajs/framework/types"
import { Express } from "express"
import fs from "fs"
import path from "path"
import { ADMIN_RELATIVE_OUTPUT_DIR } from "../utils"

type Options = {
  app: Express
  configModule: ConfigModule
  rootDirectory: string
}

type IntializedOptions = Required<Pick<AdminOptions, "path" | "disable">> &
  AdminOptions & {
    outDir: string
    sources?: string[]
  }

const NOT_ALLOWED_PATHS = ["/auth", "/store", "/admin"]

export default async function adminLoader({
  app,
  configModule,
  rootDirectory,
}: Options) {
  const { admin } = configModule

  const sources: string[] = []

  const projectSource = path.join(rootDirectory, "src", "admin")

  // check if the projectSource exists
  if (fs.existsSync(projectSource)) {
    sources.push(projectSource)
  }

  const adminOptions: IntializedOptions = {
    disable: false,
    sources,
    ...admin,
    outDir: path.join(rootDirectory, ADMIN_RELATIVE_OUTPUT_DIR),
  }

  if (adminOptions?.disable) {
    return app
  }

  if (NOT_ALLOWED_PATHS.includes(adminOptions.path)) {
    logger.error(
      `The 'admin.path' in 'medusa-config.js' is set to a value that is not allowed. This can prevent your server from working correctly. Please set 'admin.path' to a value that is not one of the following: ${NOT_ALLOWED_PATHS.join(
        ", "
      )}.`
    )
  }

  if (process.env.NODE_ENV === "development") {
    return initDevelopmentServer(app, adminOptions)
  }

  return serveProductionBuild(app, adminOptions)
}

async function initDevelopmentServer(app: Express, options: IntializedOptions) {
  const { develop } = await import("@medusajs/admin-bundler")

  const adminMiddleware = await develop(options)
  app.use(options.path, adminMiddleware)
  return app
}

async function serveProductionBuild(app: Express, options: IntializedOptions) {
  const { serve } = await import("@medusajs/admin-bundler")

  const adminRoute = await serve(options)

  app.use(options.path, adminRoute)

  return app
}
