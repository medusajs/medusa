import type { InlineConfig } from "vite"
import { BundlerOptions } from "../types"
import { getViteConfig } from "./config"

export async function build(options: BundlerOptions) {
  const vite = await import("vite")

  const viteConfig = await getViteConfig(options)
  const buildConfig: InlineConfig = {
    mode: "production",
    logLevel: "error",
  }

  await vite.build(vite.mergeConfig(viteConfig, buildConfig))
}
