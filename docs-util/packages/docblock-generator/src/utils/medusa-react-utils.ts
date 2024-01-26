import path from "path"
import getMonorepoRoot from "./get-monorepo-root.js"
import ts from "typescript"
import { minimatch } from "minimatch"
import { capitalize } from "./str-formatting.js"

export const kindsCanHaveNamespace = [
  ts.SyntaxKind.SourceFile,
  ts.SyntaxKind.ClassDeclaration,
  ts.SyntaxKind.EnumDeclaration,
  ts.SyntaxKind.ModuleDeclaration,
  ts.SyntaxKind.InterfaceDeclaration,
  ts.SyntaxKind.TypeAliasDeclaration,
  ts.SyntaxKind.MethodDeclaration,
  ts.SyntaxKind.MethodSignature,
  ts.SyntaxKind.FunctionDeclaration,
  ts.SyntaxKind.ArrowFunction,
  ts.SyntaxKind.VariableStatement,
]

export const pathsHavingCustomNamespace = [
  "**/packages/medusa\\-react/src/hooks/**/index.ts",
  "**/packages/medusa\\-react/src/@(helpers|contexts)/**/*.@(tsx|ts)",
]

export const CUSTOM_NAMESPACE_TAG = "@customNamespace"

/**
 * Get the path used with the {@link CUSTOM_NAMESPACE_TAG}.
 *
 * @param {ts.Node} node - The node to retrieve its custom namespace path.
 * @returns {string} The namespace path.
 */
export function getNamespacePath(node: ts.Node): string {
  const packagePathPrefix = `${path.resolve(
    getMonorepoRoot(),
    "packages/medusa-react/src"
  )}/`

  const sourceFile = node.getSourceFile()

  let hookPath = path
    .dirname(sourceFile.fileName)
    .replace(packagePathPrefix, "")

  const fileName = path.basename(sourceFile.fileName)

  if (
    !fileName.startsWith("index") &&
    !fileName.startsWith("mutations") &&
    !fileName.startsWith("queries")
  ) {
    hookPath += `/${fileName.replace(path.extname(fileName), "")}`
  }

  return hookPath
    .split("/")
    .map((pathItem, index) => {
      if (index === 0) {
        pathItem = pathItem
          .replace("contexts", "providers")
          .replace("helpers", "utilities")
      }

      return pathItem
        .split("-")
        .map((item) => capitalize(item))
        .join(" ")
    })
    .join(".")
}

/**
 * Retrieves the full tag of the custom namespace with its value.
 *
 * @param {ts.Node} node - The node to retrieve its custom namespace path.
 * @returns {string} The custom namespace tag and value.
 */
export function getCustomNamespaceTag(node: ts.Node): string {
  return `${CUSTOM_NAMESPACE_TAG} ${getNamespacePath(node)}`
}

/**
 * Checks whether a node should have a custom namespace path.
 *
 * @param {ts.Node} node - The node to check.
 * @returns {boolean} Whether the node should have a custom namespace.
 */
export function shouldHaveCustomNamespace(node: ts.Node): boolean {
  if (!kindsCanHaveNamespace.includes(node.kind)) {
    return false
  }

  const fileName = node.getSourceFile().fileName

  return pathsHavingCustomNamespace.some((pattern) =>
    minimatch(fileName, pattern, {
      matchBase: true,
    })
  )
}
