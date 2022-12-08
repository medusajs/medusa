import { loadBuild } from "@medusajs/admin-sdk"
import express, { Request, Response, Router } from "express"
import { ServerResponse } from "http"

import type { AdminPluginOptions } from "@medusajs/admin-sdk"

export default function (_rootDirectory: string, options: AdminPluginOptions) {
  const app = Router()

  const { serve, serve_dev, base } = options

  const serveAdmin =
    serve || (serve_dev && process.env.NODE_ENV === "development")

  if (serveAdmin) {
    const { html, path } = loadBuild()

    const sendHtml = (_req: Request, res: Response) => {
      res.setHeader("Cache-Control", "no-cache")
      res.setHeader("Vary", "Origin, Cache-Control")
      res.send(html)
    }

    const setStaticHeaders = (res: ServerResponse) => {
      res.setHeader("Cache-Control", "max-age=31536000, immutable")
      res.setHeader("Vary", "Origin, Cache-Control")
    }

    app.get("/app", sendHtml)
    app.use(
      express.static(path, {
        setHeaders: setStaticHeaders,
      })
    )
    app.get("/app/*", sendHtml)
  }

  return app
}
