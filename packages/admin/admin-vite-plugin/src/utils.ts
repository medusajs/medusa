import {
  CustomFieldFormTab,
  CustomFieldModel,
  CustomFieldZone,
} from "@medusajs/admin-shared"
import { CustomFieldImportType } from "@medusajs/admin-shared/src/extensions/custom-fields/types"
import { fdir } from "fdir"
import MagicString from "magic-string"
import path from "path"
import {
  File,
  isCallExpression,
  isFunctionDeclaration,
  isIdentifier,
  isJSXElement,
  isJSXFragment,
  isObjectExpression,
  isObjectProperty,
  isVariableDeclaration,
  isVariableDeclarator,
  ObjectMethod,
  ObjectProperty,
  SpreadElement,
  traverse,
  type ExportDefaultDeclaration,
  type ExportNamedDeclaration,
  type NodePath,
  type ParserOptions,
} from "./babel"
import {
  CustomFieldConfigPath,
  CustomFieldDisplayPath,
  CustomFieldFieldPath,
  CustomFieldLinkPath,
} from "./types"

const VALID_FILE_EXTENSIONS = [".tsx", ".jsx"]

export function convertToImportPath(file: string) {
  return path.normalize(file).split(path.sep).join("/")
}

/**
 * Returns the module type of a given file.
 */
export function getModuleType(file: string) {
  const normalizedPath = convertToImportPath(file)

  if (normalizedPath.includes("/admin/widgets/")) {
    return "widget"
  } else if (normalizedPath.includes("/admin/routes/")) {
    return "route"
  } else if (normalizedPath.includes("/admin/custom-fields")) {
    return "custom-field"
  } else {
    return "none"
  }
}

/**
 * Returns the parser options for a given file.
 */
export function getParserOptions(file: string): ParserOptions {
  const options: ParserOptions = {
    sourceType: "module",
    plugins: ["jsx"],
  }

  if (file.endsWith(".tsx")) {
    options.plugins?.push("typescript")
  }

  return options
}

/**
 * Generates a module with a source map from a code string
 */
export function generateModule(code: string) {
  const magicString = new MagicString(code)

  return {
    code: magicString.toString(),
    map: magicString.generateMap({ hires: true }),
  }
}

/**
 * Crawls a directory and returns all files that match the criteria.
 */
export async function crawl(
  dir: string,
  file?: string,
  depth?: { min: number; max?: number }
) {
  const dirDepth = dir.split(path.sep).length

  const crawler = new fdir()
    .withBasePath()
    .exclude((dirName) => dirName.startsWith("_"))
    .filter((path) => {
      return VALID_FILE_EXTENSIONS.some((ext) => path.endsWith(ext))
    })

  if (file) {
    crawler.filter((path) => {
      return VALID_FILE_EXTENSIONS.some((ext) => path.endsWith(file + ext))
    })
  }

  if (depth) {
    crawler.filter((file) => {
      const pathDepth = file.split(path.sep).length - 1

      if (depth.max && pathDepth > dirDepth + depth.max) {
        return false
      }

      if (pathDepth < dirDepth + depth.min) {
        return false
      }

      return true
    })
  }

  return crawler.crawl(dir).withPromise()
}

/**
 * Extracts and returns the properties of a `config` object from a named export declaration.
 */
export function getConfigObjectProperties(
  path: NodePath<ExportNamedDeclaration>
) {
  const declaration = path.node.declaration

  if (isVariableDeclaration(declaration)) {
    const configDeclaration = declaration.declarations.find(
      (d) => isVariableDeclarator(d) && isIdentifier(d.id, { name: "config" })
    )

    if (
      configDeclaration &&
      isCallExpression(configDeclaration.init) &&
      configDeclaration.init.arguments.length > 0 &&
      isObjectExpression(configDeclaration.init.arguments[0])
    ) {
      return configDeclaration.init.arguments[0].properties
    }
  }

  return null
}

/**
 * Validates if the default export in a given AST is a component (JSX element or fragment).
 */
export function isDefaultExportComponent(
  path: NodePath<ExportDefaultDeclaration>,
  ast: File
): boolean {
  let hasComponentExport = false
  const declaration = path.node.declaration

  if (isFunctionDeclaration(declaration) || isIdentifier(declaration)) {
    const exportName = isIdentifier(declaration)
      ? declaration.name
      : declaration.id && declaration.id.name

    if (exportName) {
      try {
        traverse(ast, {
          VariableDeclarator({ node, scope }) {
            let isDefaultExport = false

            if (isIdentifier(node.id, { name: exportName })) {
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
                    isJSXElement(path.node.argument) ||
                    isJSXFragment(path.node.argument)
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
        return false
      }
    }
  }

  return hasComponentExport
}

export const getObjectPropertyValue = (
  name: string,
  properties: (ObjectMethod | ObjectProperty | SpreadElement)[]
) => {
  const property = properties.find(
    (p): p is ObjectProperty =>
      isObjectProperty(p) && isIdentifier(p.key, { name })
  )
  return property?.value
}

const getCustomFieldImportSegments = (importPath: string) => {
  const trimmedPath = importPath.replace("\0virtual:medusa/custom-fields/", "")

  const segments = trimmedPath.split("/")

  const model = segments[0] as CustomFieldModel
  const type = segments[segments.length - 1]

  const result: {
    model: CustomFieldModel
    zone?: CustomFieldZone
    tab?: CustomFieldFormTab
    type: CustomFieldImportType
  } = {
    model,
    type: type.slice(1) as CustomFieldImportType, // Remove the $ prefix
  }

  if (segments.length > 2) {
    result.zone = segments[1] as CustomFieldZone
  }
  if (segments.length > 3) {
    result.tab = segments[2] as CustomFieldFormTab
  }

  return result
}

export function getCustomFieldFieldParams(
  importPath: string
): CustomFieldFieldPath | null {
  const { model, zone, tab, type } = getCustomFieldImportSegments(importPath)

  if (type !== "field" || !zone) {
    return null
  }

  return {
    model,
    zone,
    tab,
  }
}

export function getCustomFieldDisplayParams(
  importPath: string
): CustomFieldDisplayPath | null {
  const { model, zone, type } = getCustomFieldImportSegments(importPath)

  if (type !== "display" || !zone) {
    return null
  }

  return {
    model,
    zone,
  }
}

export function getCustomFieldLinkParams(
  importPath: string
): CustomFieldLinkPath | null {
  const { model, type } = getCustomFieldImportSegments(importPath)

  if (type !== "link" || !model) {
    return null
  }

  return {
    model,
  }
}

export function getCustomFieldConfigParams(
  importPath: string
): CustomFieldConfigPath | null {
  const { model, zone, type } = getCustomFieldImportSegments(importPath)

  if (type !== "config" || !zone) {
    return null
  }

  return {
    model,
    zone,
  }
}
