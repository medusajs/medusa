import express, { Request, Response, Router } from "express"
import fse from "fs-extra"
import { ServerResponse } from "http"
import { join } from "path"
import { AdminPluginOptions } from "../types"

const route = Router()

export default async function (
  _rootDirectory: string,
  options: AdminPluginOptions
) {
  const { path, serve } = options

  if (serve) {
    const adminPath = require.resolve("@medusajs/ui")

    const html = await fse.readFile(adminPath, "utf8")
    const htmlWithBase = html.replace(
      /<base \/>/,
      `<base href="http://localhost:9000${path}" />`
    )

    const sendHtml = (_req: Request, res: Response) => {
      res.setHeader("Cache-Control", "no-cache")
      res.setHeader("Vary", "Origin, Cache-Control")
      res.send(htmlWithBase)
    }

    const setStaticHeaders = (res: ServerResponse) => {
      res.setHeader("Cache-Control", "max-age=31536000, immutable")
      res.setHeader("Vary", "Origin, Cache-Control")
    }

    route.get(path, sendHtml)
    route.get(
      path,
      express.static(join(adminPath), { setHeaders: setStaticHeaders })
    )
    route.get(`${path}/*`, sendHtml)
  }

  return route
}
