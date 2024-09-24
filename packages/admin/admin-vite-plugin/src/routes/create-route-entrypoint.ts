import fs from "fs/promises"
import outdent from "outdent"
import { File, parse, ParseResult, traverse } from "../babel"
import { logger } from "../logger"
import {
  convertToImportPath,
  crawl,
  getConfigObjectProperties,
  getParserOptions,
  hasDefaultExport,
} from "../utils"

type Route = {
  Component: string
  loader?: any
  path: string
}

type MenuItem = {
  icon?: string
  label: string
  path: string
}

type Page = {
  file: string
  hasConfig: boolean
}

type RouteResult = {
  imports: string[]
  route: Route
  menuItem: MenuItem | null
}

type RouteEntrypoint = {
  imports: string[]
  code: string
}

export async function createRouteEntrypoint(
  sources: Set<string>
): Promise<RouteEntrypoint> {
  const files = await getFilesFromSources(sources)
  const results = await getRouteResults(files)

  const imports = results.map((result) => result.imports).flat()
  const code = generateCode(results)

  return {
    imports,
    code,
  }
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

async function getRouteResults(files: string[]): Promise<RouteResult[]> {
  const results = (await Promise.all(files.map(parseFile))).filter(
    (result) => result !== null
  ) as RouteResult[]
  return results
}

function generateCode(results: RouteResult[]): string {
  return outdent`
    routing: {
        routes: [
            ${results.map((result) => formatRoute(result.route)).join(",\n")}
        ],
        menuItems: [
            ${results
              .map((result) => formatMenuItem(result.menuItem))
              .filter((menuItem) => menuItem !== "")
              .join(",\n")}
        ]
    }
  `
}

function formatRoute(route: Route): string {
  return `{
    Component: ${route.Component},
    ${route.loader ? `loader: ${route.loader},` : ""}
    path: "${route.path}",
  }`
}

function formatMenuItem(menuItem: MenuItem | null): string {
  if (!menuItem) {
    return ""
  }
  return `{
    ${menuItem.icon ? `icon: ${menuItem.icon},` : ""}
    label: ${menuItem.label},
    path: "${menuItem.path}",
  }`
}

function getRoute(file: string): string {
  const importPath = convertToImportPath(file)
  return importPath
    .replace(/.*\/admin\/(routes)/, "")
    .replace(/\[([^\]]+)\]/g, ":$1")
    .replace(/\/page\.(tsx|jsx)/, "")
}

async function getLoader(file: string): Promise<string | null> {
  const loaderExtensions = ["ts", "js", "tsx", "jsx"]
  for (const ext of loaderExtensions) {
    const loaderPath = file.replace(/\/page\.(tsx|jsx)/, `/loader.${ext}`)
    const exists = await fs.stat(loaderPath).catch(() => null)
    const code = await fs.readFile(file, "utf-8")
    const ast = parse(code, getParserOptions(file))

    let fileHasDefaultExport = false

    try {
      fileHasDefaultExport = await hasDefaultExport(ast)
    } catch (e) {
      logger.error(
        `An error occurred while checking for a default export in ${file}. The file will be ignored. See the below error for more details:\n${e}`
      )
    }

    if (exists && fileHasDefaultExport) {
      return loaderPath
    }
  }
  return null
}

async function getPage(file: string): Promise<Page | null> {
  const code = await fs.readFile(file, "utf-8")
  const ast = parse(code, getParserOptions(file))

  let fileHasDefaultExport = false

  try {
    fileHasDefaultExport = await hasDefaultExport(ast)
  } catch (e) {
    logger.error(
      `An error occurred while checking for a default export in ${file}. The file will be ignored. See the below error for more details:\n${e}`
    )
  }

  if (!fileHasDefaultExport) {
    return null
  }

  let hasConfig = false

  try {
    hasConfig = await checkForRouteConfig(ast)
  } catch (e) {
    logger.error(
      `An error occurred while checking for a route config in ${file}. If the file has a valid route config, it will not be included in the generated entrypoint. See the below error for more details:\n${e}`
    )
  }

  return {
    file,
    hasConfig,
  }
}

async function checkForRouteConfig(ast: ParseResult<File>): Promise<boolean> {
  let hasConfig = false

  traverse(ast, {
    ExportNamedDeclaration(path) {
      const properties = getConfigObjectProperties(path)
      if (!properties) {
        hasConfig = false
        return
      }
      const hasLabel = properties.some(
        (property) =>
          property.type === "ObjectProperty" &&
          property.key.type === "Identifier" &&
          property.key.name === "label"
      )
      hasConfig = hasLabel
    },
  })

  return hasConfig
}

async function parseFile(
  file: string,
  index: number
): Promise<RouteResult | null> {
  const pagePath = await getPage(file)
  const loaderPath = await getLoader(file)
  const routePath = getRoute(file)

  if (!pagePath) {
    return null
  }

  const imports = generateImports(pagePath, loaderPath, index)
  const route = generateRoute(routePath, loaderPath, index)
  const menuItem = generateMenuItem(pagePath, route.path, index)

  return {
    imports,
    route,
    menuItem,
  }
}

function generateRouteComponentName(index: number): string {
  return `RouteComponent${index}`
}

function generateRouteConfigName(index: number): string {
  return `RouteConfig${index}`
}

function generateRouteLoaderName(index: number): string {
  return `RouteLoader${index}`
}

function generateImports(
  page: Page,
  loader: string | null,
  index: number
): string[] {
  const imports: string[] = []
  const config = generateRouteConfigName(index)
  const route = generateRouteComponentName(index)
  const importPath = convertToImportPath(page.file)

  if (page.hasConfig) {
    imports.push(
      `import ${route}, { config as ${config} } from "${importPath}"`
    )
  } else {
    imports.push(`import ${route} from "${importPath}"`)
  }

  if (loader) {
    const loaderName = generateRouteLoaderName(index)
    imports.push(`import ${loaderName} from "${convertToImportPath(loader)}"`)
  }

  return imports
}

function generateMenuItem(
  page: Page,
  path: string,
  index: number
): MenuItem | null {
  if (!page.hasConfig) {
    return null
  }
  const config = generateRouteConfigName(index)
  return {
    label: `${config}.label`,
    icon: `${config}.icon`,
    path,
  }
}

function generateRoute(
  route: string,
  loader: string | null,
  index: number
): Route {
  return {
    Component: generateRouteComponentName(index),
    loader: loader ? generateRouteLoaderName(index) : undefined,
    path: route,
  }
}
