const path = require("path")
const express = require("express")
const importFrom = require("import-from")
const chokidar = require("chokidar")

process.env.DEV_MODE = !!process[Symbol.for("ts-node.register.instance")]

require("./dev-require")

const medusaCore = path.resolve(path.join(__dirname, "../../packages"))

let WATCHING = false
const watchFiles = () => {
  if (WATCHING) {
    return
  }
  WATCHING = true

  const watcher = chokidar.watch(medusaCore, {
    ignored: (path) => {
      if (
        path.includes("/node_modules") ||
        path.includes("/dist") ||
        path.includes("/__") ||
        (/\..*/i.test(path) &&
          !(
            path.endsWith(".js") ||
            path.endsWith(".ts") ||
            path.includes("/src")
          ))
      ) {
        return true
      }

      return false
    },
  })

  watcher.on("change", async function (file) {
    console.log("Reloading server...")
    const start = Date.now()

    if (file.includes("/models") || file.includes("/repositories")) {
      Object.keys(require.cache).forEach(function (id) {
        const name = require.cache[id].filename
        if (!name.includes("/typeorm")) {
          return
        }

        delete require.cache[id]
      })
    }

    const allModules = Object.keys(module.constructor._cache)
    const path = file.split("/")
    const src = path.findIndex((folder) => folder === "src")
    const next = path.slice(0, src + 1).join("/")

    for (const name of allModules) {
      if (name.includes("/typeorm")) {
        delete module.constructor._cache[name]
      } else if (name.includes(medusaCore)) {
        if (
          name.includes("/repositories") ||
          name.includes("/loaders") ||
          next.endsWith(".js") ||
          next.endsWith(".ts") ||
          name.startsWith(next)
        ) {
          delete module.constructor._cache[name]
        }
      }
    }

    await bootstrapApp()

    console.log("Server reloaded in", Date.now() - start, "ms")
  })
}

let server
const bootstrapApp = async () => {
  if (server) {
    server.close()
  }

  const app = express()

  const dir = path.resolve(
    path.join(__dirname, "../../packages/medusa/src/loaders")
  )
  const loaders = importFrom(dir, ".").default

  const configDir = __dirname
  const { dbConnection } = await loaders({
    directory: configDir,
    expressApp: app,
  })

  const port = 80
  server = app.listen(port, (err) => {
    watchFiles()
    console.log(`Server Running at localhost:${port}`)
  })

  database = dbConnection
}

bootstrapApp()
