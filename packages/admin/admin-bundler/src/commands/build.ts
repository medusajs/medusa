import type { InlineConfig } from "vite"
import { BundlerOptions } from "../types"
import { getViteConfig } from "../utils/config"

export async function build(options: BundlerOptions) {
  const vite = await import("vite")

  const viteConfig = await getViteConfig(options)
  const buildConfig: InlineConfig = {
    mode: "production",
    logLevel: "error",
  }

  await vite.build(vite.mergeConfig(viteConfig, buildConfig))
}

/**
 * Builds the application as one Vite app: the admin dashboard is the client
 * environment, and `buildServer` builds the backend after it. Not in
 * parallel: bundling the backend can take several GB of memory on its own,
 * more than build machines have to spare for both at once.
 */
export async function buildApp(
  options: BundlerOptions,
  { buildServer }: { buildServer: () => Promise<void> }
) {
  const vite = await import("vite")

  const viteConfig = await getViteConfig(options)
  const buildConfig: InlineConfig = {
    mode: "production",
    logLevel: "error",
    builder: {
      async buildApp(builder) {
        await builder.build(builder.environments.client)
        await buildServer()
      },
    },
  }

  const builder = await vite.createBuilder(
    vite.mergeConfig(viteConfig, buildConfig)
  )
  await builder.buildApp()
}
