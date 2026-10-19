import { ConfigModule, Logger } from "@medusajs/framework/types"
import { getResolvedPlugins } from "@medusajs/framework/utils"
import {
  provideAdminDevRouter,
  resolveAdminOptions,
} from "../../../loaders/admin"
import { createViteModuleLoader } from "./module-loader"
import { ViteReloader } from "./reloader"

/**
 * Starts the Vite dev server for the backend. When the admin is enabled, the
 * backend runs as the `ssr` environment of the admin's Vite server, so both
 * share one server, one transform pipeline and one process.
 */
export async function createViteDevServer({
  directory,
  configModule,
  logger,
}: {
  directory: string
  configModule: ConfigModule
  logger: Logger
}) {
  const plugins = await getResolvedPlugins(directory, configModule, true)
  const adminOptions = resolveAdminOptions({
    configModule,
    rootDirectory: directory,
    plugins,
  })

  let server: unknown
  if (!adminOptions.disable) {
    const { createDevServer } = await import("@medusajs/admin-bundler")
    const devServer = await createDevServer(adminOptions, { backend: true })
    provideAdminDevRouter(devServer.router)
    server = devServer.server
  }

  const loader = await createViteModuleLoader({ directory, logger, server })
  return { loader, reloader: new ViteReloader(loader, directory, logger) }
}
