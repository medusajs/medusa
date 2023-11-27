import { parse, ParseResult, ParserOptions } from "@babel/parser"
import traverse, { NodePath } from "@babel/traverse"
import type {
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  ObjectExpression,
  ObjectMethod,
  ObjectProperty,
  SpreadElement,
} from "@babel/types"
import fse from "fs-extra"
import path from "path"
import { forbiddenRoutes, InjectionZone, injectionZones } from "../../client"
import { logger } from "./logger"
import { normalizePath } from "./normalize-path"

function isValidInjectionZone(zone: any): zone is InjectionZone {
  return injectionZones.includes(zone)
}

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

  if (zoneProperty.value.type === "StringLiteral") {
    zoneIsValid = isValidInjectionZone(zoneProperty.value.value)
  } else if (zoneProperty.value.type === "ArrayExpression") {
    zoneIsValid = zoneProperty.value.elements.every(
      (zone) =>
        zone.type === "StringLiteral" && isValidInjectionZone(zone.value)
    )
  }

  return zoneIsValid
}

function validateRouteConfigExport(
  properties: (ObjectMethod | ObjectProperty | SpreadElement)[]
): boolean {
  const linkProperty = properties.find(
    (p) =>
      p.type === "ObjectProperty" &&
      p.key.type === "Identifier" &&
      p.key.name === "link"
  ) as ObjectProperty | undefined

  // Link property is optional for routes
  if (!linkProperty) {
    return true
  }

  const linkValue = linkProperty.value as ObjectExpression

  let labelIsValid = false

  // Check that the linkProperty is an object and has a `label` property that is a string
  if (
    linkValue.properties.some(
      (p) =>
        p.type === "ObjectProperty" &&
        p.key.type === "Identifier" &&
        p.key.name === "label" &&
        p.value.type === "StringLiteral"
    )
  ) {
    labelIsValid = true
  }

  return labelIsValid
}

function validateSettingConfigExport(
  properties: (ObjectMethod | ObjectProperty | SpreadElement)[]
): boolean {
  const cardProperty = properties.find(
    (p) =>
      p.type === "ObjectProperty" &&
      p.key.type === "Identifier" &&
      p.key.name === "card"
  ) as ObjectProperty | undefined

  // Link property is required for settings
  if (!cardProperty) {
    return false
  }

  const cardValue = cardProperty.value as ObjectExpression

  let hasLabel = false
  let hasDescription = false

  if (
    cardValue.properties.some(
      (p) =>
        p.type === "ObjectProperty" &&
        p.key.type === "Identifier" &&
        p.key.name === "label" &&
        p.value.type === "StringLiteral"
    )
  ) {
    hasLabel = true
  }

  if (
    cardValue.properties.some(
      (p) =>
        p.type === "ObjectProperty" &&
        p.key.type === "Identifier" &&
        p.key.name === "description" &&
        p.value.type === "StringLiteral"
    )
  ) {
    hasDescription = true
  }

  return hasLabel && hasDescription
}

function validateConfigExport(
  path: NodePath<ExportNamedDeclaration>,
  type: "widget" | "route" | "setting"
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

      if (type === "widget") {
        hasValidConfigExport = validateWidgetConfigExport(properties)
      }

      if (type === "route") {
        hasValidConfigExport = validateRouteConfigExport(properties)
      }

      if (type === "setting") {
        hasValidConfigExport = validateSettingConfigExport(properties)
      }
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
      try {
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
      } catch (e) {
        logger.error(
          `There was an error while validating the default export of ${path}. The following error must be resolved before continuing:`,
          {
            error: e,
          }
        )
        return false
      }
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
      `An error occurred while parsing the Widget "${file}", and the Widget cannot be injected. The following error must be resolved before continuing:`,
      {
        error: e,
      }
    )
    return false
  }

  let hasConfigExport = false
  let hasComponentExport = false

  try {
    traverse(ast, {
      ExportDefaultDeclaration: (path) => {
        hasComponentExport = validateDefaultExport(path, ast)
      },
      ExportNamedDeclaration: (path) => {
        hasConfigExport = validateConfigExport(path, "widget")
      },
    })
  } catch (e) {
    logger.error(
      `An error occurred while validating the Widget "${file}". The following error must be resolved before continuing:`,
      {
        error: e,
      }
    )
    return false
  }

  if (hasConfigExport && !hasComponentExport) {
    if (!hasComponentExport) {
      logger.error(
        `The default export in the Widget "${file}" is invalid and the widget will not be injected. Please make sure that the default export is a valid React component.`
      )
    }
  }

  if (!hasConfigExport && hasComponentExport) {
    logger.error(
      `The Widget config export in "${file}" is invalid and the Widget cannot be injected. Please ensure that the config is valid.`
    )
  }

  return hasConfigExport && hasComponentExport
}

/**
 * This function takes a file path and converts it to a URL path.
 * It converts the file path to a URL path by replacing any
 * square brackets with colons, and then removing the "page.[jt]s" suffix.
 */
function createPath(filePath: string): string {
  const normalizedPath = normalizePath(filePath)

  const regex = /\[(.*?)\]/g
  const strippedPath = normalizedPath.replace(regex, ":$1")

  const url = strippedPath.replace(/\/page\.[jt]sx?$/i, "")

  return url
}

function isForbiddenRoute(path: any): boolean {
  return forbiddenRoutes.includes(path)
}

function validatePath(
  path: string,
  origin: string
): {
  valid: boolean
  error: string
} {
  if (isForbiddenRoute(path)) {
    return {
      error: `A route from ${origin} is using a forbidden path: ${path}.`,
      valid: false,
    }
  }

  const specialChars = ["/", ":", "-"]

  for (let i = 0; i < path.length; i++) {
    const currentChar = path[i]

    if (
      !specialChars.includes(currentChar) &&
      !/^[a-z0-9]$/i.test(currentChar)
    ) {
      return {
        error: `A route from ${origin} is using an invalid path: ${path}. Only alphanumeric characters, "/", ":", and "-" are allowed.`,
        valid: false,
      }
    }

    if (currentChar === ":" && (i === 0 || path[i - 1] !== "/")) {
      return {
        error: `A route from ${origin} is using an invalid path: ${path}. All dynamic segments must be preceded by a "/".`,
        valid: false,
      }
    }
  }

  return {
    valid: true,
    error: "",
  }
}

/**
 * Validates that a file is a valid route.
 * This is determined by checking if the file exports a valid React component
 * as the default export, and a optional route config as a named export.
 * If the file is not a valid route, `null` is returned.
 * If the file is a valid route, a `ValidRouteResult` is returned.
 */
async function validateRoute(
  file: string,
  basePath: string
): Promise<{
  path: string
  hasConfig: boolean
  file: string
} | null> {
  const cleanPath = createPath(file.replace(basePath, ""))

  const { valid, error } = validatePath(cleanPath, file)

  if (!valid) {
    logger.error(
      `The path ${cleanPath} for the UI Route "${file}" is invalid and the route cannot be injected. The following error must be fixed before the route can be injected: ${error}`
    )

    return null
  }

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

  let ast: ParseResult<any>

  try {
    ast = parse(content, parserOptions)
  } catch (e) {
    logger.error(
      `An error occurred while parsing the UI Route "${file}", and the UI Route cannot be injected. The following error must be resolved before continuing:`,
      {
        error: e,
      }
    )
    return null
  }

  try {
    traverse(ast, {
      ExportDefaultDeclaration: (path) => {
        hasComponentExport = validateDefaultExport(path, ast)
      },
      ExportNamedDeclaration: (path) => {
        hasConfigExport = validateConfigExport(path, "route")
      },
    })
  } catch (e) {
    logger.error(
      `An error occurred while validating the UI Route "${file}", and the UI Route cannot be injected. The following error must be resolved before continuing:`,
      {
        error: e,
      }
    )
    return null
  }

  if (!hasComponentExport) {
    logger.error(
      `The default export in the UI Route "${file}" is invalid and the route cannot be injected. Please make sure that the default export is a valid React component.`
    )

    return null
  }

  return {
    path: cleanPath,
    hasConfig: hasConfigExport,
    file,
  }
}

async function validateSetting(file: string, basePath: string) {
  const cleanPath = createPath(file.replace(basePath, ""))

  const { valid, error } = validatePath(cleanPath, file)

  if (!valid) {
    logger.error(
      `The path ${cleanPath} for the Setting "${file}" is invalid and the setting cannot be injected. The following error must be fixed before the Setting can be injected: ${error}`
    )

    return null
  }

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

  let ast: ParseResult<any>

  try {
    ast = parse(content, parserOptions)
  } catch (e) {
    logger.error(
      `
      An error occured while parsing the Setting "${file}". The following error must be resolved before continuing:
      `,
      {
        error: e,
      }
    )

    return null
  }

  try {
    traverse(ast, {
      ExportDefaultDeclaration: (path) => {
        hasComponentExport = validateDefaultExport(path, ast)
      },
      ExportNamedDeclaration: (path) => {
        hasConfigExport = validateConfigExport(path, "setting")
      },
    })
  } catch (e) {
    logger.error(
      `
      An error occured while validating the Setting "${file}". The following error must be resolved before continuing:`,
      {
        error: e,
      }
    )
    return null
  }

  if (!hasComponentExport) {
    logger.error(
      `The default export in the Setting "${file}" is invalid and the page will not be injected. Please make sure that the default export is a valid React component.`
    )

    return null
  }

  if (!hasConfigExport) {
    logger.error(
      `The named export "config" in the Setting "${file}" is invalid or missing and the settings page will not be injected. Please make sure that the file exports a valid config.`
    )

    return null
  }

  return {
    path: cleanPath,
    file,
  }
}

async function findAllValidSettings(dir: string) {
  const settingsFiles: string[] = []

  const dirExists = await fse.pathExists(dir)

  if (!dirExists) {
    return []
  }

  const paths = await fse.readdir(dir)

  let hasSubDirs = false

  // We only check the first level of directories for settings files
  for (const pa of paths) {
    const filePath = path.join(dir, pa)
    const fileStat = await fse.stat(filePath)

    if (fileStat.isDirectory()) {
      const files = await fse.readdir(filePath)

      for (const file of files) {
        const filePath = path.join(dir, pa, file)
        const fileStat = await fse.stat(filePath)

        if (fileStat.isFile() && /^(.*\/)?page\.[jt]sx?$/i.test(file)) {
          settingsFiles.push(filePath)
          break
        } else if (fileStat.isDirectory()) {
          hasSubDirs = true
        }
      }
    }
  }

  if (hasSubDirs) {
    logger.warn(
      `The directory ${dir} contains subdirectories. Settings do not support nested routes, only UI Routes support nested paths.`
    )
  }

  const validSettingsFiles = await Promise.all(
    settingsFiles.map(async (file) => validateSetting(file, dir))
  )

  return validSettingsFiles.filter((file) => file !== null)
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
 * Scans a directory for valid routes.
 * A valid route is a file that exports a optional route config and a valid React component.
 */
async function findAllValidRoutes(dir: string) {
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
      } else if (fileStat.isFile() && /^(.*\/)?page\.[jt]sx?$/i.test(file)) {
        pageFiles.push(filePath)
      }
    }
  }

  await traverseDirectory(dir)

  const promises = pageFiles.map(async (file) => {
    return validateRoute(file, dir)
  })

  const validFiles = await Promise.all(promises)

  return validFiles.filter((file) => file !== null)
}

export {
  createPath,
  validateWidget,
  validateRoute,
  validateSetting,
  findAllValidSettings,
  findAllValidWidgets,
  findAllValidRoutes,
}
