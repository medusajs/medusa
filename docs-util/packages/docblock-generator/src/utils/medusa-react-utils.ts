import path from "path"
import getMonorepoRoot from "./get-monorepo-root.js"
import ts from "typescript"
import { minimatch } from "minimatch"

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

  if (!fileName.startsWith("index")) {
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
        .map(
          (item) =>
            `${item.charAt(0).toUpperCase()}${
              item.length > 1 ? item.substring(1) : ""
            }`
        )
        .join(" ")
    })
    .join(".")
}

export function getCustomNamespaceTag(node: ts.Node): string {
  return `${CUSTOM_NAMESPACE_TAG} ${getNamespacePath(node)}`
}

export function shouldHaveNamespace(node: ts.Node): boolean {
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
