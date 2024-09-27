import { logger } from "@medusajs/admin-ui"
import express, { Request, Response, Router } from "express"
import fse from "fs-extra"
import { ServerResponse } from "http"
import { resolve } from "path"
import { PluginOptions } from "../lib"

export default function (_rootDirectory: string, options: PluginOptions) {
  const app = Router()

  const { serve = true, path = "/app", outDir } = options

  const isDevelop = process.env.COMMAND_INITIATED_BY === "develop"

  if (isDevelop) {
    app.get(`${path}`, (_req, res) => {
      res.send(
        "Admin is running in development mode. See the terminal for the URL."
      )
    })

    return app
  }

  if (serve) {
    const buildPath: string = resolve(process.cwd(), outDir || "build")

    const htmlPath = resolve(buildPath, "index.html")

    /**
     * The admin UI should always be built at this point, but in the
     * rare case that another plugin terminated a previous startup, the admin
     * may not have been built correctly. Here we check if the admin UI
     * build files exist, and if not, we throw an error, providing the
     * user with instructions on how to fix their build.
     */

    const indexExists = fse.existsSync(htmlPath)

    if (!indexExists) {
      logger.panic(
        `Could not find the admin UI build files. Please run "medusa-admin build" or enable "autoRebuild" in the plugin options to build the admin UI.`
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

    app.get(`${path}`, sendHtml)
    app.use(
      `${path}`,
      express.static(buildPath, {
        setHeaders: setStaticHeaders,
      })
    )
    app.get(`${path}/*`, sendHtml)
  } else {
    app.get(`${path}`, (_req, res) => {
      res.send("Admin not enabled")
    })
  }

  return app
}
