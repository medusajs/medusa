import inject from "@medusajs/vite-plugin-extension"
import react from "@vitejs/plugin-react"
import deepmerge from "deepmerge"
import { createRequire } from "module"
import path from "path"
import { type Config } from "tailwindcss"
import { ContentConfig } from "tailwindcss/types/config"
import { InlineConfig, Logger, createLogger, mergeConfig } from "vite"

const require = createRequire(import.meta.url)

export async function createViteConfig(
  inline: InlineConfig
): Promise<InlineConfig | null> {
  const root = process.cwd()
  const logger = createCustomLogger()

  let dashboardRoot: string | null = null

  try {
    dashboardRoot = path.dirname(require.resolve("@medusajs/dashboard"))
  } catch (err) {
    dashboardRoot = null
  }

  if (!dashboardRoot) {
    logger.error(
      "Unable to find @medusajs/dashboard. Please install it in your project, or specify the root directory."
    )
    return null
  }

  const { plugins, userConfig } = (await loadConfig(root, logger)) ?? {}

  let viteConfig: InlineConfig = mergeConfig(inline, {
    plugins: [
      react(),
      inject({
        sources: plugins,
      }),
    ],
    configFile: false,
    root: dashboardRoot,
    css: {
      postcss: {
        plugins: [
          require("tailwindcss")({
            config: createTwConfig(process.cwd(), dashboardRoot),
          }),
          require("autoprefixer"),
        ],
      },
    },
  } satisfies InlineConfig)

  if (userConfig) {
    viteConfig = await userConfig(viteConfig)
  }

  return viteConfig
}

function mergeTailwindConfigs(config1: Config, config2: Config): Config {
  const content1 = config1.content
  const content2 = config2.content

  let mergedContent: ContentConfig

  if (Array.isArray(content1) && Array.isArray(content2)) {
    mergedContent = [...content1, ...content2]
  } else if (!Array.isArray(content1) && !Array.isArray(content2)) {
    mergedContent = {
      files: [...content1.files, ...content2.files],
      relative: content1.relative || content2.relative,
      extract: { ...content1.extract, ...content2.extract },
      transform: { ...content1.transform, ...content2.transform },
    }
  } else {
    throw new Error("Cannot merge content fields of different types")
  }

  const mergedConfig = deepmerge(config1, config2)
  mergedConfig.content = mergedContent

  console.log(config1.presets, config2.presets)

  // Ensure presets only contain unique values
  mergedConfig.presets = config1.presets || []

  return mergedConfig
}

function createTwConfig(root: string, dashboardRoot: string) {
  const uiRoot = path.join(
    path.dirname(require.resolve("@medusajs/ui")),
    "**/*.{js,jsx,ts,tsx}"
  )

  const baseConfig: Config = {
    presets: [require("@medusajs/ui-preset")],
    content: [
      `${root}/src/admin/**/*.{js,jsx,ts,tsx}`,
      `${dashboardRoot}/src/**/*.{js,jsx,ts,tsx}`,
      uiRoot,
    ],
    darkMode: "class",
    theme: {
      extend: {},
    },
    plugins: [],
  }

  let userConfig: Config | null = null
  const extensions = ["js", "cjs", "mjs", "ts", "cts", "mts"]

  for (const ext of extensions) {
    try {
      userConfig = require(path.join(root, `tailwind.config.${ext}`))
      break
    } catch (err) {
      console.log("Failed to load tailwind config with extension", ext, err)
      userConfig = null
    }
  }

  if (!userConfig) {
    return baseConfig
  }

  return mergeTailwindConfigs(baseConfig, userConfig)
}

function createCustomLogger() {
  const logger = createLogger("info", {
    prefix: "medusa-admin",
  })
  const loggerInfo = logger.info

  logger.info = (msg, opts) => {
    if (
      msg.includes("hmr invalidate") &&
      msg.includes(
        "Could not Fast Refresh. Learn more at https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react#consistent-components-exports"
      )
    ) {
      return
    }

    loggerInfo(msg, opts)
  }

  return logger
}

interface PluginOptions extends Record<string, unknown> {
  enableUI?: boolean
}

type Plugin =
  | string
  | {
      resolve: string
      options?: PluginOptions
    }

interface MedusaConfig extends Record<string, unknown> {
  plugins?: Plugin[]
}

async function loadConfig(root: string, logger: Logger) {
  const configPath = path.resolve(root, "medusa-config.js")

  const config: MedusaConfig = await import(configPath)
    .then((c) => c)
    .catch((e) => {
      if (e.code === "ERR_MODULE_NOT_FOUND") {
        logger.warn(
          "Root 'medusa-config.js' file not found; extensions won't load. If running Admin UI as a standalone app, use the 'standalone' option.",
          {
            timestamp: true,
          }
        )
      } else {
        logger.error(
          `An error occured while attempting to load '${configPath}':\n${e}`,
          {
            timestamp: true,
          }
        )
      }

      return null
    })

  if (!config) {
    return
  }

  if (!config.plugins?.length) {
    logger.info(
      "No plugins in 'medusa-config.js', no extensions will load. To enable Admin UI extensions, add them to the 'plugins' array in 'medusa-config.js'.",
      {
        timestamp: true,
      }
    )
    return
  }

  const uiPlugins = config.plugins
    .filter((p) => typeof p !== "string" && p.options?.enableUI)
    .map((p: Plugin) => {
      return typeof p === "string" ? p : p.resolve
    })

  const extensionSources = uiPlugins.map((p) => {
    return path.resolve(require.resolve(p), "dist", "admin")
  })

  const rootSource = path.resolve(process.cwd(), "src", "admin")

  extensionSources.push(rootSource)

  const adminPlugin = config.plugins.find((p) =>
    typeof p === "string"
      ? p === "@medusajs/admin"
      : p.resolve === "@medusajs/admin"
  )

  if (!adminPlugin) {
    logger.info(
      "No @medusajs/admin in 'medusa-config.js', no extensions will load. To enable Admin UI extensions, add it to the 'plugins' array in 'medusa-config.js'.",
      {
        timestamp: true,
      }
    )
    return
  }

  const adminPluginOptions =
    typeof adminPlugin !== "string" && !!adminPlugin.options
      ? adminPlugin.options
      : {}

  const viteConfig = adminPluginOptions.withFinal as
    | ((config: InlineConfig) => InlineConfig)
    | ((config: InlineConfig) => Promise<InlineConfig>)
    | undefined

  return {
    plugins: extensionSources,
    userConfig: viteConfig,
  }
}
