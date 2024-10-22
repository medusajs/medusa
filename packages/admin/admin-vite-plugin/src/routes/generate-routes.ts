import fs from "fs/promises"
import { outdent } from "outdent"
import { File, parse, ParseResult } from "../babel"
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

  const routePath = getRoute(file)

  const imports = generateImports(file, index)
  const route = generateRoute(routePath, index)

  return {
    imports,
    route,
  }
}

async function isValidRouteFile(file: string): Promise<boolean> {
  const code = await fs.readFile(file, "utf-8")

  let ast: ParseResult<File> | null = null

  try {
    ast = parse(code, getParserOptions(file))
  } catch (e) {
    logger.error("An error occurred while parsing the file.", {
      file,
      error: e,
    })
    return false
  }

  try {
    return await hasDefaultExport(ast)
  } catch (e) {
    logger.error(
      `An error occurred while checking for a default export in ${file}. The file will be ignored. See the below error for more details:\n${e}`
    )
    return false
  }
}

function generateImports(file: string, index: number): string[] {
  const imports: string[] = []
  const route = generateRouteComponentName(index)
  const importPath = normalizePath(file)

  imports.push(`import ${route} from "${importPath}"`)

  return imports
}

function generateRoute(route: string, index: number): Route {
  return {
    Component: generateRouteComponentName(index),
    path: route,
  }
}

function generateRouteComponentName(index: number): string {
  return `RouteComponent${index}`
}
