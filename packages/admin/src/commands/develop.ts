import { AdminOptions, develop as adminDevelop } from "@medusajs/admin-ui"
import { getPluginPaths, loadConfig } from "../utils"

type DevelopArgs = AdminOptions & {
  port: number
}

export default async function develop({ backend, path, port }: DevelopArgs) {
  const plugins = await getPluginPaths()

  const { outDir } = loadConfig()

  await adminDevelop({
    appDir: process.cwd(),
    buildDir: outDir,
    plugins,
    open: true,
    port: port,
    options: {
      backend: backend,
      path: path,
    },
  })
}
