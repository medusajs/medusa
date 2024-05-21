import express from "express"
import type { InlineConfig } from "vite"

import { BundlerOptions } from "../types"
import { getViteConfig } from "./config"

const router = express.Router()

export async function develop(options: BundlerOptions) {
  const vite = await import("vite")

  try {
    const viteConfig = await getViteConfig(options)

    const developConfig: InlineConfig = {
      mode: "development",
      // server: {
      //   middlewareMode: true,
      //   hmr: true,
      //   open: true,
      // },
      // appType: "custom",
    }

    const server = await vite.createServer(
      vite.mergeConfig(viteConfig, developConfig)
    )

    router.use(server.middlewares)

    // router.get("*", async (req, res) => {
    //   const url = req.originalUrl.replace(options.path, "/")

    //   let template = await fs.readFile(
    //     path.resolve(__dirname, "./index.html"),
    //     "utf-8"
    //   )
    //   template = await server.transformIndexHtml(url, template, req.originalUrl)

    //   res.set("Content-Type", "text/html")
    //   res.send(template)
    // })
  } catch (error) {
    console.error(error)
    throw new Error("Could not start development server")
  }

  return router
}
