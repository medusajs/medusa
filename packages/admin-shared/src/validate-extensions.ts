import { parse, ParseResult, ParserOptions } from "@babel/parser"
import traverse, { NodePath } from "@babel/traverse"
import type {
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  ObjectMethod,
  ObjectProperty,
  SpreadElement,
} from "@babel/types"
import fse from "fs-extra"
import path from "node:path"
import { logger } from "./logger"
import { ValidPageResult } from "./types"
import { isValidInjectionZone } from "./utils"

/**
 * Validates that the widget config export is valid.
 * In order to be valid it must have a `zone` property that is either a `InjectionZone` or a `InjectionZone` array.
 */
function validateWidgetConfigExport(
  properties: (ObjectMethod | ObjectProperty | SpreadElement)[]
): boolean {
  const zoneProperty = properties.find(
    (p) =>
      p.type === "ObjectProperty" &&
      p.key.type === "Identifier" &&
      p.key.name === "zone"
  ) as ObjectProperty | undefined

  if (!zoneProperty) {
    return false
  }

  let zoneIsValid = false

  if (zoneProperty.value.type === "StringLiteral")
    zoneIsValid = isValidInjectionZone(zoneProperty.value.value)
  else if (zoneProperty.value.type === "ArrayExpression")
    zoneIsValid = zoneProperty.value.elements.every(
      (zone) =>
        zone.type === "StringLiteral" && isValidInjectionZone(zone.value)
    )

  return zoneIsValid
}

function validatePageConfigExport(
  properties: (ObjectMethod | ObjectProperty | SpreadElement)[]
): boolean {
  let isValidPageConfig = false

  return isValidPageConfig
}

function validateConfigExport(
  path: NodePath<ExportNamedDeclaration>,
  type: "widget" | "page"
) {
  let hasValidConfigExport = false

  const declaration = path.node.declaration
  if (declaration && declaration.type === "VariableDeclaration") {
    const configDeclaration = declaration.declarations.find(
      (d) =>
        d.type === "VariableDeclarator" &&
        d.id.type === "Identifier" &&
        d.id.name === "config"
    )

    if (
      configDeclaration &&
      configDeclaration.init.type === "ObjectExpression"
    ) {
      const properties = configDeclaration.init.properties

      hasValidConfigExport =
        type === "widget"
          ? validateWidgetConfigExport(properties)
          : validatePageConfigExport(properties)
    } else {
      hasValidConfigExport = false
    }
  }

  return hasValidConfigExport
}

/**
 * Validates that the default export of a file is a valid React component.
 * This is determined by checking if the default export is a function declaration
 * with a return statement that returns a JSX element or fragment.
 */
function validateDefaultExport(
  path: NodePath<ExportDefaultDeclaration>,
  ast: ParseResult<any>
) {
  let hasComponentExport = false

  const declaration = path.node.declaration
  if (
    declaration &&
    (declaration.type === "Identifier" ||
      declaration.type === "FunctionDeclaration")
  ) {
    const exportName =
      declaration.type === "Identifier"
        ? declaration.name
        : declaration.id && declaration.id.name

    if (exportName) {
      traverse(ast, {
        VariableDeclarator({ node, scope }) {
          let isDefaultExport = false

          if (node.id.type === "Identifier" && node.id.name === exportName) {
            isDefaultExport = true
          }

          if (!isDefaultExport) {
            return
          }

          traverse(
            node,
            {
              ReturnStatement(path) {
                if (
                  path.node.argument?.type === "JSXElement" ||
                  path.node.argument?.type === "JSXFragment"
                ) {
                  hasComponentExport = true
                }
              },
            },
            scope
          )
        },
      })
    }
  }

  return hasComponentExport
}

/**
 * Validates that a widget file has a valid default export and a valid config export.
 *
 */
async function validateWidget(file: string) {
  const content = await fse.readFile(file, "utf-8")

  const parserOptions: ParserOptions = {
    sourceType: "module",
    plugins: ["jsx"],
  }

  if (file.endsWith(".ts") || file.endsWith(".tsx")) {
    parserOptions.plugins.push("typescript")
  }

  let ast: ParseResult<any>

  try {
    ast = parse(content, parserOptions)
  } catch (e) {
    logger.error(
      `The widget ${file} is invalid and will not be injected. Please make sure that the widget is valid.`
    )
    return false
  }

  let hasConfigExport = false
  let hasComponentExport = false

  traverse(ast, {
    ExportDefaultDeclaration: (path) => {
      hasComponentExport = validateDefaultExport(path, ast)
    },
    ExportNamedDeclaration: (path) => {
      hasConfigExport = validateConfigExport(path, "widget")
    },
  })

  if (hasConfigExport && !hasComponentExport) {
    if (!hasComponentExport) {
      logger.error(
        `The default export in ${file} is invalid and the widget will not be injected. Please make sure that the default export is a valid React component.`
      )
    }
  }

  if (!hasConfigExport && hasComponentExport) {
    logger.error(
      `The widget config export in ${file} is invalid and the widget will not be injected. Please make sure that the config export is valid.`
    )
  }

  return hasConfigExport && hasComponentExport
}

/**
 * This function takes a file path and converts it to a URL path.
 * It converts the file path to a URL path by replacing any
 * square brackets with colons, and then removing the "page.[jt]s" suffix.
 */
function transformFilePath(filePath: string): string {
  const regex = /\[(.*?)\]/g
  const strippedPath = filePath.replace(regex, ":$1")
  const finalPath = strippedPath.replace(/\/page\.[jt]sx?$/i, "")

  return finalPath
}

/**
 * Validates that a file is a valid page.
 * This is determined by checking if the file exports a valid React component
 * as the default export, and a optional page config as a named export.
 * If the file is not a valid page, `null` is returned.
 * If the file is a valid page, a `ValidPageResult` is returned.
 */
async function validatePage(
  file: string,
  basePath: string
): Promise<ValidPageResult | null> {
  const url = transformFilePath(file.replace(basePath, ""))

  const content = await fse.readFile(file, "utf-8")

  let hasComponentExport = false
  let hasConfigExport = false

  const parserOptions: ParserOptions = {
    sourceType: "module",
    plugins: ["jsx"],
  }

  if (file.endsWith(".ts") || file.endsWith(".tsx")) {
    parserOptions.plugins.push("typescript")
  }

  const ast = parse(content, parserOptions)

  traverse(ast, {
    ExportDefaultDeclaration: (path) => {
      hasComponentExport = validateDefaultExport(path, ast)
    },
    ExportNamedDeclaration: (path) => {
      hasConfigExport = validateConfigExport(path, "page")
    },
  })

  if (!hasComponentExport) {
    logger.error(
      `The default export in ${file} is invalid and the page will not be injected. Please make sure that the default export is a valid React component.`
    )

    return null
  }

  return {
    path: url,
    hasConfig: hasConfigExport,
    file,
  }
}

/**
 * Scans a directory for valid widgets.
 * A valid widget is a file that exports a valid widget config and a valid React component.
 */
async function findAllValidWidgets(dir: string) {
  const jsxAndTsxFiles: string[] = []

  const dirExists = await fse.pathExists(dir)

  if (!dirExists) {
    return []
  }

  async function traverseDirectory(currentPath: string) {
    const files = await fse.readdir(currentPath)

    for (const file of files) {
      const filePath = path.join(currentPath, file)
      const fileStat = await fse.stat(filePath)

      if (fileStat.isDirectory()) {
        await traverseDirectory(filePath)
      } else if (fileStat.isFile() && /\.(js|jsx|ts|tsx)$/i.test(file)) {
        jsxAndTsxFiles.push(filePath)
      }
    }
  }

  await traverseDirectory(dir)

  const promises = jsxAndTsxFiles.map((file) => {
    const isValid = validateWidget(file)

    return isValid ? file : null
  })

  const validFiles = await Promise.all(promises)

  return validFiles.filter((file) => file !== null)
}

/**
 * Scans a directory for valid pages.
 * A valid page is a file that exports a optional page config and a valid React component.
 */
async function findAllValidPages(dir: string) {
  const pageFiles: string[] = []

  const dirExists = await fse.pathExists(dir)

  if (!dirExists) {
    return []
  }

  async function traverseDirectory(currentPath: string) {
    const files = await fse.readdir(currentPath)

    for (const file of files) {
      const filePath = path.join(currentPath, file)
      const fileStat = await fse.stat(filePath)

      if (fileStat.isDirectory()) {
        await traverseDirectory(filePath)
      } else if (fileStat.isFile() && /\/page\.[jt]sx?$/i.test(file)) {
        pageFiles.push(filePath)
      }
    }
  }

  await traverseDirectory(dir)

  const promises = pageFiles.map((file) => {
    return validatePage(file, dir)
  })

  const validFiles = await Promise.all(promises)

  return validFiles.filter((file) => file !== null)
}

export { validateWidget, validatePage, findAllValidWidgets, findAllValidPages }
