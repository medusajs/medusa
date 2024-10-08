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
      logLevel: "warn",
    }

    const server = await vite.createServer(
      vite.mergeConfig(viteConfig, developConfig)
    )

    router.use(server.middlewares)
  } catch (error) {
    console.error(error)
    throw new Error(
      "Failed to start admin development server. See error above."
    )
  }

  return router
}
