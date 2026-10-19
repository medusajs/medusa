import express, { IRouter, RequestHandler } from "express"
import fs from "fs"
import path from "path"
import type { InlineConfig, PluginOption, ViteDevServer } from "vite"

import { BundlerOptions } from "../types"
import { getViteConfig } from "../utils/config"

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
  const { router } = await createDevServer(options)
  return router
}

export interface DevServerOptions {
  /**
   * Also host the backend: adds a server environment (`ssr`) to the admin's
   * Vite server, and scopes the admin's plugins and settings to the client
   * environment so they never touch backend code.
   */
  backend?: boolean
}

/**
 * Creates the admin Vite dev server and the router serving the dashboard.
 */
export async function createDevServer(
  options: BundlerOptions,
  { backend = false }: DevServerOptions = {}
): Promise<{ server: ViteDevServer; router: IRouter }> {
  const vite = await import("vite")
  const router = express.Router()

  let server: ViteDevServer
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

    let mergedConfig = vite.mergeConfig(viteConfig, developConfig)
    if (backend) {
      mergedConfig = await withBackendEnvironment(mergedConfig)
    }
    server = await vite.createServer(mergedConfig)

    await injectViteMiddleware(router, server.middlewares)
    await injectHtmlMiddleware(router, server)
  } catch (error) {
    console.error(error)
    throw new Error(
      "Failed to start admin development server. See error above."
    )
  }

  return { server, router }
}

const ADMIN_ENVIRONMENT = "client"

/**
 * Moves the admin's environment-specific settings under the client
 * environment and adds a server environment for the backend, in which every
 * dependency is external (loaded by Node, never by Vite).
 */
async function withBackendEnvironment(
  config: InlineConfig
): Promise<InlineConfig> {
  const { define, resolve, optimizeDeps, plugins, environments, ...rest } =
    config

  return {
    ...rest,
    plugins: await scopePlugins(plugins ?? [], ADMIN_ENVIRONMENT),
    environments: {
      ...environments,
      [ADMIN_ENVIRONMENT]: {
        ...environments?.[ADMIN_ENVIRONMENT],
        define,
        resolve,
        optimizeDeps,
      },
      ssr: {
        ...environments?.ssr,
        resolve: { external: true },
        optimizeDeps: { noDiscovery: true, include: [] },
      },
    },
  }
}

/**
 * Restricts plugins that don't declare which environments they apply to.
 */
async function scopePlugins(
  plugins: PluginOption[],
  environmentName: string
): Promise<PluginOption[]> {
  const scoped: PluginOption[] = []
  for (const option of plugins) {
    const plugin = await option
    if (!plugin) {
      continue
    }
    if (Array.isArray(plugin)) {
      scoped.push(...(await scopePlugins(plugin, environmentName)))
      continue
    }
    if ("name" in plugin && !plugin.applyToEnvironment) {
      plugin.applyToEnvironment = (environment) =>
        environment.name === environmentName
    }
    scoped.push(plugin)
  }
  return scoped
}
