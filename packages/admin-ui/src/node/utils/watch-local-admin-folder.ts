import chokidar from "chokidar"
import fse from "fs-extra"
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

  watcher.on("all", async (event, file) => {
    if (event === "unlinkDir" || event === "unlink") {
      removeUnlinkedFile(file, appDir, cacheDir)
    }

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

function removeUnlinkedFile(file: string, appDir: string, cacheDir: string) {
  const srcDir = path.resolve(appDir, "src", "admin")
  const relativePath = path.relative(srcDir, file)

  const destDir = path.resolve(cacheDir, "admin", "src", "extensions")
  const fileToDelete = path.resolve(destDir, relativePath)

  try {
    fse.removeSync(fileToDelete)
  } catch (error) {
    logger.error(`An error occurred while removing ${fileToDelete}: ${error}`)
  }
}
