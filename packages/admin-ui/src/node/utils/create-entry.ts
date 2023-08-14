import fse from "fs-extra"
import path from "node:path"
import dedent from "ts-dedent"
import { copyFilter } from "./copy-filter"
import { logger } from "./logger"
import { normalizePath } from "./normalize-path"
import {
  findAllValidRoutes,
  findAllValidSettings,
  findAllValidWidgets,
} from "./validate-extensions"

const FILE_EXT_REGEX = /\.[^/.]+$/

async function copyLocalExtensions(src: string, dest: string) {
  try {
    await fse.copy(src, dest, {
      filter: copyFilter,
    })
  } catch (err) {
    logger.error(
      `Could not copy local extensions to cache folder. See the error below for details:`,
      {
        error: err,
      }
    )

    return false
  }

  return true
}

/**
 * Creates an entry file for any local extensions, if they exist.
 */
async function createLocalExtensionsEntry(appDir: string, dest: string) {
  const localAdminDir = path.resolve(appDir, "src", "admin")

  const localAdminDirExists = await fse.pathExists(localAdminDir)

  if (!localAdminDirExists) {
    return false
  }

  const copied = await copyLocalExtensions(
    localAdminDir,
    path.resolve(dest, "admin", "src", "extensions")
  )

  if (!copied) {
    logger.error(
      "Could not copy local extensions to cache folder. See above error for details. The error must be fixed before any local extensions can be injected."
    )
    return false
  }

  const [localWidgets, localRoutes, localSettings] = await Promise.all([
    findAllValidWidgets(
      path.resolve(dest, "admin", "src", "extensions", "widgets")
    ),
    findAllValidRoutes(
      path.resolve(dest, "admin", "src", "extensions", "routes")
    ),
    findAllValidSettings(
      path.resolve(dest, "admin", "src", "extensions", "settings")
    ),
  ])

  const widgetsArray = localWidgets.map((file, index) => {
    const relativePath = normalizePath(
      path
        .relative(path.resolve(dest, "admin", "src", "extensions"), file)
        .replace(FILE_EXT_REGEX, "")
    )

    return {
      importStatement: `import Widget${index}, { config as widgetConfig${index} } from "./${relativePath}"`,
      extension: `{ Component: Widget${index}, config: { ...widgetConfig${index}, type: "widget" } }`,
    }
  })

  const routesArray = localRoutes.map((route, index) => {
    const relativePath = normalizePath(
      path
        .relative(path.resolve(dest, "admin", "src", "extensions"), route.file)
        .replace(FILE_EXT_REGEX, "")
    )

    const importStatement = route.hasConfig
      ? `import Page${index}, { config as routeConfig${index} } from "./${relativePath}"`
      : `import Page${index} from "./${relativePath}"`

    const extension = route.hasConfig
      ? `{ Component: Page${index}, config: { ...routeConfig${index}, type: "route",  path: "${route.path}" } }`
      : `{ Component: Page${index}, config: { path: "${route.path}", type: "route" } }`

    return {
      importStatement,
      extension,
    }
  })

  const settingsArray = localSettings.map((setting, index) => {
    const relativePath = normalizePath(
      path
        .relative(
          path.resolve(dest, "admin", "src", "extensions"),
          setting.file
        )
        .replace(FILE_EXT_REGEX, "")
    )

    return {
      importStatement: `import Setting${index}, { config as settingConfig${index} } from "./${relativePath}"`,
      extension: `{ Component: Setting${index}, config: { ...settingConfig${index}, path: "${setting.path}", type: "setting" } }`,
    }
  })

  const extensionsArray = [...widgetsArray, ...routesArray, ...settingsArray]

  const extensionsEntry = dedent`
    ${extensionsArray.map((extension) => extension.importStatement).join("\n")}

    const LocalEntry = {
      identifier: "local",
      extensions: [
        ${extensionsArray.map((extension) => extension.extension).join(",\n")}
      ],
    }

    export default LocalEntry
  `

  try {
    await fse.outputFile(
      path.resolve(dest, "admin", "src", "extensions", "_local-entry.ts"),
      extensionsEntry
    )
  } catch (err) {
    logger.panic(
      `Failed to write the entry file for the local extensions. See the error below for details:`,
      {
        error: err,
      }
    )
  }

  return true
}

function findPluginsWithExtensions(plugins: string[]) {
  const pluginsWithExtensions: string[] = []

  for (const plugin of plugins) {
    try {
      const pluginDir = path.dirname(
        require.resolve(`${plugin}/package.json`, {
          paths: [process.cwd()],
        })
      )
      const entrypoint = path.resolve(
        pluginDir,
        "dist",
        "admin",
        "_virtual_entry.js"
      )

      if (fse.existsSync(entrypoint)) {
        pluginsWithExtensions.push(entrypoint)
      }
    } catch (_err) {
      logger.warn(
        `There was an error while attempting to load extensions from the plugin: ${plugin}. Are you sure it is installed?`
      )
      // no plugin found - noop
    }
  }

  return pluginsWithExtensions
}

async function writeTailwindContentFile(dest: string, plugins: string[]) {
  const tailwindContent = dedent`
    const path = require("path")

    const devPath = path.join(__dirname, "..", "..", "src/admin/**/*.{js,jsx,ts,tsx}")

    module.exports = {
      content: [
        devPath,
        ${plugins
          .map((plugin) => {
            const tailwindContentPath = normalizePath(
              path.relative(
                path.resolve(dest, "admin"),
                path.dirname(path.join(plugin, "..", ".."))
              )
            )

            return `"${tailwindContentPath}/dist/admin/**/*.{js,jsx,ts,tsx}"`
          })
          .join(",\n")}
      ],
    }
  
  `

  try {
    await fse.outputFile(
      path.resolve(dest, "admin", "tailwind.content.js"),
      tailwindContent
    )
  } catch (err) {
    logger.warn(
      `Failed to write the Tailwind content file to ${dest}. The admin UI will remain functional, but CSS classes applied to extensions from plugins might not have the correct styles`
    )
  }
}

async function createMainExtensionsEntry(
  dest: string,
  plugins: string[],
  hasLocalExtensions: boolean
) {
  if (!plugins.length && !hasLocalExtensions) {
    // We still want to generate the entry file, even if there are no extensions
    // to load, so that the admin UI can be built without errors
    const emptyEntry = dedent`
      const extensions = []

      export default extensions
    `

    try {
      await fse.outputFile(
        path.resolve(dest, "admin", "src", "extensions", "_main-entry.ts"),
        emptyEntry
      )
    } catch (err) {
      logger.panic(
        `Failed to write the entry file for the main extensions. See the error below for details:`,
        {
          error: err,
        }
      )
    }

    return
  }

  const pluginsArray = plugins.map((plugin) => {
    const relativePath = normalizePath(
      path
        .relative(path.resolve(dest, "admin", "src", "extensions"), plugin)
        .replace(FILE_EXT_REGEX, "")
    )

    return relativePath
  })

  const extensionsArray = [
    ...pluginsArray.map((plugin, index) => {
      const importStatement = `import Plugin${index} from "${plugin}"`

      return {
        importStatement,
        extension: `Plugin${index}`,
      }
    }),
    ...(hasLocalExtensions
      ? [
          {
            importStatement: `import LocalEntry from "./_local-entry"`,
            extension: `LocalEntry`,
          },
        ]
      : []),
  ]

  const extensionsEntry = dedent`
      ${extensionsArray
        .map((extension) => extension.importStatement)
        .join("\n")}

      const extensions = [
        ${extensionsArray.map((extension) => extension.extension).join(",\n")}
      ]

      export default extensions
    `

  try {
    await fse.outputFile(
      path.resolve(dest, "admin", "src", "extensions", "_main-entry.ts"),
      extensionsEntry
    )
  } catch (err) {
    logger.panic(
      `Failed to write the extensions entry file. See the error below for details:`,
      {
        error: err,
      }
    )
  }
}

type CreateEntryArgs = {
  appDir: string
  dest: string
  plugins?: string[]
}

export async function createEntry({ appDir, dest, plugins }: CreateEntryArgs) {
  const hasLocalExtensions = await createLocalExtensionsEntry(appDir, dest)

  const adminPlugins = findPluginsWithExtensions(plugins)

  await createMainExtensionsEntry(dest, adminPlugins, hasLocalExtensions)
  await writeTailwindContentFile(dest, adminPlugins)
}
