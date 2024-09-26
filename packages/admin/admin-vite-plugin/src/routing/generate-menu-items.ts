import crypto from "crypto"
import fs from "fs/promises"
import { outdent } from "outdent"
import { isIdentifier, isObjectProperty, parse, traverse } from "../babel"
import { logger } from "../logger"
import { crawl, getConfigObjectProperties, getParserOptions } from "../utils"
import { getRoute } from "./helpers"

type MenuItem = {
  icon?: string
  label: string
  path: string
}

type MenuItemResult = {
  import: string
  menuItem: MenuItem
}

export async function generateMenuItems(sources: Set<string>) {
  const files = await getFilesFromSources(sources)
  const results = await getMenuItemResults(files)

  const imports = results.map((result) => result.import).flat()
  const code = generateCode(results)

  return {
    imports,
    code,
  }
}

function generateCode(results: MenuItemResult[]): string {
  return outdent`
        menuItems: [
            ${results
              .map((result) => formatMenuItem(result.menuItem))
              .join(",\n")}
        ]
    }
  `
}

function formatMenuItem(route: MenuItem): string {
  return `{
    label: ${route.label},
    icon: ${route.icon ? route.icon : "undefined"},
    path: "${route.path}",
  }`
}

async function getFilesFromSources(sources: Set<string>): Promise<string[]> {
  const files = (
    await Promise.all(
      Array.from(sources).map(async (source) =>
        crawl(`${source}/routes`, "page", { min: 1 })
      )
    )
  ).flat()
  return files
}

async function getMenuItemResults(files: string[]): Promise<MenuItemResult[]> {
  const results = await Promise.all(files.map(parseFile))
  return results.filter((item): item is MenuItemResult => item !== null)
}

async function parseFile(
  file: string,
  index: number
): Promise<MenuItemResult | null> {
  const config = await getRouteConfig(file)

  if (!config) {
    return null
  }

  if (!config.label) {
    logger.warn(`Config is missing a label.`, {
      file,
    })
  }

  const import_ = generateImport(file, index)
  const menuItem = generateMenuItem(config, file, index)

  return {
    import: import_,
    menuItem,
  }
}

function generateImport(file: string, index: number): string {
  return `import { config as ${generateRouteConfigName(index)} } from "${file}"`
}

function generateMenuItem(
  config: { label: boolean; icon: boolean },
  file: string,
  index: number
): MenuItem {
  const configName = generateRouteConfigName(index)
  const routePath = getRoute(file)

  return {
    label: `${configName}.label`,
    icon: config.icon ? `${configName}.icon` : undefined,
    path: routePath,
  }
}

async function getRouteConfig(
  file: string
): Promise<{ label: boolean; icon: boolean } | null> {
  const code = await fs.readFile(file, "utf-8")
  const ast = parse(code, getParserOptions(file))

  let config: { label: boolean; icon: boolean } | null = null

  try {
    traverse(ast, {
      ExportNamedDeclaration(path) {
        const properties = getConfigObjectProperties(path)

        if (!properties) {
          return
        }

        const hasLabel = properties.some(
          (prop) =>
            isObjectProperty(prop) && isIdentifier(prop.key, { name: "label" })
        )

        if (!hasLabel) {
          return
        }

        const hasIcon = properties.some(
          (prop) =>
            isObjectProperty(prop) && isIdentifier(prop.key, { name: "icon" })
        )

        config = { label: hasLabel, icon: hasIcon }
      },
    })
  } catch (e) {
    logger.error(`An error occurred while traversing the file.`, {
      file,
      error: e,
    })
  }

  return config
}

function generateRouteConfigName(index: number): string {
  return `RouteConfig${index}`
}

export async function generateRouteConfigHash(
  sources: Set<string>
): Promise<string> {
  const files = await getFilesFromSources(sources)
  const configContents = await Promise.all(files.map(getRouteConfigContent))
  const totalContent = configContents.filter(Boolean).join("")
  return crypto.createHash("md5").update(totalContent).digest("hex")
}

async function getRouteConfigContent(file: string) {
  const code = await fs.readFile(file, "utf-8")
  const ast = parse(code, getParserOptions(file))

  let configContent: string | null = null

  try {
    traverse(ast, {
      ExportNamedDeclaration(path) {
        const properties = getConfigObjectProperties(path)
        if (properties) {
          configContent = code.slice(path.node.start!, path.node.end!)
        }
      },
    })
  } catch (e) {
    logger.error(
      `An error occurred while traversing the file. Due to the error we cannot validate whether the route config has changed. If your changes aren't correctly reflected try restarting the dev server.`,
      {
        file,
        error: e,
      }
    )
    return null
  }

  return configContent || null
}
