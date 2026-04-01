import ts from "typescript"
import path from "path"
import { existsSync, readFileSync } from "fs"
import type { ResolvedSchemaType, PropertyInfo } from "./type-resolver"
import { resolveProperties } from "./type-resolver"
import { fromRoot } from "../utils/fs-helpers"
import type { ImportTracker } from "./import-tracker"

export interface EmittedInterface {
  name: string
  code: string
}

/**
 * Monorepo-relative paths to the directories that generated files import from.
 * At emit time these are resolved to relative import paths based on the output file location.
 */
const IMPORT_SOURCES = {
  COMMON_REQUEST: "packages/core/types/src/http/common",
  DAL: "packages/core/types/src/dal",
} as const

/**
 * Computes a relative import path from an output file to one of the IMPORT_SOURCES targets.
 */
function resolveImportPath(outputFile: string, target: string): string {
  const fromDir = path.dirname(outputFile)
  const toDir = fromRoot(target)
  const rel = path.relative(fromDir, toDir).replace(/\\/g, "/")
  return rel.startsWith(".") ? rel : "./" + rel
}

/**
 * Builds the TypeScript printer used to emit AST nodes to strings.
 */
function createPrinter(): ts.Printer {
  return ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: false,
  })
}

/**
 * Creates a dummy source file used as context for the printer.
 */
function createDummySourceFile(): ts.SourceFile {
  return ts.createSourceFile(
    "output.ts",
    "",
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS
  )
}

/**
 * Converts a TypeScript `ts.Type` to a `ts.TypeNode` using the type checker.
 * Falls back to `any` if conversion fails.
 */
function typeToTypeNode(
  checker: ts.TypeChecker,
  type: ts.Type,
  enclosingNode?: ts.Node
): ts.TypeNode {
  const typeNode = checker.typeToTypeNode(
    type,
    enclosingNode,
    ts.NodeBuilderFlags.NoTruncation |
      ts.NodeBuilderFlags.UseFullyQualifiedType |
      ts.NodeBuilderFlags.AllowThisInObjectLiteral
  )
  if (!typeNode) {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
  }
  return typeNode
}

/**
 * Generates a `ts.TypeNode` for an OperatorMap field.
 * Instead of emitting the full complex union, we emit `OperatorMap<string>`
 * which is what the HTTP types use for filter operator fields.
 */
function makeOperatorMapTypeNode(): ts.TypeNode {
  /**
   * Check if we can determine the value type (string vs number)
   * For simplicity, we default to `OperatorMap<string>` as most filter fields are strings.
   * The name `OperatorMap` will be imported from {@link IMPORT_SOURCES.DAL} in the generated file.
   */
  return ts.factory.createTypeReferenceNode(
    ts.factory.createIdentifier("OperatorMap"),
    [ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)]
  )
}

/**
 * Creates a `ts.PropertySignature` for an interface member from a `PropertyInfo`.
 */
function createPropertySignature(
  checker: ts.TypeChecker,
  prop: PropertyInfo,
  enclosingNode?: ts.Node
): ts.PropertySignature {
  let typeNode: ts.TypeNode

  if (prop.isOperatorMap) {
    typeNode = makeOperatorMapTypeNode()
  } else {
    typeNode = typeToTypeNode(checker, prop.type, enclosingNode)
  }

  return ts.factory.createPropertySignature(
    undefined, // modifiers
    ts.factory.createIdentifier(prop.name),
    prop.isOptional
      ? ts.factory.createToken(ts.SyntaxKind.QuestionToken)
      : undefined,
    typeNode
  )
}

/**
 * Creates heritage clauses (extends ...) for an interface declaration.
 *
 * - If `hasFindParams`: extends `FindParams` (from common request types)
 * - If `hasSelectParams`: extends `SelectParams` (from common request types)
 * - If `hasBaseFilterable`: extends `BaseFilterable<SelfName>`
 */
function createHeritageClauses(
  interfaceName: string,
  hasFindParams: boolean,
  hasSelectParams: boolean,
  hasBaseFilterable: boolean
): ts.HeritageClause[] {
  const expressions: ts.ExpressionWithTypeArguments[] = []

  if (hasFindParams) {
    expressions.push(
      ts.factory.createExpressionWithTypeArguments(
        ts.factory.createIdentifier("FindParams"),
        undefined
      )
    )
  }

  if (hasSelectParams) {
    expressions.push(
      ts.factory.createExpressionWithTypeArguments(
        ts.factory.createIdentifier("SelectParams"),
        undefined
      )
    )
  }

  if (hasBaseFilterable) {
    expressions.push(
      ts.factory.createExpressionWithTypeArguments(
        ts.factory.createIdentifier("BaseFilterable"),
        [
          ts.factory.createTypeReferenceNode(
            ts.factory.createIdentifier(interfaceName),
            undefined
          ),
        ]
      )
    )
  }

  if (expressions.length === 0) {
    return []
  }

  return [
    ts.factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, expressions),
  ]
}

/**
 * Emits a TypeScript interface declaration as a string from a resolved schema type.
 *
 * @param checker - The TypeScript type checker
 * @param interfaceName - The name for the generated interface
 * @param resolved - The resolved schema type info
 * @param importTracker - Mutable tracker that records which imports are needed
 */
export function emitInterface(
  checker: ts.TypeChecker,
  interfaceName: string,
  resolved: ResolvedSchemaType,
  importTracker: ImportTracker
): string {
  const { type, hasFindParams, hasSelectParams, hasBaseFilterable } = resolved

  // Update import tracker
  if (hasFindParams) {
    importTracker.needsFindParams = true
  }
  if (hasSelectParams) {
    importTracker.needsSelectParams = true
  }
  if (hasBaseFilterable) {
    importTracker.needsBaseFilterable = true
  }

  // Resolve properties, filtering out base-params fields when extending FindParams/SelectParams
  const properties = resolveProperties(checker, type, hasFindParams, hasSelectParams)

  // Check if any property uses OperatorMap
  const hasOperatorMapProp = properties.some((p) => p.isOperatorMap)
  if (hasOperatorMapProp) {
    importTracker.needsOperatorMap = true
  }

  // Build interface members, skipping fields inherited from FindParams/SelectParams
  const members: ts.PropertySignature[] = []
  for (const prop of properties) {
    if (prop.isFindParamsField) {
      continue
    }
    members.push(createPropertySignature(checker, prop))
  }

  // Build heritage clauses
  const heritageClauses = createHeritageClauses(
    interfaceName,
    hasFindParams,
    hasSelectParams,
    hasBaseFilterable
  )

  // Create the interface declaration
  const interfaceDecl = ts.factory.createInterfaceDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(interfaceName),
    undefined, // no type parameters
    heritageClauses,
    members
  )

  const printer = createPrinter()
  const dummyFile = createDummySourceFile()
  return printer.printNode(ts.EmitHint.Unspecified, interfaceDecl, dummyFile)
}

/**
 * Walks up the directory tree from `startPath` to find the nearest `package.json`
 * and returns its `name` field, or `undefined` if none is found.
 */
function findPackageName(startPath: string): string | undefined {
  const monorepoRoot = fromRoot()
  let dir = startPath
  while (dir !== monorepoRoot) {
    const parent = path.dirname(dir)
    if (parent === dir) break // filesystem root — should not happen inside the monorepo
    dir = parent
    const pkgPath = path.join(dir, "package.json")
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as {
          name?: string
        }
        if (pkg.name) return pkg.name
      } catch {
        // ignore malformed package.json
      }
    }
  }
  return undefined
}

/**
 * Scans `content` for inline TypeScript import expressions of the form
 * `import("absolutePath").TypeName`, extracts them, and replaces each with
 * just `TypeName`. Returns the cleaned content plus a map of
 * `importSource → Set<typeName>` for the import statements to prepend.
 *
 * The import source is resolved by walking up from `absolutePath` to find the
 * nearest `package.json` and using its `name` field. If no package is found,
 * a relative path from `outputFile` is used as a fallback.
 */
function hoistInlineImports(
  content: string,
  outputFile: string
): { content: string; imports: Map<string, Set<string>> } {
  const imports = new Map<string, Set<string>>()
  // Matches: import("/absolute/path").TypeName
  const INLINE_IMPORT_RE = /import\("([^"]+)"\)\.(\w+)/g

  const cleaned = content.replace(
    INLINE_IMPORT_RE,
    (_match, absolutePath: string, typeName: string) => {
      const packageName = findPackageName(absolutePath)
      const importSource =
        packageName ??
        (() => {
          const rel = path
            .relative(path.dirname(outputFile), absolutePath)
            .replace(/\\/g, "/")
          return rel.startsWith(".") ? rel : "./" + rel
        })()

      if (!imports.has(importSource)) {
        imports.set(importSource, new Set())
      }
      imports.get(importSource)!.add(typeName)
      return typeName
    }
  )

  return { content: cleaned, imports }
}

/**
 * Generates the import statements for a file based on what types were referenced.
 */
function generateImports(tracker: ImportTracker, outputFile: string): string {
  const lines: string[] = []

  const commonTypes: string[] = []
  if (tracker.needsFindParams) commonTypes.push("FindParams")
  if (tracker.needsSelectParams) commonTypes.push("SelectParams")

  if (commonTypes.length > 0) {
    lines.push(
      `import { ${commonTypes.join(", ")} } from "${resolveImportPath(outputFile, IMPORT_SOURCES.COMMON_REQUEST)}"`
    )
  }

  const dalTypes: string[] = []
  if (tracker.needsBaseFilterable) dalTypes.push("BaseFilterable")
  if (tracker.needsOperatorMap) dalTypes.push("OperatorMap")

  if (dalTypes.length > 0) {
    lines.push(
      `import { ${dalTypes.join(", ")} } from "${resolveImportPath(outputFile, IMPORT_SOURCES.DAL)}"`
    )
  }

  return lines.join("\n")
}

/**
 * Assembles a complete TypeScript file from a list of emitted interfaces.
 *
 * @param interfaces - The interfaces to include
 * @param importTracker - What imports are needed
 * @param outputFile - Absolute path to the file being written (used to compute relative imports)
 */
export function assembleFile(
  interfaces: EmittedInterface[],
  importTracker: ImportTracker,
  outputFile: string
): string {
  // Join all interface bodies first so hoistInlineImports sees the full content
  const bodyParts: string[] = []
  for (const iface of interfaces) {
    bodyParts.push(iface.code)
    bodyParts.push("") // blank line between interfaces
  }
  const { content: cleanedBody, imports: hoistedImports } = hoistInlineImports(
    bodyParts.join("\n"),
    outputFile
  )

  const parts: string[] = []

  // Known tracker imports (FindParams, BaseFilterable, etc.)
  const trackerImports = generateImports(importTracker, outputFile)
  if (trackerImports) {
    parts.push(trackerImports)
  }

  // Hoisted inline imports (e.g. import type { TransactionHandlerType } from "@medusajs/utils")
  for (const [source, typeNames] of hoistedImports) {
    const names = [...typeNames].sort().join(", ")
    parts.push(`import type { ${names} } from "${source}"`)
  }

  if (parts.length > 0) {
    parts.push("") // blank line after the import block
  }

  parts.push(cleanedBody)

  return parts.join("\n")
}
