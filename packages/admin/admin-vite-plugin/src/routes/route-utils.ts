import fs from "fs/promises"
import {
  parse,
  traverse,
  type ExportNamedDeclaration,
  type File,
  type NodePath,
  type ObjectProperty,
  type ParseResult,
} from "../babel"
import {
  convertToImportPath,
  crawl,
  generateModule,
  getConfigObjectProperties,
  getParserOptions,
  isDefaultExportComponent,
} from "../utils"

function validateRouteConfig(
  path: NodePath<ExportNamedDeclaration>,
  resolveMenuItem: boolean
): { valid: boolean; config: boolean } {
  const properties = getConfigObjectProperties(path)

  /**
   * When resolving links for the sidebar, we a config to get the props needed to
   * render the link correctly.
   *
   * If the user has not provided any config, then the route can never be a valid
   * menu item, so we can skip the validation, and return false.
   */
  if (!properties && resolveMenuItem) {
    return { valid: false, config: false }
  }

  /**
   * A config is not required for a component to be a valid route.
   */
  if (!properties) {
    return { valid: true, config: false }
  }

  const labelProperty = properties.find(
    (p) =>
      p.type === "ObjectProperty" &&
      p.key.type === "Identifier" &&
      p.key.name === "label"
  ) as ObjectProperty | undefined

  const labelIsValid =
    !labelProperty || labelProperty.value.type === "StringLiteral"

  return { valid: labelIsValid, config: true }
}

export async function validateRoute(file: string, resolveMenuItem = false) {
  const content = await fs.readFile(file, "utf-8")
  const parserOptions = getParserOptions(file)

  let ast: ParseResult<File>

  try {
    ast = parse(content, parserOptions)
  } catch (_e) {
    return { valid: false, config: false }
  }

  let hasDefaultExport = false
  let hasNamedExport = resolveMenuItem ? false : true
  let hasConfig = false

  try {
    traverse(ast, {
      ExportDefaultDeclaration(path) {
        hasDefaultExport = isDefaultExportComponent(path, ast)
      },
      ExportNamedDeclaration(path) {
        const { valid, config } = validateRouteConfig(path, resolveMenuItem)
        hasNamedExport = valid
        hasConfig = config
      },
    })
  } catch (_e) {
    return { valid: false, config: false }
  }

  return { valid: hasNamedExport && hasDefaultExport, config: hasConfig }
}

function createRoutePath(file: string) {
  const importPath = convertToImportPath(file)

  return importPath
    .replace(/.*\/admin\/(routes|settings)/, "")
    .replace(/\[([^\]]+)\]/g, ":$1")
    .replace(/\/page\.(tsx|jsx)/, "")
}

export async function generateRouteEntrypoint(
  sources: Set<string>,
  type: "page" | "link"
) {
  const files = (
    await Promise.all(
      Array.from(sources).map(async (source) =>
        crawl(`${source}/routes`, "page", { min: 1 })
      )
    )
  ).flat()

  const validatedRoutes = (
    await Promise.all(
      files.map(async (route) => {
        const { valid } = await validateRoute(route, type === "link")
        return valid ? route : null
      })
    )
  ).filter(Boolean) as string[]

  if (!validatedRoutes.length) {
    const code = `export default {
        ${type}s: [],
      }`

    return { module: generateModule(code), paths: [] }
  }

  const importString = validatedRoutes
    .map((path, index) => {
      return type === "page"
        ? `import RouteExt${index} from "${convertToImportPath(path)}";`
        : `import { config as routeConfig${index} } from "${convertToImportPath(
            path
          )}";`
    })
    .join("\n")

  const exportString = `export default {
      ${type}s: [${validatedRoutes
    .map((file, index) => {
      return type === "page"
        ? `{ path: "${createRoutePath(file)}", Component: RouteExt${index} }`
        : `{ path: "${createRoutePath(file)}", ...routeConfig${index} }`
    })
    .join(", ")}],
    }`

  const code = `${importString}\n${exportString}`

  return { module: generateModule(code), paths: validatedRoutes }
}
