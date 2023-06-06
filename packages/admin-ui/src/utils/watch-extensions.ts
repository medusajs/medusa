import chokidar from "chokidar"
import fse from "fs-extra"
import path from "path"
import { injectExtensions } from "./inject-extensions"

export function watchLocalExtensions() {
  const localExtensionsPath = path.resolve(
    process.cwd(),
    "dist",
    "admin",
    "_virtual",
    "_virtual_entry.js"
  )

  // Check if the local extensions folder exists
  if (!fse.existsSync(localExtensionsPath)) {
    console.log(
      "No local extensions folder found. Skipping local extensions watch."
    )
    return
  }

  const watcher = chokidar.watch(localExtensionsPath, {
    ignoreInitial: true,
  })

  watcher.on("all", async () => {
    console.log("Re-injecting local extensions")
    await injectExtensions()
  })

  // Cleanup watcher on exit
  process.on("SIGTERM", async () => {
    console.log("Closing watcher")
    await watcher.close()
  })
}
