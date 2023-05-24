import fse from "fs-extra"
import { dirname, join, relative, resolve } from "path"
import dedent from "ts-dedent"

const pathToEntry = join("dist", "admin", "_virtual", "_virtual_entry.js")

async function getLocalExtensions() {
  const entry = resolve(process.cwd(), pathToEntry)

  const hasLocalEntry = await fse.pathExists(entry)

  if (!hasLocalEntry) {
    return null
  }

  return entry
}

async function getPluginExtensions(): Promise<string[] | undefined> {
  const config = resolve(process.cwd(), "medusa-config.js")

  const hasConfig = await fse.pathExists(config)

  if (!hasConfig) {
    return null
  }

  const { plugins } = require(config) as {
    plugins: ({ resolve: string; options: Record<string, unknown> } | string)[]
  }

  if (!plugins) {
    return null
  }

  const pluginPaths = plugins.map((p) => {
    if (typeof p === "string") {
      return p
    }

    return p.resolve
  })

  const pluginPathsResolved = pluginPaths.map((p) => {
    return resolve(process.cwd(), "node_modules", p)
  })

  const pluginExtensions = await Promise.all(
    pluginPathsResolved.map(async (p) => {
      const entry = resolve(p, pathToEntry)

      const hasEntry = await fse.pathExists(entry)

      if (!hasEntry) {
        return null
      }

      return entry
    })
  )

  return pluginExtensions.filter((p) => p !== null) as string[]
}

async function getExtensions() {
  const localExtensions = await getLocalExtensions()
  const pluginExtensions = await getPluginExtensions()

  if (!localExtensions && !pluginExtensions) {
    return null
  }

  return [localExtensions, ...pluginExtensions]
}

function getRelativePaths(paths: string[], dest: string) {
  return paths.map((p) => {
    return relative(dirname(dest), p)
  })
}

async function writeTailwindConfigContent(
  extensionPaths: string[],
  basePath: string
) {
  const content = resolve(basePath, "tailwind.content.js")
  const config = resolve(basePath, "tailwind.config.js")

  // In case there are no extensions, we write an empty module
  if (!extensionPaths || extensionPaths.length === 0) {
    const empty = dedent`module.exports = {
      content: [],
    }
    
    `

    await fse.writeFile(content, empty)
    return
  }

  /**
   * Note that we use the config file as the base for the relative paths,
   * and not the content file. This is because the extensions need to be
   * relative to the config file, not the content file.
   */
  const relativePaths = getRelativePaths(extensionPaths, config)

  const dirNames = relativePaths
    .map((p) => {
      return dirname(p)
    })
    .map((p) => {
      return p.replace(/_virtual$/, "")
    })

  const module = dedent`
    module.exports = {
      content: [
        ${dirNames.map((d) => `"${d}/**/*.{js,ts,jsx,tsx}",`).join(`\n`)}
      ],
    }
    
  `

  await fse.writeFile(content, module)
}

async function writeExtensionsEntry(
  extensionPaths: string[],
  basePath: string
) {
  const entrypoint = resolve(basePath, "src", "extensions.ts")

  // In case there are no extensions, we write an empty module
  if (!extensionPaths || extensionPaths.length === 0) {
    const empty = dedent`
      const extensions = []

      export default extensions
      
    `

    await fse.writeFile(entrypoint, empty)
  }

  const relativePaths = getRelativePaths(extensionPaths, entrypoint)

  const imports = relativePaths
    .map((p, i) => {
      return `import ext${i} from "${p}"`
    })
    .join("\n")

  const exports = `export const extensions = [${relativePaths
    .map((_, i) => {
      return `ext${i}`
    })
    .join(", ")}]`

  const content = dedent`
    ${imports}

    ${exports}

    export default extensions
    
  `

  await fse.writeFile(entrypoint, content)
}

export async function injectExtensions() {
  const base = resolve(__dirname, "..", "..", "ui")
  const extensions = await getExtensions()

  await writeTailwindConfigContent(extensions, base)
  await writeExtensionsEntry(extensions, base)
}
