import { fdir } from "fdir"
import MagicString from "magic-string"
import crypto from "node:crypto"
import path from "path"
import {
  File,
  isCallExpression,
  isIdentifier,
  isObjectExpression,
  isVariableDeclaration,
  isVariableDeclarator,
  ParseResult,
  traverse,
  type ExportNamedDeclaration,
  type NodePath,
  type ParserOptions,
} from "./babel"

export function normalizePath(file: string) {
  return path.normalize(file).replace(/\\/g, "/")
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

const VALID_FILE_EXTENSIONS = [".tsx", ".jsx"]

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

export async function hasDefaultExport(
  ast: ParseResult<File>
): Promise<boolean> {
  let hasDefaultExport = false
  traverse(ast, {
    ExportDefaultDeclaration() {
      hasDefaultExport = true
    },
  })
  return hasDefaultExport
}

export function generateHash(content: string) {
  return crypto.createHash("md5").update(content).digest("hex")
}

const ADMIN_SUBDIRECTORIES = ["routes", "custom-fields", "widgets"] as const

export type AdminSubdirectory = (typeof ADMIN_SUBDIRECTORIES)[number]

export function isFileInAdminSubdirectory(
  file: string,
  subdirectory: AdminSubdirectory
): boolean {
  const normalizedPath = normalizePath(file)
  return normalizedPath.includes(`/src/admin/${subdirectory}/`)
}

/**
 * Test util to normalize strings, so they can be compared without taking
 * whitespace into account.
 */
export function normalizeString(str: string): string {
  return str.replace(/\s+/g, " ").trim()
}
