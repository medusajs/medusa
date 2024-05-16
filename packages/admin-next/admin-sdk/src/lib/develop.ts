import express from "express"

import { BundlerOptions } from "../types"
import { getViteConfig } from "./config"

const router = express.Router()

export async function develop(options: BundlerOptions) {
  const vite = await import("vite")

  try {
    const viteConfig = await getViteConfig(options)
    const server = await vite.createServer(
      vite.mergeConfig(viteConfig, { logLevel: "info", mode: "development" })
    )

    router.use(server.middlewares)
  } catch (error) {
    console.error(error)
    throw new Error("Could not start development server")
  }

  return router
}
