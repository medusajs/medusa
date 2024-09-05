import { fdir } from "fdir"
import MagicString from "magic-string"
import path from "path"
import {
  File,
  traverse,
  type ExportDefaultDeclaration,
  type ExportNamedDeclaration,
  type NodePath,
  type ParserOptions,
} from "./babel"

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

  if (declaration && declaration.type === "VariableDeclaration") {
    const configDeclaration = declaration.declarations.find(
      (d) =>
        d.type === "VariableDeclarator" &&
        d.id.type === "Identifier" &&
        d.id.name === "config"
    )

    if (
      configDeclaration &&
      configDeclaration.init?.type === "CallExpression" &&
      configDeclaration.init.arguments.length > 0 &&
      configDeclaration.init.arguments[0].type === "ObjectExpression"
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
        return false
      }
    }
  }

  return hasComponentExport
}
