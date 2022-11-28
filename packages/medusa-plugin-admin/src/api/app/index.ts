import { Request, Response, Router } from "express"
import fse from "fs-extra"
import { AdminPluginOptions } from "../../types"
import { shouldServe } from "../../utils/should-serve"
import { Url } from "../../utils/url"
import { validatedPath } from "../../utils/validated-path"

const route = Router()

export default function (app: Router, options: AdminPluginOptions) {
  app.use(`/${validatedPath(options.path) ?? "app"}`, route)

  const serve = shouldServe({ ...options })

  if (!serve) {
    return
  }

  const uiPath = require.resolve("medusa-admin-app")
  const appURL = new Url("/").addPath("app")

  const html = fse.readFileSync(uiPath, "utf8")
  const htmlWithBase = html.replace(
    /<base \/>/,
    `<base href="${appURL.toString({ rootRelative: true })}/" />`
  )

  const sendHtml = (_req: Request, res: Response) => {
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Vary", "Origin, Cache-Control")
    res.send(htmlWithBase)
  }
}
