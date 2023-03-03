import express, { Request, Response, Router } from "express"
import fse from "fs-extra"
import { ServerResponse } from "http"
import { resolve } from "path"
import colors from "picocolors"
import { PluginOptions } from "../types"
import { reporter } from "../utils"

export default function (_rootDirectory: string, options: PluginOptions) {
  const app = Router()

  const { serve = true, path = "app", outDir } = options

  if (serve) {
    let buildPath: string
    let htmlPath: string

    if (outDir) {
      buildPath = resolve(process.cwd(), outDir)
      htmlPath = resolve(buildPath, "index.html")
    } else {
      buildPath = resolve(
        require.resolve("@medusajs/admin-ui"),
        "..",
        "..",
        "build"
      )
      htmlPath = resolve(buildPath, "index.html")
    }

    /**
     * The admin UI should always be built at this point, but in the
     * rare case that another plugin terminated a previous startup, the admin
     * may not have been built correctly. Here we check if the admin UI
     * build files exist, and if not, we throw an error, providing the
     * user with instructions on how to fix their build.
     */
    try {
      fse.ensureFileSync(htmlPath)
    } catch (_err) {
      reporter.panic(
        new Error(
          `Could not find the admin UI build files. Please run ${colors.bold(
            "`medusa-admin build`"
          )} to build the admin UI.`
        )
      )
    }

    const html = fse.readFileSync(htmlPath, "utf-8")

    const sendHtml = (_req: Request, res: Response) => {
      res.setHeader("Cache-Control", "no-cache")
      res.setHeader("Vary", "Origin, Cache-Control")
      res.send(html)
    }

    const setStaticHeaders = (res: ServerResponse) => {
      res.setHeader("Cache-Control", "max-age=31536000, immutable")
      res.setHeader("Vary", "Origin, Cache-Control")
    }

    app.get(`/${path}`, sendHtml)
    app.use(
      `/${path}`,
      express.static(buildPath, {
        setHeaders: setStaticHeaders,
      })
    )
    app.get(`/${path}/*`, sendHtml)
  } else {
    app.get(`/${path}`, (_req, res) => {
      res.send("Admin not enabled")
    })
  }

  return app
}
