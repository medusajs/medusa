import {
  NESTED_ROUTE_POSITIONS,
  NestedRoutePosition,
} from "@medusajs/admin-shared"
import fs from "fs/promises"
import { outdent } from "outdent"
import {
  File,
  isIdentifier,
  isNumericLiteral,
  isObjectProperty,
  isStringLiteral,
  Node,
  ObjectProperty,
  parse,
  ParseResult,
  traverse,
} from "../babel"
import { logger } from "../logger"
import {
  crawl,
  getConfigObjectProperties,
  getParserOptions,
  normalizePath,
} from "../utils"
import { getRoute } from "./helpers"

type RouteConfig = {
  label: boolean
  icon: boolean
  nested?: NestedRoutePosition
  rank?: number
  translationNs?: string
}

type MenuItem = {
  icon?: string
  label: string
  path: string
  nested?: NestedRoutePosition
  rank?: number
  translationNs?: string
}

type MenuItemResult = {
  import: string
  menuItem: MenuItem
}

export async function generateMenuItems(sources: Set<string>) {
  const files = await getFilesFromSources(sources)
  const results = await getMenuItemResults(files)

  const imports = results.map((result) => result.import)
  const code = generateCode(results)

  return { imports, code }
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
  const { label, icon, path, nested, rank, translationNs } = route
  return `{
    label: ${label},
    icon: ${icon || "undefined"},
    path: "${path}",
    nested: ${nested ? `"${nested}"` : "undefined"},
    rank: ${rank !== undefined ? rank : "undefined"},
    translationNs: ${translationNs ? `${translationNs}` : "undefined"}
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
  const path = normalizePath(file)
  return `import { config as ${generateRouteConfigName(index)} } from "${path}"`
}

function generateMenuItem(
  config: RouteConfig,
  file: string,
  index: number
): MenuItem {
  const configName = generateRouteConfigName(index)
  return {
    label: `${configName}.label`,
    icon: config.icon ? `${configName}.icon` : undefined,
    path: getRoute(file),
    nested: config.nested,
    rank: config.rank,
    translationNs: config.translationNs
      ? `${configName}.translationNs`
      : undefined,
  }
}

async function getRouteConfig(file: string): Promise<RouteConfig | null> {
  const code = await fs.readFile(file, "utf-8")
  let ast: ParseResult<File> | null = null

  try {
    ast = parse(code, getParserOptions(file))
  } catch (e) {
    logger.error(`An error occurred while parsing the file.`, {
      file,
      error: e,
    })
    return null
  }

  let config: RouteConfig | null = null
  let configFound = false

  try {
    traverse(ast, {
      /**
       * For bundled files, the config will not be a named export,
       * but instead a variable declaration.
       */
      VariableDeclarator(path) {
        if (configFound) {
          return
        }

        const properties = getConfigObjectProperties(path)
        if (!properties) {
          return
        }

        config = processConfigProperties(properties, file)

        if (config) {
          configFound = true
        }
      },
      /**
       * For unbundled files, the `config` will always be a named export.
       */
      ExportNamedDeclaration(path) {
        if (configFound) {
          return
        }

        const properties = getConfigObjectProperties(path)
        if (!properties) {
          return
        }

        config = processConfigProperties(properties, file)

        if (config) {
          configFound = true
        }
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

function processConfigProperties(
  properties: Node[],
  file: string
): RouteConfig | null {
  const hasProperty = (name: string) =>
    properties.some(
      (prop) => isObjectProperty(prop) && isIdentifier(prop.key, { name })
    )

  const hasLabel = hasProperty("label")
  if (!hasLabel) {
    return null
  }

  const nested = properties.find(
    (prop) =>
      isObjectProperty(prop) && isIdentifier(prop.key, { name: "nested" })
  ) as ObjectProperty | undefined

  let nestedValue: string | undefined

  if (isStringLiteral(nested?.value)) {
    nestedValue = nested.value.value
  }

  if (
    nestedValue &&
    !NESTED_ROUTE_POSITIONS.includes(nestedValue as NestedRoutePosition)
  ) {
    logger.error(
      `Invalid nested route position: "${nestedValue}". Allowed values are: ${NESTED_ROUTE_POSITIONS.join(
        ", "
      )}`,
      { file }
    )
    return null
  }

  const translationNs = properties.find(
    (prop) =>
      isObjectProperty(prop) && isIdentifier(prop.key, { name: "translationNs" })
  ) as ObjectProperty | undefined

  let translationNsValue: string | undefined = undefined

  if (isStringLiteral(translationNs?.value)) {
    translationNsValue = translationNs.value.value
  }

  const rank = properties.find(
    (prop) =>
      isObjectProperty(prop) && isIdentifier(prop.key, { name: "rank" })
  ) as ObjectProperty | undefined

  let rankValue: number | undefined

  if (isNumericLiteral(rank?.value)) {
    rankValue = rank.value.value
  }

  return {
    label: hasLabel,
    icon: hasProperty("icon"),
    nested: nestedValue as NestedRoutePosition | undefined,
    rank: rankValue,
    translationNs: translationNsValue,
  }
}

function generateRouteConfigName(index: number): string {
  return `RouteConfig${index}`
}
