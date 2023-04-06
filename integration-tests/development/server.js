const path = require("path")
const express = require("express")
const importFrom = require("import-from")
const chokidar = require("chokidar")

process.env.DEV_MODE = !!process[Symbol.for("ts-node.register.instance")]
process.env.NODE_ENV = process.env.DEV_MODE && "development"

require("dotenv").config({ path: path.join(__dirname, ".env.development") })

require("./dev-require")

const medusaCore = path
  .resolve(path.join(__dirname, "../../packages"))
  .replace(/\\/g, "/")

let WATCHING = false
let IS_RELOADING = false

function getParentModulesIds(element) {
  if (!element) {
    return []
  }

  const ids = [element.id]
  let parent = element.parent
  while (parent && parent.id.replace(/\\/g, "/").includes(medusaCore)) {
    ids.push(parent.id)
    parent = parent.parent
  }
  return ids
}

const watchFiles = () => {
  if (WATCHING) {
    return
  }
  WATCHING = true

  const watcher = chokidar.watch(medusaCore, {
    ignored: (rawPath) => {
      const path = rawPath.replace(/\\/g, "/")
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

  watcher.on("change", async function (rawFile) {
    if (IS_RELOADING) {
      return
    }

    console.log("Reloading server...")
    IS_RELOADING = true
    const start = Date.now()

    const file = rawFile.replace(/\\/g, "/")

    if (file.includes("/models") || file.includes("/repositories")) {
      Object.keys(require.cache).forEach(function (id) {
        const name = require.cache[id].filename
        if (!name.includes("typeorm")) {
          return
        }

        delete require.cache[id]
      })
    }

    const allModules = Object.keys(module.constructor._cache)
    const path = file.split("/")
    const src = path.findIndex((folder) => folder === "src")
    const next = path.slice(0, src + 2).join("/")

    for (const rawName of allModules) {
      const name = rawName.replace(/\\/g, "/")
      if (name.includes("typeorm")) {
        delete module.constructor._cache[rawName]
      } else if (name.includes(medusaCore)) {
        if (
          name.includes("repositories") ||
          name.includes("loaders") ||
          next.endsWith(".js") ||
          next.endsWith(".ts") ||
          name.startsWith(next)
        ) {
          const cacheToClean = getParentModulesIds(
            module.constructor._cache[rawName]
          )
          for (const id of cacheToClean) {
            delete module.constructor._cache[id]
          }
        }
      }
    }

    await bootstrapApp()
    IS_RELOADING = false

    console.log("Server reloaded in", Date.now() - start, "ms")
  })
}

let server
const bootstrapApp = async () => {
  if (server) {
    server.close()
  }

  const app = express()
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin)
    res.header("Access-Control-Allow-Methods", "*")
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    )
    next()
  })

  const dir = path.resolve(
    path.join(__dirname, "../../packages/medusa/src/loaders")
  )
  const loaders = importFrom(dir, ".").default

  const configDir = __dirname
  const { dbConnection } = await loaders({
    directory: configDir,
    expressApp: app,
  })

  const port = process.env.SERVER_PORT ?? 9000
  server = app.listen(port, (err) => {
    watchFiles()
    console.log(`Server Running at localhost:${port}`)
  })
}

void bootstrapApp()
