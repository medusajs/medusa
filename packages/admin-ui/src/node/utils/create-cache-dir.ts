import {
  findAllValidPages,
  findAllValidWidgets,
  type ValidPageResult,
} from "@medusajs/admin-shared"
import fse from "fs-extra"
import path from "node:path"
import dedent from "ts-dedent"
import { logger } from "./logger"

type CreateExtensionsEntryArgs = {
  dest: string
  plugins?: string[]
}

async function createExtensionsEntry({
  dest,
  plugins = [],
}: CreateExtensionsEntryArgs) {
  // Discover extensions from local folder

  const localExtensionsPath = path.resolve(process.cwd(), "src", "admin")

  const hasLocalExtensions = await fse.pathExists(localExtensionsPath)

  let localWidgets: string[] = []
  let localPages: ValidPageResult[] = []

  if (hasLocalExtensions) {
    try {
      await fse.copy(
        localExtensionsPath,
        path.resolve(dest, "admin", "src", "extensions")
      )
    } catch (err) {
      logger.panic(
        `Could not copy local extensions to cache folder. ${err.message}`
      )
    }

    const widgetsPath = path.resolve(
      dest,
      "admin",
      "src",
      "extensions",
      "widgets"
    )

    const pagesPath = path.resolve(dest, "admin", "src", "extensions", "pages")

    localWidgets = await findAllValidWidgets(widgetsPath)
    localPages = await findAllValidPages(pagesPath)
  }

  const localWidgetsArray = localWidgets.map((file, index) => {
    const realPath = path
      .relative(path.resolve(dest, "admin", "src", "extensions"), file)
      .replace(/\.[^/.]+$/, "")

    return {
      importStatement: `import Widget${index}, { config as config${index} } from "./${realPath}"`,
      extension: `{ Component: Widget${index}, config: config${index} }`,
    }
  })

  const localPagesArray = localPages.map((page, index) => {
    const realPath = path.relative(
      path.resolve(dest, "admin", "src", "extensions"),
      page.file
    )

    const importStatement = page.hasConfig
      ? `import Page${index}, { config as config${index}} from "${realPath}"`
      : `import Page${index} from "${realPath}"`

    const extension = page.hasConfig
      ? `{ Component: Page${index}, config: { ...config${index}, path: ${page.path} } }`
      : `{ Component: Page${index}, config: { path: ${page.path} } }`

    return {
      importStatement,
      extension,
    }
  })

  const localExtensionsArray = [...localWidgetsArray, ...localPagesArray]

  const localExtensionsEntry = dedent`
      ${localExtensionsArray
        .map((extension) => extension.importStatement)
        .join(",\n")}


      const LocalEntry = {
        identifier: "local",
        extensions: [
          ${localExtensionsArray
            .map((extension) => extension.extension)
            .join(",\n")}
        ],
      }

      export default LocalEntry
  `

  await fse.writeFile(
    path.resolve(dest, "admin", "src", "extensions", "_local-entry.ts"),
    localExtensionsEntry
  )

  // Discover extensions from plugins

  const pluginsWithAdmin: string[] = []

  plugins.forEach((plugin) => {
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
        pluginsWithAdmin.push(entrypoint)
      }
    } catch (_err) {
      // no plugin found - noop
    }
  })

  const pluginsArray = pluginsWithAdmin.map((plugin) => {
    const realPath = path.relative(
      path.resolve(dest, "admin", "src", "extensions"),
      plugin
    )

    // Get the path up to the /_virtual folder
    const tailwindContentPath = path.relative(
      path.resolve(dest, "admin"),
      path.dirname(path.join(plugin, "..", ".."))
    )

    return {
      path: realPath,
      tailwindContentPath,
    }
  })

  const content = dedent`
    ${pluginsArray
      .map((plugin, index) => `import Plugin${index} "${plugin.path}"`)
      .join("\n")}
    import LocalEntry from "./_local-entry"

    const extensions = [${pluginsArray
      .map((_, index) => `Plugin${index}`)
      .join(", ")}${pluginsArray.length ? ", " : ""}LocalEntry]

    export default extensions
    
  `

  try {
    await fse.writeFile(
      path.resolve(dest, "admin", "src", "extensions", "_main-entry.ts"),
      content
    )
  } catch (err) {
    logger.panic(
      `Could not write extensions entry file to ${dest}. Please make sure you have write access to this folder.`
    )
  }

  // Write tailwind content so Tailwind will parse the classes in all plugins
  const tailwindContent = dedent`
    module.exports = {
      content: [
        ${pluginsArray
          .map(
            (plugin) => `"${plugin.tailwindContentPath}/**/*.{js,ts,jsx,tsx}"`
          )
          .join(",\n")}
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
      `Could not write tailwind content file to ${dest}. Please make sure you have write access to this folder. The admin UI will still work, but CSS classes applied to extensions from plugins might not be available.`
    )
  }
}

async function copyAdmin(dest: string) {
  const adminDir = path.resolve(__dirname, "..", "ui")
  const destDir = path.resolve(dest, "admin")

  try {
    await fse.copy(adminDir, destDir)
  } catch (err) {
    logger.panic(
      `Could not copy admin ui to ${destDir}. Please make sure you have write access to this folder.`
    )
  }
}

type CreateCacheDirArgs = {
  appDir: string
  plugins?: string[]
}

export async function createCacheDir({ appDir, plugins }: CreateCacheDirArgs) {
  const cacheDir = path.resolve(appDir, ".cache")

  await fse.emptyDir(cacheDir)

  await copyAdmin(cacheDir)

  await createExtensionsEntry({ dest: cacheDir, plugins })
}
