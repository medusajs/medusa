import ts from "typescript"

/**
 * Returns true if the given TypeScript type looks like a Zod schema,
 * by checking for the presence of the `_input` and `_output` branded properties
 * that all Zod types expose.
 */
export function isZodType(type: ts.Type): boolean {
  const inputProp = type.getProperty("_input")
  const outputProp = type.getProperty("_output")
  return !!(inputProp && outputProp)
}

/**
 * Returns true if the top-level Zod type IS a ZodEffects (i.e., has a `.transform()`
 * applied at the outermost level). This is different from checking if the type string
 * _contains_ "ZodEffects", which would also match ZodObject schemas whose shape
 * contains ZodEffects-wrapped fields (e.g., via `z.preprocess()`).
 */
export function isZodEffects(checker: ts.TypeChecker, type: ts.Type): boolean {
  // Check the symbol name of the type — for a ZodEffects the symbol is "ZodEffects"
  const symbol = type.getSymbol()
  if (symbol) {
    return symbol.getName() === "ZodEffects"
  }
  // Fallback: check if the type string starts with ZodEffects
  // (avoids false positives from nested ZodEffects fields)
  const typeStr = checker.typeToString(type)
  return typeStr.trimStart().startsWith("ZodEffects<")
}

/**
 * Resolves the `_input` type of a Zod schema — i.e. the pre-transform shape,
 * which represents what a caller would send in an HTTP request.
 */
export function getZodInputType(
  checker: ts.TypeChecker,
  zodType: ts.Type
): ts.Type | undefined {
  const inputSymbol = zodType.getProperty("_input")
  if (!inputSymbol) {
    return undefined
  }
  return checker.getTypeOfSymbol(inputSymbol)
}

/**
 * Resolves the `_output` type of a Zod schema — the post-transform inferred type,
 * equivalent to `z.infer<typeof schema>`.
 */
export function getZodOutputType(
  checker: ts.TypeChecker,
  zodType: ts.Type
): ts.Type | undefined {
  const outputSymbol = zodType.getProperty("_output")
  if (!outputSymbol) {
    return undefined
  }
  return checker.getTypeOfSymbol(outputSymbol)
}

const OPERATOR_MAP_PROPS = ["$eq", "$ne", "$in", "$nin", "$gt", "$gte", "$lt", "$lte"]

/**
 * Returns true if the given type is an OperatorMap member — an object type
 * with filter operator properties ($eq, $ne, $in, etc.).
 */
function isOperatorMapMember(type: ts.Type): boolean {
  const props = type.getProperties().map((p) => p.name)
  const matchCount = OPERATOR_MAP_PROPS.filter((op) => props.includes(op)).length
  return matchCount >= 4
}

/**
 * Detects if a resolved type looks like an `OperatorMap` — a union that
 * includes an object with filter operator properties ($eq, $ne, $in, etc.).
 *
 * The OperatorMap is a union of `T | T[] | { $eq: ..., $ne: ..., ... }`.
 * We need to check union members for the object with operator properties.
 */
export function isOperatorMapType(type: ts.Type): boolean {
  if (type.isUnion()) {
    return type.types.some((t) => isOperatorMapMember(t))
  }
  return isOperatorMapMember(type)
}

/**
 * Returns a simplified display string for a TypeScript type, suitable for
 * use in error messages and diagnostics.
 */
export function typeToDisplayString(
  checker: ts.TypeChecker,
  type: ts.Type
): string {
  return checker.typeToString(
    type,
    undefined,
    ts.TypeFormatFlags.NoTruncation |
      ts.TypeFormatFlags.UseFullyQualifiedType
  )
}

/**
 * Recursively walks a call expression chain to check if any call in the chain
 * uses the given function name.
 *
 * Matches both direct calls (`funcName(...)`) and method calls (`obj.funcName(...)`).
 */
export function callChainIncludes(node: ts.Node, funcName: string): boolean {
  if (ts.isCallExpression(node)) {
    const expr = node.expression
    // Direct call: funcName(...)
    if (ts.isIdentifier(expr) && expr.text === funcName) {
      return true
    }
    // Method call: something.funcName(...)
    if (
      ts.isPropertyAccessExpression(expr) &&
      expr.name.text === funcName
    ) {
      return true
    }
    // Recurse into the callee expression
    return callChainIncludes(expr, funcName)
  }
  if (ts.isPropertyAccessExpression(node)) {
    return callChainIncludes(node.expression, funcName)
  }
  return false
}

/**
 * Returns true if the given type is plain `string` (not a literal or union).
 */
export function isPlainString(type: ts.Type): boolean {
  return !!(type.flags & ts.TypeFlags.String)
}

/**
 * Returns true if the type is a string literal or a union of string literals
 * (i.e. a string enum or `"a" | "b"` union).
 */
export function isStringLiteralOrUnion(type: ts.Type): boolean {
  if (type.flags & ts.TypeFlags.StringLiteral) {
    return true
  }
  if (type.isUnion()) {
    return type.types.every((t) => !!(t.flags & ts.TypeFlags.StringLiteral))
  }
  return false
}

/**
 * Returns true if the type is a TypeScript string enum or a union of string
 * enum literals (e.g. `OrderStatus` where each member is `"pending" | "completed" | ...`).
 * String enums use `TypeFlags.EnumLiteral` for members.
 */
export function isStringEnumType(type: ts.Type): boolean {
  if (
    (type.flags & ts.TypeFlags.EnumLiteral) &&
    (type.flags & ts.TypeFlags.StringLiteral)
  ) {
    return true
  }
  if (type.isUnion()) {
    return type.types.every(
      (t) =>
        (t.flags & ts.TypeFlags.EnumLiteral) &&
        (t.flags & ts.TypeFlags.StringLiteral)
    )
  }
  return false
}

/**
 * Returns the set of string values from a string literal type or a union of
 * string literals.
 */
export function getStringLiteralValues(type: ts.Type): Set<string> {
  const values = new Set<string>()
  if (type.flags & ts.TypeFlags.StringLiteral) {
    values.add((type as ts.StringLiteralType).value)
  } else if (type.isUnion()) {
    for (const t of type.types) {
      if (t.flags & ts.TypeFlags.StringLiteral) {
        values.add((t as ts.StringLiteralType).value)
      }
    }
  }
  return values
}

/**
 * Checks whether the given node has an `export` modifier.
 */
export function isExported(node: ts.Node): boolean {
  return (
    ts.canHaveModifiers(node) &&
    (ts.getModifiers(node) ?? []).some(
      (mod) => mod.kind === ts.SyntaxKind.ExportKeyword
    )
  )
}

/**
 * Returns the first VariableDeclaration inside a VariableStatement.
 */
export function getVariableDeclaration(
  stmt: ts.VariableStatement
): ts.VariableDeclaration | undefined {
  return stmt.declarationList.declarations[0]
}

/**
 * Reads the `@http-type-name` JSDoc tag value from the leading comments
 * of a VariableStatement node, if present.
 *
 * @example
 *   // @http-type-name AdminProductListParams
 *   export const AdminGetProductsParams = ...
 */
export function readHttpTypeNameTag(
  node: ts.VariableStatement,
  sourceFile: ts.SourceFile
): string | undefined {
  const jsDocTags = ts.getJSDocTags(node)
  for (const tag of jsDocTags) {
    if (tag.tagName.text === "http-type-name") {
      const comment = tag.comment
      if (typeof comment === "string") {
        return comment.trim()
      }
    }
  }
  return undefined
}

/**
 * Given a call expression like `WithAdditionalData(CreateCustomer)`,
 * returns the text of the first argument identifier ("CreateCustomer").
 */
export function getFirstCallArgName(
  node: ts.VariableDeclaration
): string | undefined {
  const initializer = node.initializer
  if (!initializer || !ts.isCallExpression(initializer)) {
    return undefined
  }
  const firstArg = initializer.arguments[0]
  if (!firstArg || !ts.isIdentifier(firstArg)) {
    return undefined
  }
  return firstArg.text
}

/**
 * Checks whether a TypeScript type is a function type (as opposed to an object/Zod type).
 */
export function isFunctionType(type: ts.Type): boolean {
  const callSignatures = type.getCallSignatures()
  return callSignatures.length > 0
}
