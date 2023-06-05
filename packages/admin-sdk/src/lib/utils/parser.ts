import { parse, ParseResult, ParserOptions } from "@babel/parser"
import traverse from "@babel/traverse"
import type { ObjectMethod, ObjectProperty, SpreadElement } from "@babel/types"
import {
  ExtensionType,
  extensionTypes,
  InjectionZone,
  injectionZones,
} from "@medusajs/admin-shared"
import fse from "fs-extra"
import path from "path"
import { createLogger } from "./logger"

const logger = createLogger()

/**
 * Finds all `js`, `ts`, `jsx`, and `tsx` files in the given directory
 * @param directoryPath - path of directory to search
 * @returns array of file paths
 */
async function findFiles(directoryPath: string): Promise<string[]> {
  const jsxAndTsxFiles: string[] = []

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

  await traverseDirectory(directoryPath)
  return jsxAndTsxFiles
}

/**
 * Tests if the given value is a valid extension type
 */
function isValidType(val: any): val is ExtensionType {
  return extensionTypes.includes(val)
}

/**
 * Tests if the given properties are valid for a route config
 * @param properties
 * @returns
 */
function validateRouteConfig(
  properties: (ObjectMethod | ObjectProperty | SpreadElement)[]
): boolean {
  const pathProperty = properties.find(
    (p) =>
      p.type === "ObjectProperty" &&
      p.key.type === "Identifier" &&
      p.key.name === "path"
  ) as ObjectProperty | undefined

  if (!pathProperty) {
    return false
  }

  const pathValue =
    pathProperty.value.type === "StringLiteral"
      ? pathProperty.value.value
      : null

  if (!pathValue) {
    return false
  }

  const titleProperty = properties.find(
    (p) =>
      p.type === "ObjectProperty" &&
      p.key.type === "Identifier" &&
      p.key.name === "title"
  ) as ObjectProperty | undefined

  if (!titleProperty) {
    return false
  }

  const titleValue =
    titleProperty.value.type === "StringLiteral"
      ? titleProperty.value.value
      : null

  if (!titleValue) {
    return false
  }

  return true
}

/**
 * Tests if the given value is a valid injection zone
 * @param val
 * @returns
 */
function isValidZone(val: any): val is InjectionZone {
  return injectionZones.includes(val)
}

/**
 * Tests if the given properties are valid for a widget config
 * @param properties
 * @returns
 */
function validateWidgetConfig(
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
    zoneIsValid = isValidZone(zoneProperty.value.value)
  else if (zoneProperty.value.type === "ArrayExpression")
    zoneIsValid = zoneProperty.value.elements.every(
      (zone) => zone.type === "StringLiteral" && isValidZone(zone.value)
    )

  return zoneIsValid
}

function validateNestedRouteConfig(
  properties: (ObjectMethod | ObjectProperty | SpreadElement)[]
): boolean {
  const pathProperty = properties.find(
    (p) =>
      p.type === "ObjectProperty" &&
      p.key.type === "Identifier" &&
      p.key.name === "path"
  ) as ObjectProperty | undefined

  if (!pathProperty) {
    return false
  }

  const pathValue =
    pathProperty.value.type === "StringLiteral"
      ? pathProperty.value.value
      : null

  if (!pathValue) {
    return false
  }

  const parentProperty = properties.find(
    (p) =>
      p.type === "ObjectProperty" &&
      p.key.type === "Identifier" &&
      p.key.name === "parent"
  ) as ObjectProperty | undefined

  if (!parentProperty) {
    return false
  }

  const parentValue =
    parentProperty.value.type === "StringLiteral"
      ? parentProperty.value.value
      : null

  if (!parentValue) {
    return false
  }

  return true
}

/**
 * Tests if the given properties are valid for a extension config
 * @param properties
 * @returns
 */
function validateConfig(
  properties: (ObjectMethod | ObjectProperty | SpreadElement)[]
): boolean {
  let isValidConfig = false

  const typeProperty = properties.find(
    (p) =>
      p.type === "ObjectProperty" &&
      p.key.type === "Identifier" &&
      p.key.name === "type"
  ) as ObjectProperty | undefined

  if (!typeProperty) {
    return false
  }

  const typeValue =
    typeProperty.value.type === "StringLiteral" &&
    isValidType(typeProperty.value.value)
      ? typeProperty.value.value
      : null

  if (!typeValue) {
    return false
  }

  if (typeValue === "route") {
    isValidConfig = validateRouteConfig(properties)
  }

  if (typeValue === "nested-route") {
    isValidConfig = validateNestedRouteConfig(properties)
  }

  if (typeValue === "widget") {
    isValidConfig = validateWidgetConfig(properties)
  }

  return isValidConfig
}

export async function findExtensions(directory: string) {
  const filesWithExports: string[] = []

  // Recursively find all files in the directory that have a extenssion of .js, .ts, .jsx or .tsx
  const files = await findFiles(directory)

  await Promise.all(
    files.map(async (file) => {
      const fileContent = await fse.readFile(file, "utf-8")

      // Parse the code using @babel/parser
      const parserOptions: ParserOptions = {
        sourceType: "module",
        plugins: ["jsx"],
      }

      if (file.endsWith(".ts") || file.endsWith(".tsx")) {
        parserOptions.plugins?.push("typescript")
      }

      const ast = parse(fileContent, parserOptions)

      let hasConfigExport = false
      let hasComponentExport = false

      traverse(ast, {
        ExportNamedDeclaration(path) {
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

              hasConfigExport = validateConfig(properties)
            }
          }
        },
        ExportDefaultDeclaration(path) {
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
              const isReactComponent = isComponentExport(ast, exportName)
              if (isReactComponent) {
                hasComponentExport = true
              }
            }
          }
        },
      })

      if (hasConfigExport && !hasComponentExport) {
        logger.warn(
          `File "${file}" has a config export but no default component export. If this is an extension, make sure that the default export is a React component. Skipping...`
        )
      }

      if (hasConfigExport && hasComponentExport) {
        filesWithExports.push(file)
      }
    })
  )

  return filesWithExports
}

/**
 * Checks if the default export is a React component
 * @param ast
 * @param exportName
 * @returns
 */
function isComponentExport(ast: ParseResult<any>, exportName: string): boolean {
  let isComponent = false

  // Traverse the AST to find the declaration of the default export using the exportName
  traverse(ast, {
    VariableDeclarator({ node, scope }) {
      let isDefaultExport = false

      if (node.id.type === "Identifier" && node.id.name === exportName) {
        isDefaultExport = true
      }

      if (!isDefaultExport) {
        return
      }

      // Check if the ReturnStatement is returning a JSXElement, if true the default export is a React component
      traverse(
        node,
        {
          ReturnStatement(path) {
            if (
              path.node.argument?.type === "JSXElement" ||
              path.node.argument?.type === "JSXFragment"
            ) {
              isComponent = true
            }
          },
        },
        scope
      )
    },
  })

  return isComponent
}
