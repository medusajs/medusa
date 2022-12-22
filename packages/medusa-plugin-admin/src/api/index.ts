import { AdminPluginOptions, loadBuild } from "@medusajs/admin-sdk"

import express, { Request, Response, Router } from "express"
import { ServerResponse } from "http"

export default function (_rootDirectory: string, options: AdminPluginOptions) {
  const app = Router()

  const { serve = true, serve_dev = true, path = "/app" } = options

  const serveAdmin =
    serve || (serve_dev && process.env.NODE_ENV === "development")

  if (serveAdmin) {
    try {
      const { html, path: staticPath } = loadBuild()

      const sendHtml = (_req: Request, res: Response) => {
        res.setHeader("Cache-Control", "no-cache")
        res.setHeader("Vary", "Origin, Cache-Control")
        res.send(html)
      }

      const setStaticHeaders = (res: ServerResponse) => {
        res.setHeader("Cache-Control", "max-age=31536000, immutable")
        res.setHeader("Vary", "Origin, Cache-Control")
      }

      app.get(path, sendHtml)
      app.use(
        path,
        express.static(staticPath, {
          setHeaders: setStaticHeaders,
        })
      )
      app.get(`${path}/*`, sendHtml)
    } catch (error) {
      throw new Error("Could not load admin build")
    }
  } else {
    app.get(path, (_req, res) => {
      res.send("Admin not enabled")
    })
  }

  return app
}
