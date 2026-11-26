import type { Logger } from "@medusajs/framework/types"
import type { BuildManifest } from "@medusajs/framework/utils"

/**
 * What the collection pass found by booting the compiled app.
 */
export type Collected = {
  manifest: BuildManifest
  kept: Record<string, string>
  moduleDirs: string[]
  /** Every `resolve` named in the app's configuration */
  configured: string[]
  pluginDirs: string[]
  resolutions: Record<string, string>
  reads: string[]
  loaded: string[]
}

export type BundleBackendOptions = {
  /** The project's directory */
  directory: string
  /** The compiled backend (`.medusa/server`) the bundle is written to */
  outDir: string
  logger: Logger
  /**
   * The `dist` folder of `@medusajs/medusa`: the bundle's start and migrate
   * commands, the commands left out of it and the module entries are all
   * found from here.
   */
  medusaDist: string
  /** Runs the collection pass (done by `@medusajs/medusa`) */
  collect: () => Promise<Collected>
}
