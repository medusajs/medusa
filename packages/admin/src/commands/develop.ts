import { AdminOptions, develop as adminDevelop } from "@medusajs/admin-ui"
import { getPluginPaths, loadConfig } from "../utils"

type DevelopArgs = AdminOptions & {
  port: number
}

export default async function develop({ backend, path, port }: DevelopArgs) {
  const config = loadConfig(true)

  if (!config) {
    // @medusajs/admin is not part of the projects plugins
    // so we return early
    return
  }

  const plugins = await getPluginPaths()

  await adminDevelop({
    appDir: process.cwd(),
    buildDir: config.outDir,
    plugins,
    options: {
      backend: backend || config.backend,
      path: path || config.path,
      develop: {
        port: port || config.develop.port,
        open: config.develop.open,
        allowedHosts: config.develop.allowedHosts,
        webSocketURL: config.develop.webSocketURL,
      },
    },
  })
}
