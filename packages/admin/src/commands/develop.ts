import { AdminOptions, develop as adminDevelop } from "@medusajs/admin-ui"
import { getPluginPaths } from "../utils"

type DevelopArgs = AdminOptions & {
  port: number
}

export default async function develop({ backend, path, port }: DevelopArgs) {
  const plugins = await getPluginPaths()

  await adminDevelop({
    appDir: process.cwd(),
    buildDir: process.cwd(),
    plugins,
    open: true,
    port: port,
    options: {
      backend: backend,
      path: path,
    },
  })
}
