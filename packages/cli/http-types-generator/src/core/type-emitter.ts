import ts from "typescript"
import path from "path"
import { existsSync, readFileSync } from "fs"
import type { ResolvedSchemaType, PropertyInfo } from "./type-resolver"
import { TypeResolver } from "./type-resolver"
import { FsHelpers } from "../utils/fs-helpers"
import { Config } from "../config"
import type { ImportTracker } from "./import-tracker"

export interface EmittedInterface {
  name: string
  code: string
}

/**
 * Emits TypeScript interface declarations from resolved Zod schema types and
 * assembles complete output files with the correct import statements.
 */
export class TypeEmitter {
  constructor(private readonly checker: ts.TypeChecker) {}

  /**
   * Emits a TypeScript interface declaration as a string from a resolved schema type.
   *
   * @param interfaceName - The name for the generated interface
   * @param resolved - The resolved schema type info
   * @param importTracker - Mutable tracker that records which imports are needed
   */
  emitInterface(
    interfaceName: string,
    resolved: ResolvedSchemaType,
    importTracker: ImportTracker
  ): string {
    const { type, hasFindParams, hasSelectParams, hasBaseFilterable } = resolved

    if (hasFindParams) {
      importTracker.needsFindParams = true
    }
    if (hasSelectParams) {
      importTracker.needsSelectParams = true
    }
    if (hasBaseFilterable) {
      importTracker.needsBaseFilterable = true
    }

    const resolver = new TypeResolver(this.checker)
    const properties = resolver.resolveProperties(
      type,
      hasFindParams,
      hasSelectParams
    )

    const hasOperatorMapProp = properties.some((p) => p.isOperatorMap)
    if (hasOperatorMapProp) {
      importTracker.needsOperatorMap = true
    }

    const members: ts.PropertySignature[] = []
    for (const prop of properties) {
      if (prop.isFindParamsField) {
        continue
      }
      members.push(this.createPropertySignature(prop))
    }

    const heritageClauses = TypeEmitter.createHeritageClauses(
      interfaceName,
      hasFindParams,
      hasSelectParams,
      hasBaseFilterable
    )

    const interfaceDecl = ts.factory.createInterfaceDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier(interfaceName),
      undefined,
      heritageClauses,
      members
    )

    const printer = TypeEmitter.createPrinter()
    const dummyFile = TypeEmitter.createDummySourceFile()
    return printer.printNode(ts.EmitHint.Unspecified, interfaceDecl, dummyFile)
  }

  /**
   * Assembles a complete TypeScript file from a list of emitted interfaces.
   *
   * @param interfaces - The interfaces to include
   * @param importTracker - What imports are needed
   * @param outputFile - Absolute path to the file being written (used to compute relative imports)
   */
  static assembleFile(
    interfaces: EmittedInterface[],
    importTracker: ImportTracker,
    outputFile: string
  ): string {
    const bodyParts: string[] = []
    for (const iface of interfaces) {
      bodyParts.push(iface.code)
      bodyParts.push("")
    }
    const { content: cleanedBody, imports: hoistedImports } =
      TypeEmitter.hoistInlineImports(bodyParts.join("\n"), outputFile)

    const parts: string[] = []

    const trackerImports = TypeEmitter.generateImports(
      importTracker,
      outputFile
    )
    if (trackerImports) {
      parts.push(trackerImports)
    }

    for (const [source, typeNames] of hoistedImports) {
      const names = [...typeNames].sort().join(", ")
      parts.push(`import type { ${names} } from "${source}"`)
    }

    if (parts.length > 0) {
      parts.push("")
    }

    parts.push(cleanedBody)

    return parts.join("\n")
  }

  /**
   * Creates a `ts.PropertySignature` for an interface member from a `PropertyInfo`.
   */
  private createPropertySignature(
    prop: PropertyInfo,
    enclosingNode?: ts.Node
  ): ts.PropertySignature {
    let typeNode: ts.TypeNode

    if (prop.isOperatorMap) {
      typeNode = TypeEmitter.makeOperatorMapTypeNode()
    } else {
      typeNode = this.typeToTypeNode(prop.type, enclosingNode)
    }

    return ts.factory.createPropertySignature(
      undefined,
      ts.factory.createIdentifier(prop.name),
      prop.isOptional
        ? ts.factory.createToken(ts.SyntaxKind.QuestionToken)
        : undefined,
      typeNode
    )
  }

  /**
   * Converts a TypeScript `ts.Type` to a `ts.TypeNode` using the type checker.
   * Falls back to `any` if conversion fails.
   */
  private typeToTypeNode(
    type: ts.Type,
    enclosingNode?: ts.Node
  ): ts.TypeNode {
    const typeNode = this.checker.typeToTypeNode(
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
   * Resolves an import source to an import specifier string.
   * If `target` is a bare package name (starts with `@` or contains no `/` after
   * stripping scope), it is returned as-is. Otherwise it is treated as a
   * project-root-relative path and converted to a relative import path.
   */
  private static resolveImportPath(
    outputFile: string,
    target: string
  ): string {
    // Package specifier: starts with "@" (scoped) or has no path separators
    const isPackageSpecifier =
      target.startsWith("@") || !target.includes("/")
    if (isPackageSpecifier) {
      return target
    }
    const fromDir = path.dirname(outputFile)
    const toDir = FsHelpers.fromRoot(target)
    const rel = path.relative(fromDir, toDir).replace(/\\/g, "/")
    return rel.startsWith(".") ? rel : "./" + rel
  }

  private static createPrinter(): ts.Printer {
    return ts.createPrinter({
      newLine: ts.NewLineKind.LineFeed,
      removeComments: false,
    })
  }

  private static createDummySourceFile(): ts.SourceFile {
    return ts.createSourceFile(
      "output.ts",
      "",
      ts.ScriptTarget.Latest,
      false,
      ts.ScriptKind.TS
    )
  }

  /**
   * Generates a `ts.TypeNode` for an OperatorMap field.
   */
  private static makeOperatorMapTypeNode(): ts.TypeNode {
    return ts.factory.createTypeReferenceNode(
      ts.factory.createIdentifier("OperatorMap"),
      [ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)]
    )
  }

  /**
   * Creates heritage clauses (extends ...) for an interface declaration.
   */
  private static createHeritageClauses(
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
      ts.factory.createHeritageClause(
        ts.SyntaxKind.ExtendsKeyword,
        expressions
      ),
    ]
  }

  /**
   * Generates the import statements for a file based on what types were referenced.
   */
  private static generateImports(
    tracker: ImportTracker,
    outputFile: string
  ): string {
    const lines: string[] = []

    const commonTypes: string[] = []
    if (tracker.needsFindParams) commonTypes.push("FindParams")
    if (tracker.needsSelectParams) commonTypes.push("SelectParams")

    if (commonTypes.length > 0) {
      lines.push(
        `import { ${commonTypes.join(", ")} } from "${TypeEmitter.resolveImportPath(outputFile, Config.get().importSources.commonRequest)}"`
      )
    }

    const dalTypes: string[] = []
    if (tracker.needsBaseFilterable) dalTypes.push("BaseFilterable")
    if (tracker.needsOperatorMap) dalTypes.push("OperatorMap")

    if (dalTypes.length > 0) {
      lines.push(
        `import { ${dalTypes.join(", ")} } from "${TypeEmitter.resolveImportPath(outputFile, Config.get().importSources.dal)}"`
      )
    }

    return lines.join("\n")
  }

  /**
   * Walks up the directory tree from `startPath` to find the nearest `package.json`
   * and returns its `name` field, or `undefined` if none is found.
   */
  private static findPackageName(startPath: string): string | undefined {
    const monorepoRoot = FsHelpers.fromRoot()
    let dir = startPath
    while (dir !== monorepoRoot) {
      const parent = path.dirname(dir)
      if (parent === dir) break
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
   * Scans `content` for inline TypeScript import expressions, extracts them,
   * and replaces each with just the type name. Returns the cleaned content plus
   * a map of importSource → Set<typeName> for import statements to prepend.
   */
  private static hoistInlineImports(
    content: string,
    outputFile: string
  ): { content: string; imports: Map<string, Set<string>> } {
    const imports = new Map<string, Set<string>>()
    const INLINE_IMPORT_RE = /import\("([^"]+)"\)\.(\w+)/g

    const cleaned = content.replace(
      INLINE_IMPORT_RE,
      (_match, absolutePath: string, typeName: string) => {
        const packageName = TypeEmitter.findPackageName(absolutePath)
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
}
