import fs from "fs/promises"
import { outdent } from "outdent"
import { parse } from "../babel"
import { logger } from "../logger"
import {
  crawl,
  getParserOptions,
  hasDefaultExport,
  normalizePath,
} from "../utils"
import { getRoute } from "./helpers"

type Route = {
  Component: string
  loader?: string
  path: string
}

type RouteResult = {
  imports: string[]
  route: Route
}

export async function generateRoutes(sources: Set<string>) {
  const files = await getFilesFromSources(sources)
  const results = await getRouteResults(files)

  const imports = results.map((result) => result.imports).flat()
  const code = generateCode(results)

  return {
    imports,
    code,
  }
}

function generateCode(results: RouteResult[]): string {
  return outdent`
        routes: [
            ${results.map((result) => formatRoute(result.route)).join(",\n")}
        ]
    }
  `
}

function formatRoute(route: Route): string {
  // return `{
  //   Component: ${route.Component},
  //   loader: ${route.loader ? route.loader : "undefined"},
  //   path: "${route.path}",
  // }`

  return `{
    Component: ${route.Component},
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

async function getRouteResults(files: string[]): Promise<RouteResult[]> {
  const results = (await Promise.all(files.map(parseFile))).filter(
    (result): result is RouteResult => result !== null
  )
  return results
}

async function parseFile(
  file: string,
  index: number
): Promise<RouteResult | null> {
  if (!(await isValidRouteFile(file))) {
    return null
  }

  const loaderPath = await getLoader(file)
  const routePath = getRoute(file)

  const imports = generateImports(file, loaderPath, index)
  const route = generateRoute(routePath, loaderPath, index)

  return {
    imports,
    route,
  }
}

async function isValidRouteFile(file: string): Promise<boolean> {
  const code = await fs.readFile(file, "utf-8")
  const ast = parse(code, getParserOptions(file))

  try {
    return await hasDefaultExport(ast)
  } catch (e) {
    logger.error(
      `An error occurred while checking for a default export in ${file}. The file will be ignored. See the below error for more details:\n${e}`
    )
    return false
  }
}

async function getLoader(file: string): Promise<string | null> {
  const loaderExtensions = ["ts", "js", "tsx", "jsx"]
  for (const ext of loaderExtensions) {
    const loaderPath = file.replace(/\/page\.(tsx|jsx)/, `/loader.${ext}`)
    const exists = await fs.stat(loaderPath).catch(() => null)
    if (exists) {
      return loaderPath
    }
  }
  return null
}

function generateImports(
  file: string,
  loader: string | null,
  index: number
): string[] {
  const imports: string[] = []
  const route = generateRouteComponentName(index)
  const importPath = normalizePath(file)

  imports.push(`import ${route} from "${importPath}"`)

  if (loader) {
    const loaderName = generateRouteLoaderName(index)
    imports.push(`import ${loaderName} from "${normalizePath(loader)}"`)
  }

  return imports
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

function generateRouteComponentName(index: number): string {
  return `RouteComponent${index}`
}

function generateRouteLoaderName(index: number): string {
  return `RouteLoader${index}`
}
