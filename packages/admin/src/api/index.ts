import express, { Request, Response, Router } from "express"
import fse from "fs-extra"
import { ServerResponse } from "http"
import { resolve } from "path"
import { PluginOptions } from "../types"

export default function (_rootDirectory: string, options: PluginOptions) {
  const app = Router()

  const { serve = true, path = "/app", outDir } = options

  if (serve) {
    let buildPath: string
    let htmlPath: string

    if (outDir) {
      buildPath = resolve(process.cwd(), outDir)
      htmlPath = resolve(buildPath, "index.html")
    } else {
      buildPath = resolve(
        require.resolve("@medusajs/admin-ui/"),
        "..",
        "..",
        "build"
      )
      htmlPath = resolve(buildPath, "index.html")
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
