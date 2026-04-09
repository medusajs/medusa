import ts from "typescript"
import { TsHelpers } from "../utils/ts-helpers"
import { NameClassifier } from "../mapping/name-classifier"

export interface ExtractedSchema {
  /** The export name from the validator file (e.g., "AdminCreateCustomer") */
  exportName: string
  /**
   * The HTTP type name to use in the output file. Defaults to `exportName`
   * unless overridden by a `@http-type-name` tag or the name registry.
   */
  httpTypeName: string
  /** The Zod schema TypeScript type (the variable's declared type) */
  zodType: ts.Type
  /**
   * For `WithAdditionalData`-wrapped schemas, this is the inner schema's
   * type (the first argument passed to `WithAdditionalData`).
   * When present, use this for type resolution instead of `zodType`.
   */
  innerSchemaType?: ts.Type
  /** Whether the schema has a `.transform()` applied (ZodEffects) */
  hasTransform: boolean
  /**
   * For schemas that use `applyAndAndOrOperators(baseFieldsSchema)`, this is
   * the resolved type of `baseFieldsSchema`. The circular lazy types in
   * `applyAndAndOrOperators` break TypeScript's type resolution for the
   * merged schema, so we fall back to using the base fields schema's type.
   */
  baseFieldsType?: ts.Type
  /** Whether the schema's call chain includes `createFindParams()` */
  hasFindParamsInChain: boolean
  /** Whether the schema's call chain includes `createSelectParams()` (but NOT createFindParams) */
  hasSelectParamsInChain: boolean
  /** The source node for diagnostic reporting */
  node: ts.VariableDeclaration
}

/**
 * Extracts exported Zod schemas from TypeScript source files.
 */
export class SchemaExtractor {
  /**
   * Names of wrapper/utility functions that produce function types rather than
   * Zod schema types directly.
   */
  private static readonly ADDITIONAL_DATA_WRAPPERS = new Set([
    "WithAdditionalData",
  ])

  constructor(private readonly checker: ts.TypeChecker) {}

  /**
   * Extracts all exported Zod schemas from a TypeScript source file.
   *
   * Handles the following patterns:
   * - `export const AdminCreateCustomer = z.object({...})`
   * - `export const AdminCreateCustomer = WithAdditionalData(CreateCustomer)`
   * - `export const AdminGetProductsParams = createFindParams().merge(...).transform(...)`
   */
  extract(sourceFile: ts.SourceFile): ExtractedSchema[] {
    const results: ExtractedSchema[] = []

    const localSymbolTypes = this.buildLocalSymbolTypes(sourceFile)
    const localInnerSchemaTypes = this.buildLocalInnerSchemaTypes(
      sourceFile,
      localSymbolTypes
    )

    ts.forEachChild(sourceFile, (node) => {
      if (!ts.isVariableStatement(node) || !TsHelpers.isExported(node)) {
        return
      }

      const decl = TsHelpers.getVariableDeclaration(node)
      if (!decl || !ts.isIdentifier(decl.name)) {
        return
      }

      const exportName = decl.name.text

      if (NameClassifier.classify(exportName) === "skip") {
        return
      }

      const httpTypeNameOverride = TsHelpers.readHttpTypeNameTag(
        node,
        sourceFile
      )
      const httpTypeName = httpTypeNameOverride ?? exportName

      const zodType = this.checker.getTypeAtLocation(decl)

      // Case 1: WithAdditionalData wrapper → resolve the inner schema
      if (this.isAdditionalDataWrapper(decl)) {
        const innerName = TsHelpers.getFirstCallArgName(decl)
        const innerType = innerName
          ? localSymbolTypes.get(innerName)
          : undefined

        if (innerType && TsHelpers.isZodType(innerType)) {
          results.push({
            exportName,
            httpTypeName,
            zodType: innerType,
            innerSchemaType: innerType,
            hasTransform: false,
            hasFindParamsInChain: false,
            hasSelectParamsInChain: false,
            node: decl,
          })
        }
        return
      }

      // Case 2: Function type — either an alias of a WithAdditionalData result
      // or some other non-schema export.
      if (TsHelpers.isFunctionType(zodType)) {
        if (decl.initializer && ts.isIdentifier(decl.initializer)) {
          const innerType = localInnerSchemaTypes.get(decl.initializer.text)
          if (innerType) {
            results.push({
              exportName,
              httpTypeName,
              zodType: innerType,
              innerSchemaType: innerType,
              hasTransform: false,
              hasFindParamsInChain: false,
              hasSelectParamsInChain: false,
              node: decl,
            })
          }
        }
        return
      }

      // Case 3: Standard Zod schema
      if (!TsHelpers.isZodType(zodType)) {
        return
      }

      const hasTransform = TsHelpers.isZodEffects(this.checker, zodType)

      let baseFieldsType: ts.Type | undefined
      let hasFindParamsInChain = false
      let hasSelectParamsInChain = false

      if (decl.initializer) {
        hasFindParamsInChain = TsHelpers.callChainIncludes(
          decl.initializer,
          "createFindParams"
        )
        hasSelectParamsInChain =
          !hasFindParamsInChain &&
          TsHelpers.callChainIncludes(
            decl.initializer,
            "createSelectParams"
          )

        const baseFieldsName = this.findApplyAndAndOrOperatorsArg(
          decl.initializer
        )
        if (baseFieldsName) {
          baseFieldsType = localSymbolTypes.get(baseFieldsName)
        }
      }

      results.push({
        exportName,
        httpTypeName,
        zodType,
        hasTransform,
        baseFieldsType,
        hasFindParamsInChain,
        hasSelectParamsInChain,
        node: decl,
      })
    })

    return results
  }

  /**
   * Builds a symbol table of all variable declarations in this file.
   */
  private buildLocalSymbolTypes(
    sourceFile: ts.SourceFile
  ): Map<string, ts.Type> {
    const localSymbolTypes = new Map<string, ts.Type>()

    ts.forEachChild(sourceFile, (node) => {
      if (
        ts.isVariableStatement(node) &&
        node.declarationList.declarations.length > 0
      ) {
        const decl = node.declarationList.declarations[0]
        if (ts.isIdentifier(decl.name)) {
          const type = this.checker.getTypeAtLocation(decl)
          localSymbolTypes.set(decl.name.text, type)
        }
      }
    })

    return localSymbolTypes
  }

  /**
   * Builds a map from WithAdditionalData binding name → its resolved inner schema type.
   */
  private buildLocalInnerSchemaTypes(
    sourceFile: ts.SourceFile,
    localSymbolTypes: Map<string, ts.Type>
  ): Map<string, ts.Type> {
    const localInnerSchemaTypes = new Map<string, ts.Type>()

    ts.forEachChild(sourceFile, (node) => {
      if (
        ts.isVariableStatement(node) &&
        node.declarationList.declarations.length > 0
      ) {
        const decl = node.declarationList.declarations[0]
        if (!ts.isIdentifier(decl.name)) return
        if (!this.isAdditionalDataWrapper(decl)) return

        const innerName = TsHelpers.getFirstCallArgName(decl)
        const innerType = innerName
          ? localSymbolTypes.get(innerName)
          : undefined
        if (innerType && TsHelpers.isZodType(innerType)) {
          localInnerSchemaTypes.set(decl.name.text, innerType)
        }
      }
    })

    return localInnerSchemaTypes
  }

  /**
   * Determines whether the initializer of a variable declaration calls a
   * `WithAdditionalData`-style wrapper function.
   */
  private isAdditionalDataWrapper(node: ts.VariableDeclaration): boolean {
    const initializer = node.initializer
    if (!initializer || !ts.isCallExpression(initializer)) {
      return false
    }
    const callee = initializer.expression
    const calleeName = ts.isIdentifier(callee) ? callee.text : ""
    return SchemaExtractor.ADDITIONAL_DATA_WRAPPERS.has(calleeName)
  }

  /**
   * Finds the first argument name passed to `applyAndAndOrOperators(...)` anywhere
   * in the call chain of the given initializer node.
   */
  private findApplyAndAndOrOperatorsArg(
    node: ts.Node,
    depth = 0
  ): string | undefined {
    if (depth > 10 || !ts.isCallExpression(node)) {
      return undefined
    }

    const expr = node.expression

    if (ts.isIdentifier(expr) && expr.text === "applyAndAndOrOperators") {
      const firstArg = node.arguments[0]
      if (firstArg && ts.isIdentifier(firstArg)) {
        return firstArg.text
      }
    }

    const fromCallee = ts.isPropertyAccessExpression(expr)
      ? this.findApplyAndAndOrOperatorsArg(expr.expression, depth + 1)
      : this.findApplyAndAndOrOperatorsArg(expr, depth + 1)
    if (fromCallee) return fromCallee

    for (const arg of node.arguments) {
      const fromArg = this.findApplyAndAndOrOperatorsArg(arg, depth + 1)
      if (fromArg) return fromArg
    }

    return undefined
  }
}
