import ts from "typescript"
import {
  isExported,
  getVariableDeclaration,
  readHttpTypeNameTag,
  getFirstCallArgName,
  isFunctionType,
  isZodType,
  isZodEffects,
  callChainIncludes,
} from "../utils/ts-helpers"
import { classifySchemaName } from "../mapping/name-classifier"

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
 * Names of wrapper/utility functions that produce function types rather than
 * Zod schema types directly. When a variable's initializer calls one of these,
 * we treat it as a "wrapped schema" and resolve the inner schema instead.
 */
const ADDITIONAL_DATA_WRAPPERS = new Set(["WithAdditionalData"])

/**
 * Determines whether the initializer of a variable declaration calls a
 * `WithAdditionalData`-style wrapper function.
 */
function isAdditionalDataWrapper(node: ts.VariableDeclaration): boolean {
  const initializer = node.initializer
  // Call Expression: e.g. `WithAdditionalData(CreateCustomer)`
  if (!initializer || !ts.isCallExpression(initializer)) {
    return false
  }
  const callee = initializer.expression
  const calleeName = ts.isIdentifier(callee) ? callee.text : ""
  return ADDITIONAL_DATA_WRAPPERS.has(calleeName)
}

/**
 * Finds the first argument name passed to `applyAndAndOrOperators(...)` anywhere
 * in the call chain of the given initializer node.
 *
 * For example, for:
 *   `createFindParams().merge(fields).merge(applyAndAndOrOperators(fields))`
 * returns "fields".
 */
function findApplyAndAndOrOperatorsArg(
  node: ts.Node,
  depth = 0
): string | undefined {
  if (depth > 10 || !ts.isCallExpression(node)) {
    return undefined
  }

  const expr = node.expression

  // Check if THIS call is applyAndAndOrOperators(X)
  if (ts.isIdentifier(expr) && expr.text === "applyAndAndOrOperators") {
    const firstArg = node.arguments[0]
    if (firstArg && ts.isIdentifier(firstArg)) {
      return firstArg.text
    }
  }

  // Recurse leftward through the call chain. For a call like `a().b().c()`,
  // `expr` is the property access `a().b().c` and `expr.expression` is `a().b()` —
  // the next link in the chain. For a plain call like `foo()`, `expr` is the
  // identifier `foo`, which hits the base case on the next recursion.
  const fromCallee = ts.isPropertyAccessExpression(expr)
    ? findApplyAndAndOrOperatorsArg(expr.expression, depth + 1)
    : findApplyAndAndOrOperatorsArg(expr, depth + 1)
  if (fromCallee) return fromCallee

  // Recurse into the arguments of the current call. This is what finds
  // `applyAndAndOrOperators(X)` when it appears as an argument rather than
  // as part of the chain itself, e.g. `schema.merge(applyAndAndOrOperators(X))`.
  for (const arg of node.arguments) {
    const fromArg = findApplyAndAndOrOperatorsArg(arg, depth + 1)
    if (fromArg) return fromArg
  }

  return undefined
}

/**
 * Extracts all exported Zod schemas from a TypeScript source file.
 *
 * Handles the following patterns:
 * - `export const AdminCreateCustomer = z.object({...})`
 * - `export const AdminCreateCustomer = WithAdditionalData(CreateCustomer)`
 * - `export const AdminGetProductsParams = createFindParams().merge(...).transform(...)`
 */
export function extractSchemasFromFile(
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker
): ExtractedSchema[] {
  const results: ExtractedSchema[] = []

  // Build a symbol table of all variable declarations in this file for
  // resolving inner schema references (e.g. `WithAdditionalData(CreateCustomer)`)
  const localSymbolTypes = new Map<string, ts.Type>()

  ts.forEachChild(sourceFile, (node) => {
    if (
      ts.isVariableStatement(node) &&
      node.declarationList.declarations.length > 0
    ) {
      const decl = node.declarationList.declarations[0]
      if (ts.isIdentifier(decl.name)) {
        const type = checker.getTypeAtLocation(decl)
        localSymbolTypes.set(decl.name.text, type)
      }
    }
  })

  // Build a map from WithAdditionalData binding name → its resolved inner schema type.
  // Used to handle aliases like `AdminUpdateCustomerAddress = AdminCreateCustomerAddress`
  // where the RHS is itself a WithAdditionalData result (function type).
  const localInnerSchemaTypes = new Map<string, ts.Type>()

  ts.forEachChild(sourceFile, (node) => {
    if (
      ts.isVariableStatement(node) &&
      node.declarationList.declarations.length > 0
    ) {
      const decl = node.declarationList.declarations[0]
      if (!ts.isIdentifier(decl.name)) return
      if (!isAdditionalDataWrapper(decl)) return

      const innerName = getFirstCallArgName(decl)
      const innerType = innerName ? localSymbolTypes.get(innerName) : undefined
      if (innerType && isZodType(innerType)) {
        localInnerSchemaTypes.set(decl.name.text, innerType)
      }
    }
  })

  // Now walk again to extract exported schemas
  ts.forEachChild(sourceFile, (node) => {
    if (!ts.isVariableStatement(node) || !isExported(node)) {
      return
    }

    const decl = getVariableDeclaration(node)
    if (!decl || !ts.isIdentifier(decl.name)) {
      return
    }

    const exportName = decl.name.text

    if (classifySchemaName(exportName) === "skip") {
      return
    }

    // Read @http-type-name annotation override if present
    const httpTypeNameOverride = readHttpTypeNameTag(node, sourceFile)
    const httpTypeName = httpTypeNameOverride ?? exportName

    const zodType = checker.getTypeAtLocation(decl)

    // Case 1: WithAdditionalData wrapper → resolve the inner schema
    if (isAdditionalDataWrapper(decl)) {
      const innerName = getFirstCallArgName(decl)
      const innerType = innerName ? localSymbolTypes.get(innerName) : undefined

      if (innerType && isZodType(innerType)) {
        results.push({
          exportName,
          httpTypeName,
          zodType: innerType,
          innerSchemaType: innerType,
          hasTransform: false, // inner schema is typically a plain ZodObject
          hasFindParamsInChain: false,
          hasSelectParamsInChain: false,
          node: decl,
        })
      }
      // If we can't resolve the inner schema, skip this export
      return
    }

    // Case 2: Function type — either an alias of a WithAdditionalData result
    // (e.g., `AdminUpdateCustomerAddress = AdminCreateCustomerAddress`) or some
    // other non-schema export. Resolve the alias if the RHS is a known
    // WithAdditionalData binding; otherwise skip.
    if (isFunctionType(zodType)) {
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

    // Case 3: Standard Zod schema (ZodObject, ZodEffects from merge/transform, etc.)
    if (!isZodType(zodType)) {
      // Not a Zod schema — skip
      return
    }

    const hasTransform = isZodEffects(checker, zodType)

    // Detect the applyAndAndOrOperators pattern and locate the base fields schema.
    // This is needed because applyAndAndOrOperators uses z.lazy() which creates
    // circular type references that prevent TypeScript from resolving the full
    // merged schema's properties. We fall back to the base fields schema.
    let baseFieldsType: ts.Type | undefined
    let hasFindParamsInChain = false
    let hasSelectParamsInChain = false

    if (decl.initializer) {
      hasFindParamsInChain = callChainIncludes(
        decl.initializer,
        "createFindParams"
      )
      // Only flag as selectParams when createFindParams is NOT present —
      // createFindParams already composes createSelectParams internally, so
      // a chain that includes createFindParams should extend FindParams, not SelectParams.
      hasSelectParamsInChain =
        !hasFindParamsInChain &&
        callChainIncludes(decl.initializer, "createSelectParams")

      const baseFieldsName = findApplyAndAndOrOperatorsArg(decl.initializer)
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
