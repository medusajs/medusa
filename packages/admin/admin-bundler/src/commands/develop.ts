import express, { IRouter, RequestHandler } from "express"
import fs from "fs"
import path from "path"
import type { InlineConfig, ViteDevServer } from "vite"

import { BundlerOptions } from "../types"
import { getViteConfig } from "../utils/config"

const router = express.Router()

function findTemplateFilePath(
  reqPath: string,
  root: string
): string | undefined {
  if (reqPath.endsWith(".html")) {
    const pathToTest = path.join(root, reqPath)
    if (fs.existsSync(pathToTest)) {
      return pathToTest
    }
  }

  const basePath = reqPath.slice(0, reqPath.lastIndexOf("/"))
  const dirs = basePath.split("/")

  while (dirs.length > 0) {
    const pathToTest = path.join(root, ...dirs, "index.html")
    if (fs.existsSync(pathToTest)) {
      return pathToTest
    }
    dirs.pop()
  }

  return undefined
}

async function injectViteMiddleware(
  router: express.Router,
  middleware: RequestHandler
) {
  router.use((req, res, next) => {
    // Block Vite's launch-editor endpoint (GHSA-v6wh-96g9-6wx3). It's registered
    // unconditionally by Vite's dev server and only powers the "open in editor"
    // overlay action, which the admin dashboard doesn't rely on. Match
    // case-insensitively since Vite's connect router does too.
    if (req.path.toLowerCase().startsWith("/__open-in-editor")) {
      res.status(403).end()
      return
    }
    req.path.endsWith(".html") ? next() : middleware(req, res, next)
  })
}

async function injectHtmlMiddleware(
  router: express.Router,
  server: ViteDevServer
) {
  router.use(async (req, res, next) => {
    if (req.method !== "GET") {
      return next()
    }

    const templateFilePath = findTemplateFilePath(req.path, server.config.root)
    if (!templateFilePath) {
      return next()
    }

    const template = fs.readFileSync(templateFilePath, "utf8")
    const html = await server.transformIndexHtml(
      templateFilePath,
      template,
      req.originalUrl
    )

    res.send(html)
  })
}

export async function develop(options: BundlerOptions): Promise<IRouter> {
  const vite = await import("vite")

  try {
    const viteConfig = await getViteConfig(options)

    const developConfig: InlineConfig = {
      mode: "development",
      logLevel: "error",
      appType: "spa",
      server: {
        middlewareMode: true,
      },
    }

    const mergedConfig = vite.mergeConfig(viteConfig, developConfig)
    const server = await vite.createServer(mergedConfig)

    await injectViteMiddleware(router, server.middlewares)
    await injectHtmlMiddleware(router, server)
  } catch (error) {
    console.error(error)
    throw new Error(
      "Failed to start admin development server. See error above."
    )
  }

  return router
}
