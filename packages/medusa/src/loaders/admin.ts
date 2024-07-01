import { AdminOptions, ConfigModule } from "@medusajs/types"
import { Express } from "express"
import fs from "fs"
import path from "path"

type Options = {
  app: Express
  configModule: ConfigModule
  rootDirectory: string
}

type IntializedOptions = Required<
  Pick<AdminOptions, "path" | "disable" | "outDir">
> &
  AdminOptions & {
    sources?: string[]
  }

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
    path: "/app",
    outDir: "./build",
    sources,
    ...admin,
  }

  if (adminOptions?.disable) {
    return app
  }

  if (process.env.NODE_ENV === "development") {
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

  app.get("/", (req, res, next) => {
    if (req.get("accept")?.includes("text/html")) {
      res.redirect(options.path)
      return
    }
    next()
  })

  app.use(options.path, adminRoute)

  return app
}
