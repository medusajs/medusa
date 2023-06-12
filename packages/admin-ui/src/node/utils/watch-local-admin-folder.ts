import chokidar from "chokidar"
import path from "node:path"
import { createEntry } from "./create-entry"
import { logger } from "./logger"

/**
 * Watches the local admin directory for changes and updates the extensions cache directory accordingly.
 */
export async function watchLocalAdminFolder(
  appDir: string,
  cacheDir: string,
  plugins: string[]
) {
  const adminDir = path.resolve(appDir, "src", "admin")

  const watcher = chokidar.watch(adminDir, {
    ignored: /(^|[/\\])\../,
    ignoreInitial: true,
  })

  watcher.on("all", async () => {
    await createEntry({
      appDir,
      dest: cacheDir,
      plugins,
    })

    logger.info("Extensions cache directory was re-initialized")
  })

  process
    .on("SIGINT", async () => {
      await watcher.close()
    })
    .on("SIGTERM", async () => {
      await watcher.close()
    })
}
