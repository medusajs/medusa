import compression from "compression"
import { Request, Response, Router, static as static_ } from "express"
import fs from "fs"
import { ServerResponse } from "http"
import path from "path"

type ServeOptions = {
  outDir: string
}

const router = Router()

export async function serve(options: ServeOptions) {
  const htmlPath = path.resolve(options.outDir, "index.html")

  /**
   * The admin UI should always be built at this point, but in the
   * rare case that another plugin terminated a previous startup, the admin
   * may not have been built correctly. Here we check if the admin UI
   * build files exist, and if not, we throw an error, providing the
   * user with instructions on how to fix their build.
   */

  const indexExists = fs.existsSync(htmlPath)

  if (!indexExists) {
    throw new Error(
      `Could not find index.html in the admin build directory. Make sure to run 'medusa build' before starting the server.`
    )
  }

  const html = fs.readFileSync(htmlPath, "utf-8")

  const sendHtml = (_req: Request, res: Response) => {
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Vary", "Origin, Cache-Control")
    res.send(html)
  }

  const setStaticHeaders = (res: ServerResponse) => {
    res.setHeader("Cache-Control", "max-age=31536000, immutable")
    res.setHeader("Vary", "Origin, Cache-Control")
  }

  router.use(compression())

  router.get("/", sendHtml)
  router.use(
    static_(options.outDir, {
      setHeaders: setStaticHeaders,
    })
  )
  router.get(`/*`, sendHtml)

  return router
}
