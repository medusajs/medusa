import fse from "fs-extra"
import path from "node:path"
import dedent from "ts-dedent"
import { copyFilter } from "./copy-filter"
import { logger } from "./logger"
import { findAllValidPages, findAllValidWidgets } from "./validate-extensions"

const FILE_EXT_REGEX = /\.[^/.]+$/

async function copyLocalExtensions(src: string, dest: string) {
  try {
    await fse.copy(src, dest, {
      filter: copyFilter,
    })
  } catch (err) {
    logger.panic(
      `Could not copy local extensions to cache folder. ${err.message}`
    )
  }
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

  await copyLocalExtensions(
    localAdminDir,
    path.resolve(dest, "admin", "src", "extensions")
  )

  const localWidgets = await findAllValidWidgets(
    path.resolve(dest, "admin", "src", "extensions", "widgets")
  )

  const localRoutes = await findAllValidPages(
    path.resolve(dest, "admin", "src", "extensions", "routes")
  )

  const widgetsArray = localWidgets.map((file, index) => {
    const relativePath = path
      .relative(path.resolve(dest, "admin", "src", "extensions"), file)
      .replace(FILE_EXT_REGEX, "")

    return {
      importStatement: `import Widget${index}, { config as widgetConfig${index} } from "./${relativePath}"`,
      extension: `{ Component: Widget${index}, config: widgetConfig${index} }`,
    }
  })

  const routesArray = localRoutes.map((page, index) => {
    const relativePath = path
      .relative(path.resolve(dest, "admin", "src", "extensions"), page.file)
      .replace(FILE_EXT_REGEX, "")

    const importStatement = page.hasConfig
      ? `import Page${index}, { config as routeConfig${index} } from "./${relativePath}"`
      : `import Page${index} from "./${relativePath}"`

    const extension = page.hasConfig
      ? `{ Component: Page${index}, config: { ...routeConfig${index}, path: "${page.path}" } }`
      : `{ Component: Page${index}, config: { path: "${page.path}" } }`

    return {
      importStatement,
      extension,
    }
  })

  const extensionsArray = [...widgetsArray, ...routesArray]

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
    await fse.writeFile(
      path.resolve(dest, "admin", "src", "extensions", "_local-entry.ts"),
      extensionsEntry
    )
  } catch (err) {
    logger.panic(
      `Could not write entry file for the local extensions. ${err.message}`
    )
  }

  return true
}

function findPluginsWithExtensions(plugins: string[]) {
  const pluginsWithExtensions: string[] = []

  for (const plugin of plugins) {
    try {
      const pluginDir = require.resolve(plugin)
      const entrypoint = path.resolve(
        pluginDir,
        "dist",
        "admin",
        "_virtual",
        "_virtual_entry.js"
      )

      if (fse.existsSync(entrypoint)) {
        pluginsWithExtensions.push(plugin)
      }
    } catch (_err) {
      // no plugin found - noop
    }
  }

  return pluginsWithExtensions
}

async function writeTailwindContentFile(dest: string, plugins: string[]) {
  const tailwindContent = dedent`
    module.exports = {
      content: [
        ${plugins.map((plugin) => {
          const tailwindContentPath = path.relative(
            path.resolve(dest, "admin"),
            path.dirname(path.join(plugin, "..", ".."))
          )

          return `${tailwindContentPath}/**/*.{js,jsx,ts,tsx}`
        })}
      ],
    }
  
  `

  try {
    await fse.writeFile(
      path.resolve(dest, "admin", "tailwind.content.js"),
      tailwindContent
    )
  } catch (err) {
    logger.warn(
      `Unable to write the Tailwind content file to ${dest}. The admin UI will continue to function, but CSS classes applied to extensions from plugins may not be available.`
    )
  }
}

async function createMainExtensionsEntry(
  dest: string,
  plugins: string[],
  hasLocalExtensions: boolean
) {
  if (!plugins.length && !hasLocalExtensions) {
    return
  }

  const pluginsArray = plugins.map((plugin) => {
    const relativePath = path
      .relative(path.resolve(dest, "admin", "src", "extensions"), plugin)
      .replace(FILE_EXT_REGEX, "")

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
    await fse.writeFile(
      path.resolve(dest, "admin", "src", "extensions", "_main-entry.ts"),
      extensionsEntry
    )
  } catch (err) {
    logger.panic(`Could not write extensions entry file. ${err.message}`)
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
