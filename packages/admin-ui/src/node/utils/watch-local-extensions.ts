import chokidar from "chokidar"
import fse from "fs-extra"
import path from "node:path"

async function addImport() {
  return null
}

async function removeImport() {
  return null
}

async function handleFileEvent(
  event: "add" | "change" | "unlink",
  filePath: string,
  relativePath: string
) {
  if (event === "add" || event === "change") {
    // If file is from the local widgets folder then copy it to the .cache/admin/src/extensions/widgets folder
    // If file is from the local pages folder then copy it to the .cache/admin/src/extensions/pages folder
  } else {
    await removeImport()
  }
}

async function handleDirEvent(
  event: "addDir" | "unlinkDir",
  dir: string,
  relativePath: string
) {
  const fileNames = await fse.readdir(dir)

  for (const fileName of fileNames) {
    const filePath = path.join(dir, fileName)
    const stats = await fse.stat(filePath)

    if (stats.isDirectory()) {
      await handleDirEvent(event, filePath, relativePath)
    } else {
      await handleFileEvent("add", filePath, relativePath)
    }
  }
}

export async function watchLocalExtensions(dir: string) {
  const localAdminDir = path.resolve(dir, "src", "admin")
  const extensionsEntry = path.resolve(
    dir,
    ".cache",
    "admin",
    "src",
    "extensions.ts"
  )

  const watcher = chokidar.watch(localAdminDir, {
    ignoreInitial: true,
    ignorePermissionErrors: true,
  })

  watcher.on("all", async (event, filePath) => {
    const relativePath = path.relative(extensionsEntry, filePath)

    if (event === "add" || event === "change" || event === "unlink") {
      await handleFileEvent(event, filePath, relativePath)
    }

    if (event === "addDir" || event === "unlinkDir") {
      await handleDirEvent(event, filePath, relativePath)
    }
  })

  process
    .on("SIGINT", async () => {
      await watcher.close()
    })
    .on("SIGTERM", async () => {
      await watcher.close()
    })
}
