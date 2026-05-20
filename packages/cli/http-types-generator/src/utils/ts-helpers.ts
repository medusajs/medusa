import ts from "typescript"

export class TsHelpers {
  private static readonly OPERATOR_MAP_PROPS = [
    "$eq",
    "$ne",
    "$in",
    "$nin",
    "$gt",
    "$gte",
    "$lt",
    "$lte",
  ]

  /**
   * Returns true if the given TypeScript type looks like a Zod schema,
   * by checking for the presence of the `_input` and `_output` branded properties
   * that all Zod types expose (v3), or the `_zod` internal property (v4).
   */
  static isZodType(type: ts.Type): boolean {
    const inputProp = type.getProperty("_input")
    const outputProp = type.getProperty("_output")
    if (inputProp && outputProp) return true
    // Zod v4: _zod is the primary internal property on all schema types
    return !!type.getProperty("_zod")
  }

  /**
   * Returns true if the top-level Zod type IS a ZodPipe (produced by
   * `.transform()` or `z.preprocess()`) applied at the outermost level.
   * This is different from checking if the type string _contains_ "ZodPipe",
   * which would also match schemas whose shape contains such fields.
   */
  static isZodEffects(checker: ts.TypeChecker, type: ts.Type): boolean {
    const symbol = type.getSymbol()
    if (symbol) {
      const name = symbol.getName()
      if (name === "ZodPipe") return true
    }
    const typeStr = checker.typeToString(type)
    return typeStr.trimStart().startsWith("ZodPipe<")
  }

  /**
   * Resolves the `_input` type of a Zod schema — i.e. the pre-transform shape,
   * which represents what a caller would send in an HTTP request.
   */
  static getZodInputType(
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
  static getZodOutputType(
    checker: ts.TypeChecker,
    zodType: ts.Type
  ): ts.Type | undefined {
    const outputSymbol = zodType.getProperty("_output")
    if (!outputSymbol) {
      return undefined
    }
    return checker.getTypeOfSymbol(outputSymbol)
  }

  /**
   * Returns true if a type has OperatorMap member properties ($eq, $ne, $in, etc.).
   */
  private static isOperatorMapMember(type: ts.Type): boolean {
    const props = type.getProperties().map((p) => p.name)
    const matchCount = TsHelpers.OPERATOR_MAP_PROPS.filter((op) =>
      props.includes(op)
    ).length
    return matchCount >= 4
  }

  /**
   * Detects if a resolved type looks like an `OperatorMap` — a union that
   * includes an object with filter operator properties ($eq, $ne, $in, etc.).
   */
  static isOperatorMapType(type: ts.Type): boolean {
    if (type.isUnion()) {
      return type.types.some((t) => TsHelpers.isOperatorMapMember(t))
    }
    return TsHelpers.isOperatorMapMember(type)
  }

  /**
   * Returns a simplified display string for a TypeScript type, suitable for
   * use in error messages and diagnostics.
   */
  static typeToDisplayString(
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
   */
  static callChainIncludes(node: ts.Node, funcName: string): boolean {
    if (ts.isCallExpression(node)) {
      const expr = node.expression
      if (ts.isIdentifier(expr) && expr.text === funcName) {
        return true
      }
      if (
        ts.isPropertyAccessExpression(expr) &&
        expr.name.text === funcName
      ) {
        return true
      }
      return TsHelpers.callChainIncludes(expr, funcName)
    }
    if (ts.isPropertyAccessExpression(node)) {
      return TsHelpers.callChainIncludes(node.expression, funcName)
    }
    return false
  }

  /**
   * Returns true if the given type is plain `string` (not a literal or union).
   */
  static isPlainString(type: ts.Type): boolean {
    return !!(type.flags & ts.TypeFlags.String)
  }

  /**
   * Returns true if the type is a string literal or a union of string literals.
   */
  static isStringLiteralOrUnion(type: ts.Type): boolean {
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
   * enum literals.
   */
  static isStringEnumType(type: ts.Type): boolean {
    if (
      type.flags & ts.TypeFlags.EnumLiteral &&
      type.flags & ts.TypeFlags.StringLiteral
    ) {
      return true
    }
    if (type.isUnion()) {
      return type.types.every(
        (t) =>
          t.flags & ts.TypeFlags.EnumLiteral &&
          t.flags & ts.TypeFlags.StringLiteral
      )
    }
    return false
  }

  /**
   * Returns the set of string values from a string literal type or a union of
   * string literals.
   */
  static getStringLiteralValues(type: ts.Type): Set<string> {
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
   * Returns true if the given symbol has a `@http-validation-ignore` JSDoc tag.
   * Properties with this tag are excluded from compatibility validation.
   */
  static hasHttpValidationIgnoreTag(symbol: ts.Symbol): boolean {
    const decl = symbol.valueDeclaration
    if (!decl) {
      return false
    }
    for (const tag of ts.getJSDocTags(decl)) {
      if (tag.tagName.text === "http-validation-ignore") {
        return true
      }
    }
    return false
  }

  /**
   * Checks whether the given node has an `export` modifier.
   */
  static isExported(node: ts.Node): boolean {
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
  static getVariableDeclaration(
    stmt: ts.VariableStatement
  ): ts.VariableDeclaration | undefined {
    return stmt.declarationList.declarations[0]
  }

  /**
   * Reads the `@http-type-name` JSDoc tag value from the leading comments
   * of a VariableStatement node, if present.
   */
  static readHttpTypeNameTag(
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
  static getFirstCallArgName(
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
  static isFunctionType(type: ts.Type): boolean {
    const callSignatures = type.getCallSignatures()
    return callSignatures.length > 0
  }
}
